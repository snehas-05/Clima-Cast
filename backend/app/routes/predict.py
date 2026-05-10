from fastapi import APIRouter, Depends, Query, Request, HTTPException
from sqlalchemy.orm import Session
import asyncio
import logging
from datetime import datetime, timedelta
import numpy as np
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.database.connection import get_db
from app.ml.model_loader import get_models, get_model_metrics
from app.ml.explainer import get_shap_explanation
from app.models.prediction_log import PredictionLog
from app.schemas.predict import (
    RainPredictionRequest, TempPredictionRequest, 
    HumidityPredictionRequest, AlertPredictionRequest,
    PredictionResponse
)

logger = logging.getLogger(__name__)
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

# Simple in-memory cache for Prophet (7 days)
_trend_cache = {}

def log_prediction(db: Session, city: str, model_type: str, value: str, confidence: float, ip: str):
    try:
        log = PredictionLog(
            city=city,
            model_type=model_type,
            prediction_value=value,
            confidence=confidence,
            ip_address=ip
        )
        db.add(log)
        db.commit()
    except Exception as e:
        logger.error(f"Failed to log prediction: {e}")

@router.get("/rain", response_model=PredictionResponse)
@limiter.limit("30/minute")
async def predict_rain(
    request: Request,
    city: str,
    humidity_9am: float = 50,
    humidity_3pm: float = 50,
    pressure_9am: float = 1013,
    pressure_3pm: float = 1013,
    temp_9am: float = 20,
    max_temp: float = 30,
    min_temp: float = 15,
    wind_speed_9am: float = 10,
    wind_speed_3pm: float = 10,
    rain_today: int = 0,
    db: Session = Depends(get_db)
):
    models = get_models()
    if "rain" not in models:
        return PredictionResponse(success=False, ml_available=False, model="rain", city=city, prediction={}, message="Rain model not loaded")

    try:
        features = [humidity_9am, humidity_3pm, pressure_9am, pressure_3pm, temp_9am, max_temp, min_temp, wind_speed_9am, wind_speed_3pm, rain_today]
        feature_names = ['Humidity9am', 'Humidity3pm', 'Pressure9am', 'Pressure3pm', 'Temp9am', 'MaxTemp', 'MinTemp', 'WindSpeed9am', 'WindSpeed3pm', 'RainToday']
        
        # Timeout protection
        input_data = np.array(features).reshape(1, -1)
        
        async def run_inference():
            prob = models["rain"].predict_proba(input_data)[0][1]
            pred = "Yes" if prob > 0.5 else "No"
            explanation = get_shap_explanation(models["rain"], input_data, feature_names)
            return prob, pred, explanation

        prob, pred, explanation = await asyncio.wait_for(run_inference(), timeout=5.0)
        
        log_prediction(db, city, "rain", pred, float(prob), request.client.host)
        
        return PredictionResponse(
            success=True,
            model="rain",
            city=city,
            prediction={"probability": float(prob), "label": pred},
            explanation=explanation
        )
    except asyncio.TimeoutError:
        return PredictionResponse(success=False, model="rain", city=city, prediction={}, message="Prediction timeout")
    except Exception as e:
        logger.error(f"Rain prediction failed: {e}")
        return PredictionResponse(success=False, model="rain", city=city, prediction={}, message="Prediction failed")

@router.get("/temperature", response_model=PredictionResponse)
@limiter.limit("30/minute")
async def predict_temperature(
    request: Request,
    city: str,
    month: int = Query(..., ge=1, le=12),
    humidity: float = 50,
    pressure: float = 1013,
    wind: float = 10,
    cloud: float = 0,
    uv: float = 0,
    db: Session = Depends(get_db)
):
    models = get_models()
    if "temp" not in models or "encoder" not in models:
        return PredictionResponse(success=False, ml_available=False, model="temperature", city=city, prediction={}, message="Models not loaded")

    try:
        # Encode city
        try:
            city_encoded = models["encoder"].transform([city])[0]
        except ValueError:
            return PredictionResponse(success=False, ml_available=False, model="temperature", city=city, prediction={}, message="City not supported by ML model")

        features = [city_encoded, month, humidity, pressure, wind, cloud, uv]
        feature_names = ['city_encoded', 'month', 'humidity', 'pressure_mb', 'wind_kph', 'cloud', 'uv_index']
        input_data = np.array(features).reshape(1, -1)

        async def run_inference():
            pred = models["temp"].predict(input_data)[0]
            explanation = get_shap_explanation(models["temp"], input_data, feature_names)
            return float(pred), explanation

        pred_val, explanation = await asyncio.wait_for(run_inference(), timeout=5.0)
        
        log_prediction(db, city, "temperature", str(pred_val), 1.0, request.client.host)
        
        return PredictionResponse(
            success=True,
            model="temperature",
            city=city,
            prediction={"temp_c": pred_val},
            explanation=explanation
        )
    except asyncio.TimeoutError:
        return PredictionResponse(success=False, model="temperature", city=city, prediction={}, message="Prediction timeout")
    except Exception as e:
        logger.error(f"Temp prediction failed: {e}")
        return PredictionResponse(success=False, model="temperature", city=city, prediction={}, message="Prediction failed")

@router.get("/humidity", response_model=PredictionResponse)
@limiter.limit("30/minute")
async def predict_humidity(
    request: Request,
    city: str,
    month: int = Query(..., ge=1, le=12),
    temp: float = 25,
    pressure: float = 1013,
    wind: float = 10,
    precip: float = 0,
    db: Session = Depends(get_db)
):
    models = get_models()
    if "humidity" not in models or "encoder" not in models:
        return PredictionResponse(success=False, ml_available=False, model="humidity", city=city, prediction={}, message="Models not loaded")

    try:
        try:
            city_encoded = models["encoder"].transform([city])[0]
        except ValueError:
            return PredictionResponse(success=False, ml_available=False, model="humidity", city=city, prediction={}, message="City not supported")

        features = [city_encoded, month, temp, pressure, wind, precip]
        input_data = np.array(features).reshape(1, -1)

        async def run_inference():
            pred = models["humidity"].predict(input_data)[0]
            return float(pred)

        pred_val = await asyncio.wait_for(run_inference(), timeout=5.0)
        
        log_prediction(db, city, "humidity", str(pred_val), 1.0, request.client.host)
        
        return PredictionResponse(
            success=True,
            model="humidity",
            city=city,
            prediction={"humidity": pred_val},
            explanation=[]
        )
    except Exception as e:
        return PredictionResponse(success=False, model="humidity", city=city, prediction={}, message="Prediction failed")

@router.get("/alerts", response_model=PredictionResponse)
@limiter.limit("30/minute")
async def predict_alerts(
    request: Request,
    city: str,
    temp: float,
    wind: float,
    humidity: float,
    pressure: float,
    month: int,
    db: Session = Depends(get_db)
):
    models = get_models()
    if "alerts" not in models or "encoder" not in models:
        return PredictionResponse(success=False, ml_available=False, model="alerts", city=city, prediction={}, message="Models not loaded")

    try:
        try:
            city_encoded = models["encoder"].transform([city])[0]
        except ValueError:
            return PredictionResponse(success=False, ml_available=False, model="alerts", city=city, prediction={}, message="City not supported")

        features = [city_encoded, month, temp, humidity, pressure, wind]
        feature_names = ['city_encoded', 'month', 'temperature_celsius', 'humidity', 'pressure_mb', 'wind_kph']
        input_data = np.array(features).reshape(1, -1)

        async def run_inference():
            probs = models["alerts"].predict_proba(input_data)[0]
            class_idx = np.argmax(probs)
            pred = models["alerts"].classes_[class_idx]
            conf = probs[class_idx]
            explanation = get_shap_explanation(models["alerts"], input_data, feature_names)
            return pred, float(conf), explanation

        pred_val, conf, explanation = await asyncio.wait_for(run_inference(), timeout=5.0)
        
        log_prediction(db, city, "alerts", pred_val, conf, request.client.host)
        
        return PredictionResponse(
            success=True,
            model="alerts",
            city=city,
            prediction={"alert_type": pred_val, "probability": conf},
            explanation=explanation
        )
    except Exception as e:
        return PredictionResponse(success=False, model="alerts", city=city, prediction={}, message="Prediction failed")

@router.get("/trend", response_model=PredictionResponse)
async def predict_trend(city: str):
    models = get_models()
    if "prophet" not in models:
        return PredictionResponse(success=False, ml_available=False, model="trend", city=city, prediction={}, message="Trend model not loaded")

    # Check cache
    cache_key = city # City-agnostic for now as per history data, but keeping city in key
    if cache_key in _trend_cache:
        data, expiry = _trend_cache[cache_key]
        if datetime.now() < expiry:
            return PredictionResponse(success=True, model="trend", city=city, prediction=data, cached=True)

    try:
        model = models["prophet"]
        future = model.make_future_dataframe(periods=7)
        forecast = model.predict(future)
        
        # Get only the last 7 days
        recent = forecast.tail(7)[['ds', 'yhat', 'yhat_lower', 'yhat_upper']]
        trend_data = recent.to_dict('records')
        # Convert ds to string
        for item in trend_data:
            item['ds'] = item['ds'].strftime('%Y-%m-%d')
            item['yhat'] = float(item['yhat'])
            item['yhat_lower'] = float(item['yhat_lower'])
            item['yhat_upper'] = float(item['yhat_upper'])

        _trend_cache[cache_key] = (trend_data, datetime.now() + timedelta(hours=1))
        
        return PredictionResponse(success=True, model="trend", city=city, prediction=trend_data)
    except Exception as e:
        logger.error(f"Trend prediction failed: {e}")
        return PredictionResponse(success=False, model="trend", city=city, prediction={}, message="Trend failed")

@router.get("/metrics")
async def get_metrics():
    return get_model_metrics()
