import os
from sqlalchemy import create_engine, text
from dotenv import load_dotenv

load_dotenv('backend/.env')
DATABASE_URL = os.getenv("DATABASE_URL")

try:
    engine = create_engine(DATABASE_URL)
    with engine.connect() as conn:
        result = conn.execute(text("SELECT email FROM users"))
        users = result.fetchall()
        print(f"Users in DB: {users}")
except Exception as e:
    print(f"Error: {e}")
