# CattleVision AI

AI-powered platform for identifying indigenous Indian cattle breeds using Computer Vision and Deep Learning.

## Overview

CattleVision AI combines a trained EfficientNet-B0 model, FastAPI backend, SQLite database, and React frontend into one complete application.

Users can upload a cattle image, receive the predicted breed with confidence and alternative predictions, explore breed information, and maintain identification history.

## Built By Us

- Dataset preparation and breed selection
- EfficientNet-B0 model training and evaluation
- Custom PyTorch inference pipeline
- FastAPI backend and REST APIs
- SQLite database with SQLAlchemy
- Image upload and storage
- React + Vite frontend
- Dashboard and analytics
- Breed library
- Identification history
- Frontend-backend integration
- Deployment configuration

## Model

**Architecture:** EfficientNet-B0  
**Supported Classes:** 18 Indian cattle breeds  
**Test Accuracy:** 89%  
**Input Size:** 224 × 224

### Supported Breeds

Amritmahal, Bargur, Dangi, Deoni, Gir, Hallikar, Hariana,  
Kangayam, Kankrej, Khillari, Krishna Valley, Ongole, Rathi,  
Red Sindhi, Sahiwal, Tharparkar, Umblachery, Vechur

## Prediction Flow

```text
Image
  ↓
Preprocessing
  ↓
EfficientNet-B0
  ↓
Softmax
  ↓
Top Prediction + Top-3 Alternatives
  ↓
Database
  ↓
Frontend Result
