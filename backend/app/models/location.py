from sqlalchemy import Column, Integer, String, ForeignKey, Numeric, Boolean, Index
from sqlalchemy.orm import relationship
from app.database.base import Base

class SavedLocation(Base):
    __tablename__ = "saved_locations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    city = Column(String(100), nullable=False)
    country = Column(String(100), nullable=True)
    lat = Column(Numeric(9, 6), nullable=True)
    lon = Column(Numeric(9, 6), nullable=True)
    in_csv_model = Column(Boolean, default=False)

    # Relationships
    user = relationship("User", back_populates="locations")

    # Composite index for faster lookups and to prevent duplicates per user (logic handled in routes)
    __table_args__ = (
        Index("idx_user_city", "user_id", "city"),
    )
