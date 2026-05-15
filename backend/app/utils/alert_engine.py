import logging
import numpy as np
import asyncio
from datetime import datetime, timedelta
from typing import Dict, Any, Optional, List
from app.ml.model_loader import get_models
from app.ml.explainer import get_shap_explanation

logger = logging.getLogger("uvicorn.error")

# In-memory cache for alert deduplication (Cooldown: 30 minutes)
# Format: { "city_alertType": expiry_datetime }
_alert_cache = {}

class AlertEngine:
    @staticmethod
    def check_thresholds(data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Check hard thresholds for immediate alert candidates.
        """
        alerts = []
        temp = data.get("temperature", 0)
        wind = data.get("wind_kph", 0)
        
        if temp > 40:
            alerts.append({
                "type": "heatwave",
                "label": "🔥 Heatwave Alert",
                "severity": "high" if temp < 45 else "extreme",
                "explanation": f"Temperature at {temp}°C is dangerously high.",
                "threshold_triggered": True
            })
        elif temp < 5:
            alerts.append({
                "type": "coldwave",
                "label": "❄️ Coldwave Alert",
                "severity": "medium" if temp > 0 else "high",
                "explanation": f"Temperature at {temp}°C is below safety levels.",
                "threshold_triggered": True
            })
            
        if wind > 60:
            alerts.append({
                "type": "storm",
                "label": "⛈️ Storm Alert",
                "severity": "high" if wind < 90 else "extreme",
                "explanation": f"Wind speeds reaching {wind} kph.",
                "threshold_triggered": True
            })
            
        return alerts

    @staticmethod
    async def get_ml_prediction(city: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Call ML model for alert classification with fallback logic.
        """
        models = get_models()
        if "alerts" not in models or "encoder" not in models:
            logger.warning("Alert model or encoder not loaded. Skipping ML prediction.")
            return None

        try:
            # Encode city
            try:
                city_encoded = models["encoder"].transform([city])[0]
            except ValueError:
                return None # City not in training set

            month = datetime.now().month
            temp = data.get("temperature", 0)
            humidity = data.get("humidity", 0)
            pressure = data.get("pressure_mb", 1013)
            wind = data.get("wind_kph", 0)

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

            pred_val, conf, explanation = await asyncio.wait_for(run_inference(), timeout=3.0)
            
            if pred_val == "none" or conf < 0.3:
                return None

            # Map ML prediction to UI label
            labels = {
                "heatwave": "🔥 Heatwave Alert",
                "storm": "⛈️ Storm Alert",
                "coldwave": "❄️ Coldwave Alert"
            }

            severity = "low"
            if conf > 0.9: severity = "extreme"
            elif conf > 0.7: severity = "high"
            elif conf > 0.4: severity = "medium"

            # Format SHAP explanation into readable text
            # Top drivers: Temperature at 42°C (+18pts above threshold), low pressure drop (+12pts)
            top_drivers = sorted(explanation, key=lambda x: abs(x['impact']), reverse=True)[:2]
            expl_str = "Top drivers: " + ", ".join([f"{d['feature']} ({'+' if d['impact'] > 0 else ''}{int(d['impact']*100)}pts impact)" for d in top_drivers])

            return {
                "type": pred_val,
                "label": labels.get(pred_val, "⚠️ Weather Alert"),
                "probability": conf,
                "severity": severity,
                "explanation": expl_str,
                "threshold_triggered": False,
                "ml_fallback": False
            }

        except Exception as e:
            logger.error(f"Alert ML prediction failed: {e}")
            return None

    @staticmethod
    def is_deduplicated(city: str, alert_type: str) -> bool:
        """
        Check if an identical alert was sent recently (within 30 mins).
        """
        key = f"{city.lower()}_{alert_type}"
        now = datetime.now()
        
        if key in _alert_cache:
            if now < _alert_cache[key]:
                return True
        
        # Add to cache/refresh expiry
        _alert_cache[key] = now + timedelta(minutes=30)
        return False

    @staticmethod
    async def get_active_alerts(city: str, weather_input: Dict[str, Any]) -> List[Dict[str, Any]]:
        """
        Main entry point for alert detection.
        """
        final_alerts = []
        
        # 1. Threshold Check
        threshold_alerts = AlertEngine.check_thresholds(weather_input)
        
        # 2. ML Prediction
        ml_alert = await AlertEngine.get_ml_prediction(city, weather_input)
        
        # 3. Merge and Deduplicate
        # If ML found something different or confirmed threshold alert
        found_types = set()
        
        if ml_alert:
            if not AlertEngine.is_deduplicated(city, ml_alert["type"]):
                final_alerts.append(ml_alert)
                found_types.add(ml_alert["type"])
        
        for ta in threshold_alerts:
            if ta["type"] not in found_types:
                if not AlertEngine.is_deduplicated(city, ta["type"]):
                    ta["ml_fallback"] = (ml_alert is None)
                    final_alerts.append(ta)
                    
        return final_alerts
