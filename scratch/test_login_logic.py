import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.user import User
from app.utils.hashing import verify_password
from dotenv import load_dotenv
import sys

# Add backend to path
sys.path.append('backend')

load_dotenv('backend/.env')
DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

email = 'jayy12@gmail.com'
password = 'Password123' # Guessing based on common patterns or just testing

user = db.query(User).filter(User.email == email).first()
if user:
    print(f"User found: {user.email}")
    is_valid = verify_password(password, user.password_hash)
    print(f"Password '{password}' is valid: {is_valid}")
else:
    print("User not found")
db.close()
