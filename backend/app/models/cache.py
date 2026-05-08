from sqlalchemy import Column, Integer, String, JSON, DateTime
from sqlalchemy.sql import func
from datetime import datetime, timedelta
from app.database.base import Base

class WeatherCache(Base):
    __tablename__ = "weather_cache"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), unique=True, index=True, nullable=False)
    api_data = Column(JSON, nullable=True)
    ml_prediction = Column(JSON, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

def is_cache_expired(updated_at: datetime) -> bool:
    """Check if cache is older than 30 minutes."""
    if not updated_at:
        return True
    # Ensure both are offset-naive or offset-aware
    now = datetime.now(updated_at.tzinfo) if updated_at.tzinfo else datetime.now()
    return now - updated_at > timedelta(minutes=30)
