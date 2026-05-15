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

        # Since we might not have multiple years in the CSV (it might be a snapshot), 
        # let's calculate based on unique days if we had a full year, 
        # or just provide stats from the available sample.
        
        total_days = len(city_df['date_dt'].dt.date.unique())
        
        if alert_type == 'heatwave':
            # Threshold > 40C
            hot_days = len(city_df[city_df['temperature_celsius'] > 40]['date_dt'].dt.date.unique())
            if hot_days == 0:
                return f"Heatwaves are extremely rare for {city} in this month historically."
            avg = hot_days # If snapshot is one month
            return f"This city historically averages {avg} heatwave days in this month."
            
        elif alert_type == 'storm':
            # Threshold wind > 60kph
            storm_days = len(city_df[city_df['wind_kph'] > 60]['date_dt'].dt.date.unique())
            if storm_days == 0:
                return f"Severe storms are uncommon for {city} in this month."
            return f"This city records about {storm_days} storm-level wind events in this month."
            
        elif alert_type == 'coldwave':
            # Threshold < 5C
            cold_days = len(city_df[city_df['temperature_celsius'] < 5]['date_dt'].dt.date.unique())
            if cold_days == 0:
                return f"Coldwaves are historically rare for {city} in this month."
            return f"This city typically see {cold_days} coldwave days in this month."
            
        return "Historical weather patterns for this city remain stable."
        
    except Exception as e:
        logger.error(f"Error calculating historical context: {e}")
        return "Context calculation failed."
