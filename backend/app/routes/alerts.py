from fastapi import APIRouter, Query, Depends, HTTPException
from typing import List, Dict, Any
from datetime import datetime

from app.utils.alert_engine import AlertEngine
from app.utils.historical_context import get_historical_context
from app.services.weather_service import WeatherService
from app.database.connection import get_db
from sqlalchemy.orm import Session

router = APIRouter()

@router.get("/active")
async def get_active_alerts(
    city: str = Query(..., description="City name"),
    db: Session = Depends(get_db)
):
    """
    Fetch active alerts for a city, combining ML classification and historical context.
    """
    try:
        # 1. Get live weather data for the city
        # We use WeatherService to get current stats (temp, wind, etc.)
        weather_res = await WeatherService.get_current_weather(db, city)
        if not weather_res.get("success"):
            raise HTTPException(status_code=404, detail=f"Weather data not found for {city}")
            
        weather_data = weather_res["data"]
        
        # 2. Run Alert Engine
        alerts = await AlertEngine.get_active_alerts(city, weather_data)
        
        # 3. Add Historical Context & Recommendations
        month = datetime.now().month
        
        recommendations = {
            "heatwave": "Drink plenty of water, stay in air-conditioned rooms, and avoid outdoor activity 11am–4pm.",
            "storm": "Secure loose outdoor objects, stay indoors away from windows, and avoid travel if possible.",
            "coldwave": "Wear layered warm clothing, avoid prolonged exposure to cold, and ensure heating systems are safe.",
            "default": "Stay tuned to local weather updates and follow safety guidelines."
        }
        
        enriched_alerts = []
        for alert in alerts:
            alert_type = alert["type"]
            alert["historical_context"] = get_historical_context(city, alert_type, month)
            alert["recommendation"] = recommendations.get(alert_type, recommendations["default"])
            enriched_alerts.append(alert)
            
        return {
            "success": True,
            "city": city,
            "alerts": enriched_alerts,
            "count": len(enriched_alerts)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        return {
            "success": False,
            "message": f"Failed to fetch alerts: {str(e)}",
            "alerts": []
        }
