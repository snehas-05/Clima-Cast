from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import asyncio

from app.database.connection import get_db
from app.utils.auth_deps import get_current_user
from app.models.user import User
from app.models.location import SavedLocation
from app.models.history import SearchHistory
from app.utils.city_checker import is_city_in_model
from app.services.weather_service import WeatherService

router = APIRouter()

@router.get("/favorites")
async def get_favorites(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Return saved cities for the logged-in user with live weather data fetched in parallel.
    """
    saved_locations = db.query(SavedLocation).filter(SavedLocation.user_id == user.id).all()
    
    if not saved_locations:
        return {"success": True, "favorites": []}

    # Batch-fetch live temperatures using asyncio.gather
    async def fetch_city_weather(loc: SavedLocation):
        try:
            weather_res = await WeatherService.get_current_weather(db, loc.city, user)
            if weather_res.get("success"):
                data = weather_res["data"]
                return {
                    "id": loc.id,
                    "city": loc.city,
                    "country": loc.country or data.get("country"),
                    "temp": data.get("temperature"),
                    "unit": data.get("unit"),
                    "condition": data.get("condition"),
                    "icon": data.get("icon"),
                    "in_csv_model": loc.in_csv_model
                }
            return {
                "id": loc.id,
                "city": loc.city,
                "country": loc.country,
                "temp": None,
                "error": "Failed to fetch live data",
                "in_csv_model": loc.in_csv_model
            }
        except Exception as e:
            return {
                "id": loc.id,
                "city": loc.city,
                "country": loc.country,
                "temp": None,
                "error": str(e),
                "in_csv_model": loc.in_csv_model
            }

    favorites = await asyncio.gather(*[fetch_city_weather(loc) for loc in saved_locations])
    
    return {
        "success": True,
        "favorites": favorites
    }

@router.post("/favorites")
async def save_favorite(
    city: str = Query(...),
    country: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Save a city to favorites.
    """
    # Check for duplicates
    existing = db.query(SavedLocation).filter(
        SavedLocation.user_id == user.id,
        SavedLocation.city == city
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="City already in favorites")

    # Check if city is in ML model
    in_model = is_city_in_model(city)
    
    new_favorite = SavedLocation(
        user_id=user.id,
        city=city,
        country=country,
        in_csv_model=in_model
    )
    
    db.add(new_favorite)
    db.commit()
    db.refresh(new_favorite)
    
    return {
        "success": True,
        "message": f"{city} saved to favorites",
        "data": {
            "id": new_favorite.id,
            "city": new_favorite.city,
            "in_csv_model": in_model
        }
    }

@router.delete("/favorites/{fav_id}")
async def delete_favorite(
    fav_id: int,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Remove a city from favorites.
    """
    favorite = db.query(SavedLocation).filter(
        SavedLocation.id == fav_id,
        SavedLocation.user_id == user.id
    ).first()
    
    if not favorite:
        raise HTTPException(status_code=404, detail="Favorite not found")
        
    db.delete(favorite)
    db.commit()
    
    return {"success": True, "message": "City removed from favorites"}

@router.get("/history")
async def get_search_history(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Return last 20 search history entries for the user.
    """
    history = db.query(SearchHistory).filter(
        SearchHistory.user_id == user.id
    ).order_by(SearchHistory.searched_at.desc()).limit(20).all()
    
    return {
        "success": True,
        "history": [
            {
                "id": h.id,
                "city": h.city,
                "ml_used": h.ml_used,
                "searched_at": h.searched_at
            } for h in history
        ]
    }
