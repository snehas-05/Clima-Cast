from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.database.connection import get_db
from app.services.search_service import SearchService

router = APIRouter()

@router.get("/")
async def search(
    q: str = Query(..., description="Search query"),
    city: Optional[str] = Query("Ludhiana", description="Current context city"),
    db: Session = Depends(get_db)
):
    """
    Perform a contextual search for weather data and AI insights.
    """
    return await SearchService.perform_search(db, q, city)
