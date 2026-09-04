from sqlalchemy import Column, Integer, String, Float, Text, DateTime
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, default="Field Worker")
    email = Column(String, default="worker@cattlevision.org")
    role = Column(String, default="field_worker")
    created_at = Column(DateTime, default=datetime.utcnow)

class Breed(Base):
    __tablename__ = "breeds"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    species = Column(String, default="Cattle")
    about = Column(Text)
    characteristics = Column(Text)  # Stored as JSON string
    color_hex = Column(String, default="#2E5B41")

class IdentificationRecord(Base):
    __tablename__ = "identification_records"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, default=1)
    breed = Column(String, nullable=False)
    species = Column(String, default="Cattle")
    confidence = Column(Float, nullable=False)
    alternatives = Column(Text, nullable=False)  # Stored as JSON string
    image_url = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
