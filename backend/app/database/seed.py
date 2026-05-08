import sys
import os

# Add the project root to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from sqlalchemy.orm import Session
from app.database.connection import SessionLocal, engine
from app.database.base import Base
from app.models.user import User
from app.models.location import SavedLocation
from app.models.preferences import UserPreference, ThemeType, UnitType
from app.utils.hashing import hash_password
from app.utils.city_checker import is_city_in_model

def seed_db():
    print("Starting database seeding...")
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db: Session = SessionLocal()
    try:
        # 1. Create Test Users
        test_users_data = [
            {
                "name": "Global Explorer",
                "email": "explorer@example.com",
                "password": "Password123!",
                "home_city": "Delhi",
                "saved_cities": [
                    {"city": "Delhi", "country": "India"},
                    {"city": "San Francisco", "country": "USA"},
                    {"city": "London", "country": "UK"}
                ]
            },
            {
                "name": "Weather Fanatic",
                "email": "fanatic@example.com",
                "password": "Password123!",
                "home_city": "London",
                "saved_cities": [
                    {"city": "New York", "country": "USA"},
                    {"city": "Mumbai", "country": "India"},
                    {"city": "Paris", "country": "France"}
                ]
            }
        ]

        for user_data in test_users_data:
            # Idempotent check: check if user exists
            user = db.query(User).filter(User.email == user_data["email"]).first()
            if not user:
                print(f"Creating user: {user_data['email']}")
                user = User(
                    name=user_data["name"],
                    email=user_data["email"],
                    password_hash=hash_password(user_data["password"]),
                    home_city=user_data["home_city"]
                )
                db.add(user)
                db.commit()
                db.refresh(user)
                
                # Create default preferences
                prefs = UserPreference(
                    user_id=user.id,
                    theme=ThemeType.DARK,
                    unit=UnitType.CELSIUS,
                    show_confidence=True
                )
                db.add(prefs)
                
            # Add saved cities (idempotent)
            for city_data in user_data["saved_cities"]:
                existing_loc = db.query(SavedLocation).filter(
                    SavedLocation.user_id == user.id,
                    SavedLocation.city == city_data["city"]
                ).first()
                
                if not existing_loc:
                    print(f"Adding saved city '{city_data['city']}' for {user.email}")
                    new_loc = SavedLocation(
                        user_id=user.id,
                        city=city_data["city"],
                        country=city_data["country"],
                        in_csv_model=is_city_in_model(city_data["city"])
                    )
                    db.add(new_loc)
        
        db.commit()
        print("Database seeding completed successfully!")
        
    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
