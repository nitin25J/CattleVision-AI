import os
import uuid
import json
from datetime import datetime, timedelta
from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from sqlalchemy import func

from database import engine, SessionLocal, Base, get_db
import models
import schemas
import predict

UPLOADS_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

# 18 Indian Cattle Breeds Reference Data
SEED_BREEDS = [
    {
        "name": "Amritmahal",
        "species": "Cattle",
        "about": "An ancient draft cattle breed from Karnataka, famed for endurance, speed, and fierce loyalty.",
        "characteristics": ["Greyish coat", "Long sharp horns", "Muscular frame", "High endurance"],
        "color_hex": "#757D75"
    },
    {
        "name": "Bargur",
        "species": "Cattle",
        "about": "A compact draft cattle breed native to the Bargur forest hills of Erode district, Tamil Nadu.",
        "characteristics": ["Brown with white patches", "Flame-like markings", "Agile in hill terrain", "Hardy build"],
        "color_hex": "#8A4F3D"
    },
    {
        "name": "Dangi",
        "species": "Cattle",
        "about": "An indigenous cattle breed from Maharashtra, well-suited to high rainfall areas and heavy work.",
        "characteristics": ["Black and white speckled coat", "Oil-secreting skin", "Rain resistant", "Medium build"],
        "color_hex": "#4A4E5A"
    },
    {
        "name": "Deoni",
        "species": "Cattle",
        "about": "A dual-purpose breed from Maharashtra and Karnataka, closely related to Gir cattle.",
        "characteristics": ["White coat with black spots", "Drooping ears", "Prominent forehead", "Good milk yield"],
        "color_hex": "#6C7A89"
    },
    {
        "name": "Gir",
        "species": "Cattle",
        "about": "An iconic Indian dairy cattle breed known for its distinctive reddish coat and high milk production in Gujarat.",
        "characteristics": ["Reddish coat", "Curved horns", "Long pendulous ears", "Distinctive convex forehead"],
        "color_hex": "#B4772E"
    },
    {
        "name": "Hallikar",
        "species": "Cattle",
        "about": "A premier draft breed from Karnataka, historical origin of the Amritmahal draft strain.",
        "characteristics": ["Grey coat", "Long backward curved horns", "Compact body", "Fast trotting pace"],
        "color_hex": "#5D6D7E"
    },
    {
        "name": "Hariana",
        "species": "Cattle",
        "about": "A prominent dual-purpose cattle breed from North India (Haryana, Punjab, and UP).",
        "characteristics": ["White or light grey coat", "Small horns", "Coffin-shaped skull", "High stamina"],
        "color_hex": "#85929E"
    },
    {
        "name": "Kangayam",
        "species": "Cattle",
        "about": "A famous draft cattle breed native to Tamil Nadu, celebrated in traditional cultural events.",
        "characteristics": ["Greyish-white coat", "Dark markings on hump", "Strong erect horns", "Robust constitution"],
        "color_hex": "#626567"
    },
    {
        "name": "Kankrej",
        "species": "Cattle",
        "about": "A heavy dual-purpose breed from Gujarat and Rajasthan with magnificent lyre-shaped horns.",
        "characteristics": ["Silver-grey to dark grey coat", "Large lyre-shaped horns", "Pacing gait", "Heat resistant"],
        "color_hex": "#7B7D7D"
    },
    {
        "name": "Khillari",
        "species": "Cattle",
        "about": "A powerful draft cattle breed from southern Maharashtra and northern Karnataka.",
        "characteristics": ["Greyish-white coat", "Long pointed horns", "Tight skin", "Fast walking draft power"],
        "color_hex": "#707B7C"
    },
    {
        "name": "Krishna Valley",
        "species": "Cattle",
        "about": "A heavy draft breed from the fertile valleys of the Krishna river in Karnataka and AP.",
        "characteristics": ["Greyish-white coat", "Massive body frame", "Short thick horns", "High pulling power"],
        "color_hex": "#566573"
    },
    {
        "name": "Ongole",
        "species": "Cattle",
        "about": "A famous dual-purpose breed from Andhra Pradesh known worldwide for disease resistance and strength.",
        "characteristics": ["Glossy white coat", "Large hump", "Short stumpy horns", "High disease resistance"],
        "color_hex": "#909497"
    },
    {
        "name": "Rathi",
        "species": "Cattle",
        "about": "An important milch cattle breed from the arid Thar desert region of Rajasthan.",
        "characteristics": ["Brown coat with white spots", "Medium build", "Good milk yield", "Extreme climate tolerance"],
        "color_hex": "#A04000"
    },
    {
        "name": "Red Sindhi",
        "species": "Cattle",
        "about": "A compact, deep-red dairy breed known for disease resistance and reliable milk production.",
        "characteristics": ["Deep red coat", "Compact build", "Short horns", "Tropical adaptation"],
        "color_hex": "#922B21"
    },
    {
        "name": "Sahiwal",
        "species": "Cattle",
        "about": "A premier dairy cattle breed originating from Punjab, valued for high milk yield and heat tolerance.",
        "characteristics": ["Reddish-brown coat", "Loose skin (dewlap)", "Short horns", "High butterfat milk"],
        "color_hex": "#873600"
    },
    {
        "name": "Tharparkar",
        "species": "Cattle",
        "about": "A dual-purpose milch and draft breed from the Thar desert, thriving on sparse vegetation.",
        "characteristics": ["White or light grey coat", "Lyre-shaped horns", "Medium build", "Thrives in desert heat"],
        "color_hex": "#7D6608"
    },
    {
        "name": "Umblachery",
        "species": "Cattle",
        "about": "A small draft cattle breed from the coastal delta region of Nagapattinam and Tiruvarur in Tamil Nadu.",
        "characteristics": ["Grey coat with white stars on forehead", "Short horns", "Compact body", "Adapted to marshy fields"],
        "color_hex": "#4D5656"
    },
    {
        "name": "Vechur",
        "species": "Cattle",
        "about": "The smallest cattle breed in the world, native to Kerala, famed for low feed requirement and high-quality milk.",
        "characteristics": ["Light red or black coat", "Dwarf body stature", "Small horns", "High disease resistance"],
        "color_hex": "#78281F"
    }
]

def init_db_data():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Create demo user if not exists
        user = db.query(models.User).filter(models.User.id == 1).first()
        if not user:
            user = models.User(id=1, name="Field Worker", email="worker@cattlevision.org", role="field_worker")
            db.add(user)
            db.commit()

        # Seed breeds if not present
        existing_count = db.query(models.Breed).count()
        if existing_count == 0:
            for b in SEED_BREEDS:
                breed_obj = models.Breed(
                    name=b["name"],
                    species=b["species"],
                    about=b["about"],
                    characteristics=json.dumps(b["characteristics"]),
                    color_hex=b["color_hex"]
                )
                db.add(breed_obj)
            db.commit()
            print(f"[Init] Seeded {len(SEED_BREEDS)} Indian cattle breeds into database.")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db_data()
    predict.load_model()
    yield

app = FastAPI(
    title="CattleVision AI Backend",
    description="FastAPI + PyTorch EfficientNet-B0 Backend for Indian Cattle Breed Identification",
    version="1.0.0",
    lifespan=lifespan
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded static images
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Health Check
@app.get("/health")
def health_check():
    return {"status": "ok"}

# Identify Breed Endpoint
@app.post("/api/identify", response_model=schemas.IdentifyResponse)
async def identify_breed(
    image: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File uploaded must be a valid image (JPG, PNG, WEBP).")

    content = await image.read()
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Uploaded image file is empty.")

    # Determine file extension
    ext = ".jpg"
    if image.filename:
        filename_ext = os.path.splitext(image.filename)[1].lower()
        if filename_ext in [".jpg", ".jpeg", ".png", ".webp"]:
            ext = filename_ext

    saved_filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOADS_DIR, saved_filename)

    with open(filepath, "wb") as f:
        f.write(content)

    # Run PyTorch inference
    try:
        pred_result = predict.predict_breed_from_bytes(content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image processing failed: {str(e)}")

    image_url = f"/uploads/{saved_filename}"

    # Save to SQLite database
    record = models.IdentificationRecord(
        user_id=1,
        breed=pred_result["breed"],
        species=pred_result["species"],
        confidence=pred_result["confidence"],
        alternatives=json.dumps(pred_result["alternatives"]),
        image_url=image_url,
        created_at=datetime.utcnow()
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return {
        "id": record.id,
        "breed": record.breed,
        "species": record.species,
        "confidence": record.confidence,
        "alternatives": json.loads(record.alternatives),
        "image_url": record.image_url,
        "created_at": record.created_at.isoformat()
    }

# History Endpoints
@app.get("/api/history", response_model=List[schemas.HistoryRecordResponse])
def get_history(db: Session = Depends(get_db)):
    records = db.query(models.IdentificationRecord).order_by(models.IdentificationRecord.created_at.desc()).all()
    res = []
    now = datetime.utcnow()
    for r in records:
        delta_days = (now.date() - r.created_at.date()).days
        if delta_days == 0:
            date_label = "Today"
        elif delta_days == 1:
            date_label = "Yesterday"
        else:
            date_label = r.created_at.strftime("%b %d, %Y")

        res.append({
            "id": r.id,
            "breed": r.breed,
            "species": r.species,
            "confidence": r.confidence,
            "alternatives": json.loads(r.alternatives) if r.alternatives else [],
            "image_url": r.image_url,
            "created_at": r.created_at.isoformat(),
            "date": date_label
        })
    return res

@app.get("/api/history/{record_id}", response_model=schemas.HistoryRecordResponse)
def get_history_detail(record_id: int, db: Session = Depends(get_db)):
    r = db.query(models.IdentificationRecord).filter(models.IdentificationRecord.id == record_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Identification record not found.")

    delta_days = (datetime.utcnow().date() - r.created_at.date()).days
    if delta_days == 0:
        date_label = "Today"
    elif delta_days == 1:
        date_label = "Yesterday"
    else:
        date_label = r.created_at.strftime("%b %d, %Y")

    return {
        "id": r.id,
        "breed": r.breed,
        "species": r.species,
        "confidence": r.confidence,
        "alternatives": json.loads(r.alternatives) if r.alternatives else [],
        "image_url": r.image_url,
        "created_at": r.created_at.isoformat(),
        "date": date_label
    }

@app.delete("/api/history/{record_id}")
def delete_history_record(record_id: int, db: Session = Depends(get_db)):
    r = db.query(models.IdentificationRecord).filter(models.IdentificationRecord.id == record_id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Identification record not found.")

    db.delete(r)
    db.commit()
    return {"message": "Identification record deleted", "id": record_id}

# Dashboard Stats Endpoint
@app.get("/api/dashboard/stats", response_model=schemas.DashboardStatsResponse)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(models.IdentificationRecord).count()

    if total == 0:
        return {
            "total_identified": 0,
            "avg_confidence": 0.0,
            "breeds_covered": 0,
            "this_week_count": 0,
            "confidence_change_pct": 0.0,
            "weekly_confidence": [
                {"day": "Mon", "value": 0.0},
                {"day": "Tue", "value": 0.0},
                {"day": "Wed", "value": 0.0},
                {"day": "Thu", "value": 0.0},
                {"day": "Fri", "value": 0.0},
                {"day": "Sat", "value": 0.0},
                {"day": "Sun", "value": 0.0}
            ]
        }

    avg_conf = db.query(func.avg(models.IdentificationRecord.confidence)).scalar() or 0.0
    distinct_breeds = db.query(func.count(func.distinct(models.IdentificationRecord.breed))).scalar() or 0

    now = datetime.utcnow()
    start_of_week = now - timedelta(days=now.weekday())
    start_of_week = start_of_week.replace(hour=0, minute=0, second=0, microsecond=0)

    this_week_count = db.query(models.IdentificationRecord).filter(
        models.IdentificationRecord.created_at >= start_of_week
    ).count()

    # Weekly confidence breakdown
    day_map = {0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu", 4: "Fri", 5: "Sat", 6: "Sun"}
    weekly_items = []
    for i in range(7):
        day_date = start_of_week + timedelta(days=i)
        next_day = day_date + timedelta(days=1)
        day_avg = db.query(func.avg(models.IdentificationRecord.confidence)).filter(
            models.IdentificationRecord.created_at >= day_date,
            models.IdentificationRecord.created_at < next_day
        ).scalar()
        val = round(float(day_avg), 1) if day_avg is not None else 0.0
        weekly_items.append({"day": day_map[i], "value": val})

    return {
        "total_identified": total,
        "avg_confidence": round(float(avg_conf), 1),
        "breeds_covered": distinct_breeds,
        "this_week_count": this_week_count,
        "confidence_change_pct": 2.4,
        "weekly_confidence": weekly_items
    }

# Breed Library Endpoints
@app.get("/api/breeds", response_model=List[schemas.BreedResponse])
def get_breeds(db: Session = Depends(get_db)):
    breeds = db.query(models.Breed).all()
    res = []
    for b in breeds:
        res.append({
            "name": b.name,
            "species": b.species,
            "about": b.about,
            "characteristics": json.loads(b.characteristics) if b.characteristics else [],
            "color_hex": b.color_hex
        })
    return res

@app.get("/api/breeds/{name}", response_model=schemas.BreedResponse)
def get_breed_detail(name: str, db: Session = Depends(get_db)):
    search_name = name.replace("_", " ").strip().lower()
    breeds = db.query(models.Breed).all()
    target = None
    for b in breeds:
        if b.name.strip().lower() == search_name or b.name.replace("_", " ").strip().lower() == search_name:
            target = b
            break

    if not target:
        raise HTTPException(status_code=404, detail=f"Breed '{name}' not found in breed library.")

    return {
        "name": target.name,
        "species": target.species,
        "about": target.about,
        "characteristics": json.loads(target.characteristics) if target.characteristics else [],
        "color_hex": target.color_hex
    }

# User Profile Endpoints
@app.get("/api/users/me", response_model=schemas.UserProfileResponse)
def get_user_profile(db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user:
        user = models.User(id=1, name="Field Worker", email="worker@cattlevision.org", role="field_worker")
        db.add(user)
        db.commit()

    total = db.query(models.IdentificationRecord).count()
    avg_conf = db.query(func.avg(models.IdentificationRecord.confidence)).scalar() or 0.0

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at.isoformat(),
        "identifications_count": total,
        "avg_confidence": round(float(avg_conf), 1)
    }

@app.put("/api/users/me", response_model=schemas.UserProfileResponse)
def update_user_profile(payload: schemas.UserProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == 1).first()
    if not user:
        user = models.User(id=1, name="Field Worker", email="worker@cattlevision.org", role="field_worker")
        db.add(user)
        db.commit()

    if payload.name is not None:
        user.name = payload.name
    if payload.email is not None:
        user.email = payload.email

    db.commit()
    db.refresh(user)

    total = db.query(models.IdentificationRecord).count()
    avg_conf = db.query(func.avg(models.IdentificationRecord.confidence)).scalar() or 0.0

    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "created_at": user.created_at.isoformat(),
        "identifications_count": total,
        "avg_confidence": round(float(avg_conf), 1)
    }
