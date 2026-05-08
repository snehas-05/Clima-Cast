import pandas as pd
from pathlib import Path
import logging

logger = logging.getLogger("uvicorn.error")

_supported_cities = None

def get_supported_cities():
    global _supported_cities
    if _supported_cities is None:
        try:
            # Use absolute path handling with pathlib
            base_path = Path(__file__).resolve().parent.parent
            csv_path = base_path / "data" / "global_weather_repo.csv"
            
            if not csv_path.exists():
                logger.error(f"City Checker: CSV not found at {csv_path}")
                _supported_cities = set()
                return _supported_cities

            df = pd.read_csv(csv_path)
            if 'location_name' not in df.columns:
                logger.error("City Checker: 'location_name' column missing in CSV")
                _supported_cities = set()
                return _supported_cities
                
            _supported_cities = set(df['location_name'].str.lower().unique())
            logger.info(f"Loaded {len(_supported_cities)} supported ML cities from CSV")
        except Exception as e:
            logger.error(f"City Checker: Error loading CSV: {e}")
            _supported_cities = set()
            
    return _supported_cities

def is_city_in_model(city_name: str) -> bool:
    if not city_name:
        return False
    return city_name.lower() in get_supported_cities()
