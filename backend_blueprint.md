# CattleVision AI - Backend Architecture & API Blueprint

## Overview
CattleVision AI is a computer vision and livestock telemetry application designed for identifying indigenous Indian cattle breeds. It connects a React (Vite) frontend with a FastAPI backend serving a PyTorch EfficientNet-B0 deep learning classifier (89% test accuracy) backed by a local SQLite database (`cattle_vision.db`).

---

## Technical Stack
- **Language**: Python 3.10+
- **Framework**: FastAPI
- **Model Framework**: PyTorch, Torchvision (EfficientNet-B0)
- **Database**: SQLite with SQLAlchemy ORM
- **Image Processing**: Pillow (PIL)
- **Server**: Uvicorn
- **Environment Management**: `.env` configuration

---

## Model Facts & Inference Pipeline

- **Model File**: `backend/model/final_cow_breed_model.pth`
- **Class Mapping**: `backend/class_names.json`
- **Supported Breeds (18 Indigenous Indian Cattle Breeds)**:
  1. Amritmahal
  2. Bargur
  3. Dangi
  4. Deoni
  5. Gir
  6. Hallikar
  7. Hariana
  8. Kangayam
  9. Kankrej
  10. Khillari
  11. Krishna_Valley
  12. Ongole
  13. Rathi
  14. Red_Sindhi
  15. Sahiwal
  16. Tharparkar
  17. Umblachery
  18. Vechur
- **Species Returned**: `"Cattle"`
- **Preprocessing Standards**:
  1. Convert input image to RGB
  2. Resize image to `224x224`
  3. Convert image to PyTorch Tensor
  4. Normalize using ImageNet statistics:
     - Mean: `[0.485, 0.456, 0.406]`
     - Standard Deviation: `[0.229, 0.224, 0.225]`
  5. Compute Softmax probabilities over 18 classes and extract top-3 alternatives.

---

## Database Schemas (SQLite)

### 1. `users`
- `id` (INTEGER, Primary Key)
- `name` (VARCHAR, default: "Field Worker")
- `email` (VARCHAR, default: "worker@cattlevision.org")
- `role` (VARCHAR, default: "field_worker")
- `created_at` (DATETIME)

### 2. `breeds`
- `id` (INTEGER, Primary Key)
- `name` (VARCHAR, Unique, Indexed)
- `species` (VARCHAR, default: "Cattle")
- `about` (TEXT)
- `characteristics` (TEXT, JSON string)
- `color_hex` (VARCHAR)

### 3. `identification_records`
- `id` (INTEGER, Primary Key)
- `user_id` (INTEGER, Foreign Key / Reference)
- `breed` (VARCHAR)
- `species` (VARCHAR, default: "Cattle")
- `confidence` (FLOAT)
- `alternatives` (TEXT, JSON string)
- `image_url` (VARCHAR)
- `created_at` (DATETIME)

---

## API Endpoint Specification

### Health Check
- `GET /health`
  - **Response**: `{"status": "ok"}`

### Breed Identification
- `POST /api/identify`
  - **Content-Type**: `multipart/form-data`
  - **Body Parameter**: `image` (File)
  - **Response**:
    ```json
    {
      "id": 1,
      "breed": "Gir",
      "species": "Cattle",
      "confidence": 87.4,
      "alternatives": [
        { "breed": "Gir", "species": "Cattle", "confidence": 87.4 },
        { "breed": "Sahiwal", "species": "Cattle", "confidence": 8.1 },
        { "breed": "Red Sindhi", "species": "Cattle", "confidence": 4.5 }
      ],
      "image_url": "/uploads/<unique_filename>.jpg",
      "created_at": "2026-09-05T03:57:21"
    }
    ```

### History API
- `GET /api/history`
  - **Response**: List of identification records ordered by `created_at` descending. Includes calculated `date` label (`"Today"`, `"Yesterday"`, or formatted date).
- `GET /api/history/{id}`
  - **Response**: Single identification record detail.
- `DELETE /api/history/{id}`
  - **Response**: `{"message": "Identification record deleted", "id": 1}`

### Dashboard Statistics
- `GET /api/dashboard/stats`
  - **Response**:
    ```json
    {
      "total_identified": 24,
      "avg_confidence": 88.5,
      "breeds_covered": 8,
      "this_week_count": 5,
      "confidence_change_pct": 2.4,
      "weekly_confidence": [
        { "day": "Mon", "value": 82.0 },
        { "day": "Tue", "value": 89.1 },
        { "day": "Wed", "value": 85.4 },
        { "day": "Thu", "value": 91.2 },
        { "day": "Fri", "value": 87.8 },
        { "day": "Sat", "value": 0.0 },
        { "day": "Sun", "value": 0.0 }
      ]
    }
    ```

### Breed Library API
- `GET /api/breeds`
  - **Response**: List of all 18 Indian cattle breeds with metadata.
- `GET /api/breeds/{name}`
  - **Response**: Detail of requested breed by name.

### User Profile API
- `GET /api/users/me`
  - **Response**: Current demo user profile details with total identification count and average confidence.
- `PUT /api/users/me`
  - **Body**: `{"name": "...", "email": "..."}`
  - **Response**: Updated user profile object.

---

## Deployment & Production Readiness

### Backend Deployment (Render / Railway / Container)
- Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Environment Variables:
  - `PORT=8000`
  - `CORS_ORIGINS=https://your-frontend.vercel.app`
  - `DATABASE_URL=sqlite:///./cattle_vision.db`

### Frontend Deployment (Vercel / Netlify)
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variables:
  - `VITE_API_BASE_URL=https://your-backend.onrender.com`
