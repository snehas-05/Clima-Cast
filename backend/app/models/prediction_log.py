from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.database.base import Base

class PredictionLog(Base):
    __tablename__ = "prediction_logs"

    id = Column(Integer, primary_key=True, index=True)
    city = Column(String(100), index=True)
    model_type = Column(String(50))
    prediction_value = Column(String(255))
    confidence = Column(Float, nullable=True)
    ip_address = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
