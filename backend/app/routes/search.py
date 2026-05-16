from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.connection import get_db
from app.services.search_service import SearchService
from app.utils.auth_deps import get_current_user_optional
from app.models.user import User

router = APIRouter()

@router.get("/")
async def search(
    q: str = Query(..., description="Search query"),
    city: Optional[str] = Query("Ludhiana", description="Current context city"),
    db: Session = Depends(get_db),
    user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Perform a contextual search for weather data and AI insights.
    """
    return await SearchService.perform_search(db, q, city, user)

@router.get("/cities")
async def search_cities(
    q: str = Query(..., description="City search query")
):
    """
    Search for cities matching the query for geocoding.
    """
    return await SearchService.search_cities(q)
