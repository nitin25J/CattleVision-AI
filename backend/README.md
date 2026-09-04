# CattleVision AI — Backend API

Functional Python FastAPI backend for CattleVision AI powered by PyTorch EfficientNet-B0 and SQLite.

## Features
- **PyTorch EfficientNet-B0 Model**: Loaded once at startup to predict top-3 Indian cattle breeds from 18 supported breeds.
- **SQLite + SQLAlchemy**: Auto-initializing database storing identification history records and breed reference metadata.
- **RESTful Endpoints**:
  - `GET /health`
  - `POST /api/identify` (image upload & prediction)
  - `GET /api/history`
  - `GET /api/history/{id}`
  - `DELETE /api/history/{id}`
  - `GET /api/dashboard/stats`
  - `GET /api/breeds`
  - `GET /api/breeds/{name}`
  - `GET /api/users/me`
  - `PUT /api/users/me`

## How to Run

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```
