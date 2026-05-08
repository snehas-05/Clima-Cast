import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.connection import engine, get_db
from app.database.base import Base
from app.routes import auth
from app.utils.city_checker import get_supported_cities
import app.models  # Ensure models are imported for Base.metadata

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("uvicorn.error")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create tables
    try:
        Base.metadata.create_all(bind=engine)
        logger.info("Database tables created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")

    # Load supported cities into cache
    get_supported_cities()
    
    yield

app = FastAPI(
    title="Clima-Cast API",
    description="AI-Powered Weather Intelligence Platform — REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Auth"])

@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "online",
        "app": "Clima-Cast API",
        "version": "1.0.0",
        "docs": "/docs",
    }

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy"}

@app.get("/health/db", tags=["Health"])
async def health_db(db: Session = Depends(get_db)):
    """Verify database connectivity."""
    try:
        db.execute(text("SELECT 1"))
        return {
            "success": True,
            "database": "connected"
        }
    except Exception as e:
        logger.error(f"Database connection health check failed: {e}")
        return {
            "success": False,
            "database": "disconnected",
            "error": str(e)
        }
