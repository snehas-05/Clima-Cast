import os
from sqlalchemy import create_engine, text
from sqlalchemy.engine.url import make_url
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL", "mysql+mysqlconnector://root:password@localhost:3306/climacast"
)

# Connect args needed for SQLite, ignored for MySQL
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
elif DATABASE_URL.startswith("mysql"):
    # Ensure database exists
    url = make_url(DATABASE_URL)
    if url.database:
        db_name = url.database
        base_url = url.set(database="")
        # Using a temporary engine to create the database if it doesn't exist
        base_engine = create_engine(base_url)
        with base_engine.connect() as conn:
            conn.execute(text(f"CREATE DATABASE IF NOT EXISTS `{db_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"))
            conn.commit()

# Create engine with utf8mb4 support for MySQL
engine = create_engine(
    DATABASE_URL, 
    connect_args=connect_args,
    pool_pre_ping=True,
    pool_recycle=3600
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
