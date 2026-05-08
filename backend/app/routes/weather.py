from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.database.connection import get_db
from app.utils.auth_deps import get_current_user_optional
from app.services.weather_service import WeatherService
from app.utils.city_checker import get_supported_cities, is_city_in_model
from app.models.user import User

router = APIRouter()

@router.get("/current")
async def get_current_weather(
    city: str = Query(..., description="City name"),
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    """Fetch current weather for a city with caching and ML availability status."""
    return await WeatherService.get_current_weather(db, city, user)

@router.get("/forecast")
async def get_weather_forecast(
    city: str = Query(..., description="City name"),
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    """Fetch 5-day weather forecast aggregated by day."""
    return await WeatherService.get_forecast(db, city, user)

@router.get("/by-coordinates")
async def get_weather_by_coords(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    """Fetch current weather based on GPS coordinates."""
    return await WeatherService.get_by_coordinates(db, lat, lon, user)

@router.get("/supported-cities")
async def get_supported_cities_list():
    """Returns a list of all cities supported by the ML model."""
    cities = list(get_supported_cities())
    return {
        "success": True,
        "count": len(cities),
        "cities": cities
    }

@router.get("/check-city")
async def check_city_support(city: str = Query(...)):
    """Check if a specific city is supported by the ML model."""
    return {
        "success": True,
        "city": city,
        "supported": is_city_in_model(city)
    }
