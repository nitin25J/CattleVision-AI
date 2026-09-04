from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class AlternativeItem(BaseModel):
    breed: str
    species: str = "Cattle"
    confidence: float

class IdentifyResponse(BaseModel):
    id: int
    breed: str
    species: str = "Cattle"
    confidence: float
    alternatives: List[AlternativeItem]
    image_url: str
    created_at: str

class HistoryRecordResponse(BaseModel):
    id: int
    breed: str
    species: str = "Cattle"
    confidence: float
    alternatives: List[AlternativeItem]
    image_url: str
    created_at: str
    date: str

class WeeklyConfidenceItem(BaseModel):
    day: str
    value: float

class DashboardStatsResponse(BaseModel):
    total_identified: int
    avg_confidence: float
    breeds_covered: int
    this_week_count: int
    confidence_change_pct: float
    weekly_confidence: List[WeeklyConfidenceItem]

class BreedResponse(BaseModel):
    name: str
    species: str = "Cattle"
    about: str
    characteristics: List[str]
    color_hex: str

class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    created_at: str
    identifications_count: int
    avg_confidence: float

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
