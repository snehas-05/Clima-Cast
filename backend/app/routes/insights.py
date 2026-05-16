from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import logging

from app.database.connection import get_db
from app.services.weather_service import WeatherService
from app.utils.insight_engine import InsightEngine

router = APIRouter()
logger = logging.getLogger("uvicorn.error")

# Simple in-memory cache for insights
# Format: { "city": {"data": data, "expiry": datetime} }
_insight_cache = {}
CACHE_TTL_MINUTES = 10

@router.get("/summary")
async def get_insight_summary(
    city: str = Query(..., description="City name for climate analysis"),
    db: Session = Depends(get_db)
):
    """
    Returns a structured climate intelligence summary for a city.
    Features 10-minute caching to optimize ML inference.
    """
    # 1. Check Cache
    now = datetime.now()
    if city.lower() in _insight_cache:
        cached = _insight_cache[city.lower()]
        if now < cached["expiry"]:
            logger.info(f"Insight Cache Hit: {city}")
            return cached["data"]

    try:
        # 2. Get Weather Data (Base for all intelligence)
        weather_res = await WeatherService.get_current_weather(db, city)
        if not weather_res.get("success"):
            raise HTTPException(status_code=404, detail=f"Weather data not found for {city}")
            
        weather_data = weather_res["data"]
        
        # 3. Generate Intelligence
        summary = await InsightEngine.get_summary(city, weather_data)
        
        # 4. Update Cache
        _insight_cache[city.lower()] = {
            "data": summary,
            "expiry": now + timedelta(minutes=CACHE_TTL_MINUTES)
        }
        
        return summary

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to generate insight summary: {e}")
        raise HTTPException(status_code=500, detail="Internal intelligence engine error")
