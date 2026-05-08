# Compatibility layer for Phase 3 imports
from app.database.connection import engine, SessionLocal, get_db
from app.database.base import Base

# Re-exporting for backward compatibility
__all__ = ["engine", "SessionLocal", "get_db", "Base"]
