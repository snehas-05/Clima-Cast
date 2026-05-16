from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Any

from app.database.connection import get_db
from app.models.user import User
from app.models.preferences import UserPreference, ThemeType, UnitType
from app.schemas.user import UserCreate, UserLogin, UserResponse, StandardResponse
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.utils.auth_deps import get_current_user

router = APIRouter()

@router.post("/signup", response_model=StandardResponse)
def signup(user_in: UserCreate, db: Session = Depends(get_db)) -> Any:
    try:
        # Check if email already exists
        user_exists = db.query(User).filter(User.email == user_in.email).first()
        if user_exists:
            return StandardResponse(
                success=False,
                message="Email already registered",
                error="Email already exists"
            )
            
        # Create user
        new_user = User(
            name=user_in.name,
            email=user_in.email,
            password_hash=hash_password(user_in.password),
            home_city=user_in.home_city
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        # Automatically create default preferences
        default_prefs = UserPreference(
            user_id=new_user.id,
            theme=ThemeType.DARK,
            unit=UnitType.CELSIUS,
            show_confidence=True
        )
        db.add(default_prefs)
        db.commit()
        
        # Generate token
        access_token = create_access_token({"user_id": new_user.id, "email": new_user.email})
        
        return StandardResponse(
            success=True,
            message="User created successfully",
            data={
                "access_token": access_token,
                "token_type": "bearer",
                "user": UserResponse.model_validate(new_user).model_dump()
            }
        )
    except Exception as e:
        db.rollback()
        return StandardResponse(
            success=False,
            message="An error occurred during signup",
            error="Internal server error"
        )

@router.post("/login", response_model=StandardResponse)
def login(user_credentials: UserLogin, db: Session = Depends(get_db)) -> Any:
    try:
        user = db.query(User).filter(User.email == user_credentials.email).first()
        if not user or not verify_password(user_credentials.password, user.password_hash):
            return StandardResponse(
                success=False,
                message="Invalid credentials",
                error="Invalid email or password"
            )
            
        access_token = create_access_token({"user_id": user.id, "email": user.email})
        
        return StandardResponse(
            success=True,
            message="Login successful",
            data={
                "access_token": access_token,
                "token_type": "bearer",
                "user": UserResponse.model_validate(user).model_dump()
            }
        )
    except Exception as e:
        print(f"Login error: {e}")
        return StandardResponse(
            success=False,
            message="An error occurred during login",
            error="Internal server error"
        )

@router.get("/profile", response_model=StandardResponse)
def get_profile(current_user: User = Depends(get_current_user)) -> Any:
    return StandardResponse(
        success=True,
        message="Profile retrieved successfully",
        data={
            "user": UserResponse.model_validate(current_user).model_dump()
        }
    )

@router.post("/logout", response_model=StandardResponse)
def logout() -> Any:
    # JWT is stateless, so logout is handled client-side by dropping the token.
    # But we provide this endpoint for completeness and future-proofing (e.g., token blacklisting).
    return StandardResponse(
        success=True,
        message="Logged out successfully",
        data=None
    )
