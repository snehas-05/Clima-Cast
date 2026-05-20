import os
from sqlalchemy import create_engine
from sqlalchemy import text
from sqlalchemy.engine import make_url
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import sessionmaker

from app.config import BACKEND_DIR

DEFAULT_DATABASE_URL = "postgresql+psycopg://postgres:password@127.0.0.1:5432/climacast"
SQLITE_FALLBACK_URL = f"sqlite:///{(BACKEND_DIR / 'climacast.db').as_posix()}"
DATABASE_URL = os.getenv("DATABASE_URL") or DEFAULT_DATABASE_URL
ENABLE_SQLITE_FALLBACK = os.getenv("ENABLE_SQLITE_FALLBACK", "true").lower() == "true"

def build_connect_args(database_url: str) -> dict:
    if database_url.startswith("sqlite"):
        return {"check_same_thread": False}
    if database_url.startswith("postgresql"):
        return {"connect_timeout": 5}
    return {}

def build_engine(database_url: str):
    return create_engine(
        database_url,
        connect_args=build_connect_args(database_url),
        pool_pre_ping=True,
        pool_recycle=3600,
    )

def create_postgres_database_if_missing(database_url: str) -> None:
    url = make_url(database_url)
    database_name = url.database
    if not database_name:
        return

    admin_database = os.getenv("POSTGRES_MAINTENANCE_DB", "postgres")
    admin_url = url.set(database=admin_database)
    admin_engine = create_engine(
        admin_url,
        isolation_level="AUTOCOMMIT",
        connect_args=build_connect_args(database_url),
    )

    try:
        with admin_engine.connect() as conn:
            exists = conn.execute(
                text("SELECT 1 FROM pg_database WHERE datname = :database_name"),
                {"database_name": database_name},
            ).scalar()
            if not exists:
                safe_database_name = database_name.replace('"', '""')
                conn.execute(text(f'CREATE DATABASE "{safe_database_name}"'))
                print(f'Created PostgreSQL database "{database_name}"')
    finally:
        admin_engine.dispose()

if DATABASE_URL.startswith("postgresql"):
    try:
        create_postgres_database_if_missing(DATABASE_URL)
    except SQLAlchemyError as exc:
        print(f"Could not verify/create PostgreSQL database: {exc}")

engine = build_engine(DATABASE_URL)
ACTIVE_DATABASE_URL = DATABASE_URL

if DATABASE_URL.startswith("postgresql") and ENABLE_SQLITE_FALLBACK:
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
    except SQLAlchemyError as exc:
        print(f"PostgreSQL unavailable, using SQLite fallback: {exc}")
        ACTIVE_DATABASE_URL = SQLITE_FALLBACK_URL
        engine = build_engine(ACTIVE_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
