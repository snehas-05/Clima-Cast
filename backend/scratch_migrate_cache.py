import sys
import os
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database import engine
from sqlalchemy import text

def migrate():
    with engine.connect() as conn:
        print("Checking for forecast_data column...")
        result = conn.execute(text("SHOW COLUMNS FROM weather_cache LIKE 'forecast_data'"))
        column_exists = result.fetchone()
        
        if not column_exists:
            print("Adding forecast_data column...")
            conn.execute(text("ALTER TABLE weather_cache ADD COLUMN forecast_data JSON NULL AFTER api_data"))
            conn.commit()
            print("Column added successfully.")
        else:
            print("Column forecast_data already exists.")

if __name__ == "__main__":
    migrate()
