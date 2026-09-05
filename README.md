# CattleVision AI

**AI-Powered Indian Cattle Breed Identification System**

CattleVision AI is a computer-vision based web application that identifies Indian cattle breeds from uploaded images using a deep-learning model.

## Live Demo

* **Frontend:** https://cattle-vision-ai-iota.vercel.app/
* **Backend:** https://cattlevision-backend.onrender.com

## Problem

Identifying cattle breeds manually can be difficult, especially when dealing with visually similar Indian breeds. CattleVision AI provides an accessible AI-based approach for breed identification from images.

## Solution

The system accepts a cattle image through the web interface, sends it to the backend API, processes it using a trained EfficientNet-B0 model, and returns the predicted breed.

```text
User
  ↓
Frontend
  ↓
Backend API
  ↓
Image Processing
  ↓
EfficientNet-B0
  ↓
Breed Prediction
  ↓
Frontend Result
```

## Key Features

* Indian cattle breed identification
* Image-based AI prediction
* 18 selected Indian cattle breeds
* 3,327 training images
* EfficientNet-B0 deep-learning model
* PyTorch-based inference
* Web-based prediction interface
* Separate frontend and backend deployment

## AI & Dataset

| Component            | Details                     |
| -------------------- | --------------------------- |
| Dataset              | Indian Cattle Image Dataset |
| Breeds               | 18 Indian cattle breeds     |
| Images               | 3,327                       |
| Model                | EfficientNet-B0             |
| Framework            | PyTorch                     |
| Pretrained Weights   | ImageNet                    |
| Training Environment | Kaggle                      |

The dataset was researched, cleaned, organized, segmented, and prepared before model training.

## Technology Stack

**Frontend**

* HTML
* CSS
* JavaScript
* Vercel

**Backend**

* Python
* REST API
* Render

**AI/ML**

* PyTorch
* EfficientNet-B0
* Computer Vision

## Architecture

```text
                CattleVision AI

                    User
                      │
                      ▼
              ┌───────────────┐
              │   Frontend    │
              │    Vercel     │
              └───────┬───────┘
                      │
                  HTTP Request
                      │
                      ▼
              ┌───────────────┐
              │    Backend    │
              │    Render     │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │ EfficientNet  │
              │     -B0       │
              └───────┬───────┘
                      │
                      ▼
                Breed Prediction
                      │
                      ▼
                  Frontend
```

## Contributors

### Ankit Nag

* Frontend development
* UI/UX design
* Website interface
* Interactive user experience

### Prince Agrawal

* Frontend development
* UI/UX contribution
* Website implementation
* Data cleaning
* Dataset management and preparation
* Dataset segmentation

### Nitin Sharma

* Research and problem-domain analysis
* Dataset research, collection, cleaning, and preparation
* Dataset organization and segmentation
* AI dataset pipeline development
* EfficientNet-B0 implementation and training
* AI inference and prediction pipeline
* Backend API development
* Frontend–backend–AI integration
* Deployment, debugging, and troubleshooting
* End-to-end AI pipeline integration

## Future Scope

* Support more Indian cattle breeds
* Expand the training dataset
* Improve model accuracy and generalization
* Add confidence scores and top-k predictions
* Add detailed breed information
* Optimize the model for mobile and edge devices
* Add explainable AI features

## Disclaimer

CattleVision AI is developed for educational, research, and hackathon demonstration purposes. Predictions should not be considered official breed certification or professional veterinary advice.

## Links

**Live Application:**
https://cattle-vision-ai-iota.vercel.app/

**Backend API:**
https://cattlevision-backend.onrender.com
