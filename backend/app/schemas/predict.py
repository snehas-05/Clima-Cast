from pydantic import BaseModel, Field
from typing import List, Optional, Any

class PredictionBase(BaseModel):
    city: str
    month: int = Field(..., ge=1, le=12)

class RainPredictionRequest(BaseModel):
    city: str
    humidity_9am: float = Field(50.0, ge=0, le=100)
    humidity_3pm: float = Field(50.0, ge=0, le=100)
    pressure_9am: float = Field(1013.0, ge=850, le=1100)
    pressure_3pm: float = Field(1013.0, ge=850, le=1100)
    temp_9am: float = Field(20.0, ge=-50, le=60)
    max_temp: float = Field(30.0, ge=-50, le=60)
    min_temp: float = Field(15.0, ge=-50, le=60)
    wind_speed_9am: float = Field(10.0, ge=0, le=300)
    wind_speed_3pm: float = Field(10.0, ge=0, le=300)
    rain_today: int = Field(0, ge=0, le=1)

class TempPredictionRequest(PredictionBase):
    humidity: float = Field(50.0, ge=0, le=100)
    pressure: float = Field(1013.0, ge=850, le=1100)
    wind: float = Field(10.0, ge=0, le=300)
    cloud: float = Field(0.0, ge=0, le=100)
    uv: float = Field(0.0, ge=0, le=15)

class HumidityPredictionRequest(PredictionBase):
    temp: float = Field(25.0, ge=-50, le=60)
    pressure: float = Field(1013.0, ge=850, le=1100)
    wind: float = Field(10.0, ge=0, le=300)
    precip: float = Field(0.0, ge=0, le=500)

class AlertPredictionRequest(BaseModel):
    city: str
    temp: float = Field(..., ge=-50, le=60)
    wind: float = Field(..., ge=0, le=300)
    humidity: float = Field(..., ge=0, le=100)
    pressure: float = Field(..., ge=850, le=1100)
    month: int = Field(..., ge=1, le=12)

class SHAPFeature(BaseModel):
    feature: str
    contribution: float

class PredictionResponse(BaseModel):
    success: bool
    ml_available: bool = True
    model: str
    city: str
    prediction: Any
    explanation: List[SHAPFeature] = []
    message: Optional[str] = None
    cached: bool = False
