import pandas as pd
from fastapi import APIRouter, HTTPException, Query
from pathlib import Path
import logging
from functools import lru_cache
from datetime import datetime, timedelta
from prophet import Prophet
import numpy as np

router = APIRouter()
logger = logging.getLogger("uvicorn.error")

# Load CSV only ONCE at module level
BASE_PATH = Path(__file__).resolve().parent.parent
CSV_PATH = BASE_PATH / "data" / "processed_global.csv"

df_global = None

def load_data():
    global df_global
    if df_global is None:
        try:
            if not CSV_PATH.exists():
                logger.error(f"Analytics: CSV not found at {CSV_PATH}")
                df_global = pd.DataFrame()
                return
            
            df_global = pd.read_csv(CSV_PATH)
            df_global['date'] = pd.to_datetime(df_global['date'])
            
            # Automatic NaN cleanup
            df_global['temperature_celsius'] = pd.to_numeric(df_global['temperature_celsius'], errors='coerce')
            df_global['humidity'] = pd.to_numeric(df_global['humidity'], errors='coerce')
            df_global['precip_mm'] = pd.to_numeric(df_global['precip_mm'], errors='coerce')
            
            df_global = df_global.dropna(subset=['temperature_celsius', 'humidity', 'date', 'location_name'])
            
            logger.info("Analytics: CSV data loaded and cleaned successfully")
        except Exception as e:
            logger.error(f"Analytics: Error loading CSV: {e}")
            df_global = pd.DataFrame()

load_data()

def safe_float(val):
    try:
        if pd.isna(val) or np.isinf(val):
            return 0.0
        return float(val)
    except:
        return 0.0

@lru_cache(maxsize=128)
def get_city_history(city: str, years: int):
    if df_global.empty:
        return []
    
    city_df = df_global[df_global['location_name'].str.lower() == city.lower()].copy()
    if city_df.empty:
        return []
    
    city_df['year'] = city_df['date'].dt.year
    
    # Filter by years if specified
    max_year = city_df['year'].max()
    city_df = city_df[city_df['year'] >= (max_year - years)]
    
    result = city_df.groupby('year').agg({
        'temperature_celsius': ['mean', 'max', 'min'],
        'humidity': 'mean'
    }).reset_index()
    
    # Flatten columns
    result.columns = ['year', 'avg_temp', 'max_temp', 'min_temp', 'avg_humidity']
    
    # Convert to list of dicts with safe floats
    data = []
    for _, row in result.iterrows():
        data.append({
            "year": int(row['year']),
            "avg_temp": safe_float(row['avg_temp']),
            "max_temp": safe_float(row['max_temp']),
            "min_temp": safe_float(row['min_temp']),
            "avg_humidity": safe_float(row['avg_humidity'])
        })
    return data

@router.get("/history")
async def history(city: str = Query(...), years: int = Query(10)):
    data = get_city_history(city, years)
    if not data:
        return []
    return data

@lru_cache(maxsize=128)
def get_city_comparison(city1: str, city2: str):
    if df_global.empty:
        return {}
    
    def process_city(city_name):
        df = df_global[df_global['location_name'].str.lower() == city_name.lower()].copy()
        if df.empty:
            return None
        
        df['month'] = df['date'].dt.month
        monthly = df.groupby('month').agg({
            'temperature_celsius': 'mean',
            'humidity': 'mean',
            'precip_mm': 'sum'
        }).reset_index()
        
        # Stats
        hottest_month = int(monthly.loc[monthly['temperature_celsius'].idxmax(), 'month'])
        coldest_month = int(monthly.loc[monthly['temperature_celsius'].idxmin(), 'month'])
        annual_rainfall = safe_float(df['precip_mm'].sum())
        
        return {
            "name": city_name,
            "monthly_data": [
                {
                    "month": int(r['month']),
                    "avg_temp": safe_float(r['temperature_celsius']),
                    "avg_humidity": safe_float(r['humidity']),
                    "precip": safe_float(r['precip_mm'])
                } for _, r in monthly.iterrows()
            ],
            "stats": {
                "avg_temp": safe_float(df['temperature_celsius'].mean()),
                "avg_humidity": safe_float(df['humidity'].mean()),
                "total_precip": annual_rainfall,
                "hottest_month": hottest_month,
                "coldest_month": coldest_month
            }
        }

    return {
        "city1": process_city(city1),
        "city2": process_city(city2)
    }

@router.get("/compare")
async def compare(city1: str = Query(...), city2: str = Query(...)):
    return get_city_comparison(city1, city2)

@lru_cache(maxsize=128)
def get_seasonal_data(city: str):
    if df_global.empty:
        return []
    
    city_df = df_global[df_global['location_name'].str.lower() == city.lower()].copy()
    if city_df.empty:
        return []
    
    season_order = ['Spring', 'Summer', 'Autumn', 'Winter']
    
    result = city_df.groupby('season').agg({
        'temperature_celsius': ['mean', 'max'],
        'humidity': 'mean',
        'precip_mm': 'sum'
    }).reset_index()
    
    result.columns = ['season', 'avg_temp', 'max_temp', 'avg_humidity', 'total_precip']
    
    # Sort by season order
    result['season_cat'] = pd.Categorical(result['season'], categories=season_order, ordered=True)
    result = result.sort_values('season_cat')
    
    data = []
    for _, row in result.iterrows():
        data.append({
            "season": row['season'],
            "avg_temp": safe_float(row['avg_temp']),
            "max_temp": safe_float(row['max_temp']),
            "avg_humidity": safe_float(row['avg_humidity']),
            "total_precip": safe_float(row['total_precip'])
        })
    return data

@router.get("/seasonal")
async def seasonal(city: str = Query(...)):
    return get_seasonal_data(city)

@lru_cache(maxsize=128)
def get_monthly_trends(city: str):
    if df_global.empty:
        return []
    
    city_df = df_global[df_global['location_name'].str.lower() == city.lower()].copy()
    if city_df.empty:
        return []
    
    city_df['month'] = city_df['date'].dt.month
    result = city_df.groupby('month').agg({
        'temperature_celsius': 'mean',
        'humidity': 'mean',
        'precip_mm': 'mean'
    }).sort_index().reset_index()
    
    data = []
    for _, row in result.iterrows():
        data.append({
            "month": int(row['month']),
            "avg_temp": safe_float(row['temperature_celsius']),
            "avg_humidity": safe_float(row['humidity']),
            "avg_rainfall": safe_float(row['precip_mm'])
        })
    return data

@router.get("/trends")
async def trends(city: str = Query(...)):
    return get_monthly_trends(city)

@lru_cache(maxsize=64)
def get_past_future_data(city: str):
    if df_global is None or df_global.empty:
        return {"timeline": [], "markers": [], "interpretation": "Data unavailable"}
    
    city_df = df_global[df_global['location_name'].str.lower() == city.lower()].copy()
    if city_df.empty:
        return {"timeline": [], "markers": [], "interpretation": "City not found in historical records"}
    
    # 1. Historical: last 30 days
    last_date = city_df['date'].max()
    historical_df = city_df[city_df['date'] > (last_date - timedelta(days=30))].sort_values('date')
    
    timeline = []
    for _, row in historical_df.iterrows():
        timeline.append({
            "date": row['date'].strftime('%Y-%m-%d'),
            "temperature": safe_float(row['temperature_celsius']),
            "humidity": safe_float(row['humidity']),
            "precip": safe_float(row.get('precip_mm', 0)),
            "type": "historical"
        })
    
    # 2. Prophet Prediction (Next 7 Days)
    markers = []
    interpretation = "Stable conditions"
    
    try:
        # We need more data for Prophet to be accurate, but keep it lightweight
        prophet_input = city_df[['date', 'temperature_celsius']].rename(columns={'date': 'ds', 'temperature_celsius': 'y'})
        # Limit input to last 2 years for speed if necessary, but here we use the whole city history
        
        model = Prophet(yearly_seasonality=True, daily_seasonality=False, weekly_seasonality=False)
        model.fit(prophet_input)
        
        future = model.make_future_dataframe(periods=7)
        forecast = model.predict(future)
        
        next_7 = forecast.tail(7)
        
        for _, row in next_7.iterrows():
            timeline.append({
                "date": row['ds'].strftime('%Y-%m-%d'),
                "temperature": safe_float(row['yhat']),
                "humidity": None, 
                "precip": None,
                "temp_lower": safe_float(row['yhat_lower']),
                "temp_upper": safe_float(row['yhat_upper']),
                "type": "predicted"
            })
            
        # 3. Trend Interpretation
        # Calculate slope of yhat over the 7 days
        yhat_values = next_7['yhat'].values
        slope = (yhat_values[-1] - yhat_values[0]) / 7
        
        if slope > 0.5:
            interpretation = "Warming trend expected over the next week"
        elif slope < -0.5:
            interpretation = "Cooling pattern approaching"
        elif abs(slope) < 0.2:
            interpretation = "Climate conditions stabilizing"
        else:
            interpretation = "Mild temperature fluctuations expected"
            
    except Exception as e:
        logger.error(f"Prophet failure for {city}: {e}")
        interpretation = "Unable to generate future insights"

    # 4. Memory Marker Detection (Deterministic)
    if not historical_df.empty:
        # Hottest
        hottest_idx = historical_df['temperature_celsius'].idxmax()
        hottest_row = historical_df.loc[hottest_idx]
        markers.append({
            "date": hottest_row['date'].strftime('%Y-%m-%d'),
            "label": "Warmest day",
            "value": f"{safe_float(hottest_row['temperature_celsius'])}°C",
            "type": "hot"
        })
        
        # Coldest
        coldest_idx = historical_df['temperature_celsius'].idxmin()
        coldest_row = historical_df.loc[coldest_idx]
        if hottest_idx != coldest_idx: # Avoid overlap
            markers.append({
                "date": coldest_row['date'].strftime('%Y-%m-%d'),
                "label": "Coolest day",
                "value": f"{safe_float(coldest_row['temperature_celsius'])}°C",
                "type": "cold"
            })
            
        # Unusual Rain (if any > 5mm)
        rainy_days = historical_df[historical_df['precip_mm'] > 5]
        if not rainy_days.empty:
            max_rain_row = rainy_days.loc[rainy_days['precip_mm'].idxmax()]
            markers.append({
                "date": max_rain_row['date'].strftime('%Y-%m-%d'),
                "label": "Heavy rainfall",
                "value": f"{safe_float(max_rain_row['precip_mm'])}mm",
                "type": "rain"
            })

    # Limit to top markers for cinematic clarity
    return {
        "timeline": timeline,
        "markers": markers[:4],
        "interpretation": interpretation
    }

@router.get("/past-future")
async def past_future(city: str = Query(...)):
    return get_past_future_data(city)
