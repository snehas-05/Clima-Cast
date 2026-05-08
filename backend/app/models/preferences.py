from sqlalchemy import Column, Integer, ForeignKey, Boolean, Enum
from sqlalchemy.orm import relationship
import enum
from app.database.base import Base

class ThemeType(str, enum.Enum):
    DARK = "dark"
    LIGHT = "light"

class UnitType(str, enum.Enum):
    CELSIUS = "celsius"
    FAHRENHEIT = "fahrenheit"

class UserPreference(Base):
    __tablename__ = "preferences"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    theme = Column(Enum(ThemeType), default=ThemeType.DARK)
    unit = Column(Enum(UnitType), default=UnitType.CELSIUS)
    show_confidence = Column(Boolean, default=True)

    # Relationships
    user = relationship("User", back_populates="preferences")
