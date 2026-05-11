import logging
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.database.connection import engine, get_db
from app.database.base import Base
from app.routes import auth, weather, predict, analytics
from app.utils.city_checker import get_supported_cities
from app.ml.model_loader import load_models
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from app.routes.predict import limiter

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

    # Load ML models
    load_models()

    # Load supported cities into cache
    get_supported_cities()
    
    logger.info("Weather cache initialized")
    logger.info("OpenWeather integration active")
    
    yield

app = FastAPI(
    title="Clima-Cast API",
    description="AI-Powered Weather Intelligence Platform — REST API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# SlowAPI Rate Limiting
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)
app.add_middleware(SlowAPIMiddleware)

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
app.include_router(weather.router, prefix="/weather", tags=["Weather"])
app.include_router(predict.router, prefix="/predict", tags=["AI Predictions"])
app.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])

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
