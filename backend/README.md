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

## How to Run Locally

```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

## Production Deployment (Render)

Render Free/Starter tier provides **512 MB RAM**. Running deep learning inference with PyTorch requires strict memory constraints:

1. **Build Command**:
   ```bash
   pip install --no-cache-dir -r requirements.txt
   ```
   *(Uses PyTorch CPU wheels from `--extra-index-url https://download.pytorch.org/whl/cpu` to avoid downloading 2.5GB CUDA runtime).*

2. **Start Command**:
   ```bash
   uvicorn main:app --host 0.0.0.0 --port $PORT --workers 1
   ```
   *(**Crucial:** `--workers 1` ensures only a single PyTorch instance is loaded into memory. Multiple workers will trigger OOM restarts).*

3. **Environment Variables**:
   - `OMP_NUM_THREADS`: `1`
   - `MKL_NUM_THREADS`: `1`
   - `OPENBLAS_NUM_THREADS`: `1`
   - `PYTHON_VERSION`: `3.11.9`

