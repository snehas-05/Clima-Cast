from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, Dict, Any

from app.database.connection import get_db
from app.utils.auth_deps import get_current_user
from app.models.user import User
from app.models.preferences import UserPreference, ThemeType, UnitType

router = APIRouter()

class PreferencesUpdate(BaseModel):
    theme: Optional[ThemeType] = None
    unit: Optional[UnitType] = None
    show_confidence: Optional[bool] = None

@router.get("/preferences")
async def get_preferences(
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Load user's preferences from the database.
    """
    prefs = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()
    
    if not prefs:
        # Create default preferences if not exists
        prefs = UserPreference(user_id=user.id)
        db.add(prefs)
        db.commit()
        db.refresh(prefs)
        
    return {
        "success": True,
        "preferences": {
            "theme": prefs.theme,
            "unit": prefs.unit,
            "show_confidence": prefs.show_confidence
        }
    }

@router.post("/preferences")
async def update_preferences(
    update: Dict[str, Any], # Using dict for flexibility since Pydantic might need extra imports for Optional
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user)
):
    """
    Save theme, unit, and show_confidence to the preferences table.
    """
    prefs = db.query(UserPreference).filter(UserPreference.user_id == user.id).first()
    
    if not prefs:
        prefs = UserPreference(user_id=user.id)
        db.add(prefs)
        
    if "theme" in update:
        prefs.theme = ThemeType(update["theme"])
    if "unit" in update:
        prefs.unit = UnitType(update["unit"])
    if "show_confidence" in update:
        prefs.show_confidence = update["show_confidence"]
        
    db.commit()
    db.refresh(prefs)
    
    return {
        "success": True,
        "message": "Preferences updated successfully",
        "preferences": {
            "theme": prefs.theme,
            "unit": prefs.unit,
            "show_confidence": prefs.show_confidence
        }
    }
