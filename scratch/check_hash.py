import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv('backend/.env')
DATABASE_URL = os.getenv("DATABASE_URL")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT password_hash FROM users WHERE email='jayy12@gmail.com'"))
        row = result.fetchone()
        if row:
            print(f"Hash: {row[0]}")
        else:
            print("User not found")
except Exception as e:
    print(f"Error: {e}")
