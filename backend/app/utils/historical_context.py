import pandas as pd
from pathlib import Path
import logging
from datetime import datetime
import os

logger = logging.getLogger("uvicorn.error")

_df_global = None

def _get_df_global():
    global _df_global
    if _df_global is None:
        try:
            base_path = Path(__file__).resolve().parent.parent
            csv_path = base_path / "data" / "global_weather_repo.csv"
            
            if not csv_path.exists():
                logger.error(f"Historical Context: CSV not found at {csv_path}")
                return None

            _df_global = pd.read_csv(csv_path)
            # Ensure date column is datetime
            if 'last_updated' in _df_global.columns:
                _df_global['date_dt'] = pd.to_datetime(_df_global['last_updated'])
            else:
                logger.error("Historical Context: 'last_updated' column missing")
                return None
                
            logger.info("Historical context dataset loaded.")
        except Exception as e:
            logger.error(f"Historical Context: Error loading CSV: {e}")
            return None
            
    return _df_global

def get_historical_context(city: str, alert_type: str, month: int) -> str:
    """
    Returns a string describing historical frequency of a specific weather event for a city in a month.
    """
    df = _get_df_global()
    if df is None:
        return "Historical context unavailable."

    try:
        # Filter by city and month
        city_df = df[
            (df['location_name'].str.lower() == city.lower()) &
            (df['date_dt'].dt.month == month)
        ]
        
        if city_df.empty:
            return f"First recorded data for {city} in this month."

        if alert_type == 'heatwave':
            hot_days = len(city_df[city_df['temperature_celsius'] > 40]['date_dt'].dt.date.unique())
            return f"Historically rare for {city} in this month." if hot_days == 0 else f"Averages {hot_days} high-heat days this month."
            
        elif alert_type == 'storm':
            storm_days = len(city_df[city_df['wind_kph'] > 60]['date_dt'].dt.date.unique())
            return f"Severe storms are uncommon for {city} in this month." if storm_days == 0 else f"Records ~{storm_days} storm events this month."
            
        elif alert_type == 'coldwave':
            cold_days = len(city_df[city_df['temperature_celsius'] < 5]['date_dt'].dt.date.unique())
            return f"Coldwaves are rare for {city} in this month." if cold_days == 0 else f"Typically sees {cold_days} coldwave days this month."
            
        return "Stable historical baseline."
        
    except Exception as e:
        logger.error(f"Error calculating historical context: {e}")
        return "Context unavailable."

def get_seasonal_grounding(city: str, month: int) -> Dict[str, Any]:
    """
    Provides average weather metrics for a city and month for anomaly comparison.
    """
    df = _get_df_global()
    if df is None: return {}

    try:
        city_df = df[
            (df['location_name'].str.lower() == city.lower()) &
            (df['date_dt'].dt.month == month)
        ]
        
        if city_df.empty: return {}

        return {
            "avg_temp": float(city_df['temperature_celsius'].mean()),
            "avg_hum": float(city_df['humidity'].mean()),
            "avg_pressure": float(city_df['pressure_mb'].mean()),
            "count": len(city_df)
        }
    except Exception as e:
        logger.error(f"Error in seasonal grounding: {e}")
        return {}
