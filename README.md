#  CattleVision AI

## AI-Powered Indian Cattle Breed Identification System

CattleVision AI is a **computer-vision-based web application** that identifies Indian cattle breeds from images using a deep-learning classification model.

The system uses a **fine-tuned EfficientNet-B0 model with PyTorch** to classify cattle images into **18 selected Indian cattle breeds**, achieving **90% test accuracy** on the evaluated dataset.

The application provides a complete end-to-end pipeline, from image upload and preprocessing to AI inference and breed prediction through a web interface.

---

##  Live Demo

**Frontend:**
https://cattle-vision-ai-iota.vercel.app/

**Backend API:**
https://cattlevision-backend.onrender.com

---

##  Problem Statement

Identifying cattle breeds manually can be challenging, particularly when different breeds share similar physical characteristics.

Traditional identification often depends on visual expertise and domain knowledge, which may not always be readily available to farmers, field workers, researchers, or other users.

CattleVision AI provides an accessible **AI-assisted image-based approach** for identifying supported Indian cattle breeds.

---

##  Solution

CattleVision AI allows users to upload an image of cattle through a web interface.

The image is sent to the backend API, where it is processed and passed through a trained **EfficientNet-B0** model. The model predicts the most likely breed and returns the result to the frontend.

### Prediction Pipeline

```text
User
  ↓
Upload Cattle Image
  ↓
Frontend
  ↓
Backend API
  ↓
Image Preprocessing
  ↓
EfficientNet-B0
  ↓
Breed Classification
  ↓
Prediction + Confidence
  ↓
Frontend Result
```

---

## Key Features

- Indian cattle breed identification
- Image-based breed classification
- Deep-learning-based prediction
- Support for 18 selected Indian cattle breeds
- **90% test accuracy**
- Top-3 breed predictions
- Confidence scores
- Fast web-based inference
- REST API-based backend
- Dynamic veterinary clinic and hospital locator
- Browser-based location detection
- OpenStreetMap / Overpass-based veterinary search
- Haversine-based geographic distance validation
- Automatic veterinary search-radius expansion
- Rural-area veterinary fallback support
- Geographic validation for fallback veterinary locations
- Deprecated Foursquare API integration removed
- Optimized prediction loading experience
- Reduced artificial processing delay from **2.2 seconds to 1.2 seconds**
- Prediction history using SQLite
- Separate frontend and backend deployment
- Accessible through a web browser


---

## Veterinary Assistance & Location Intelligence

CattleVision AI includes a dynamic veterinary locator designed to help users identify nearby veterinary hospitals and clinics based on their current geographic location.

### Dynamic Veterinary Locator

The veterinary discovery pipeline uses **OpenStreetMap and the Overpass API** to search for nearby veterinary facilities dynamically.

The system uses an adaptive search strategy:

```text
User Location
      ↓
40 km Search Radius
      ↓
Veterinary Clinics Found?
   ↙             ↘
 YES              NO
  ↓                ↓
Show Results     Expand to 60 km
                   ↓
             Clinics Found?
                ↙      ↘
              YES       NO
               ↓         ↓
          Show Results  Expand to 100 km
                            ↓
                       Show Results
```

### Location-Aware Search

The system uses geographic distance calculations to ensure that veterinary facilities are relevant to the user's actual location.

* Browser-based user geolocation
* Haversine distance calculation
* Dynamic search-radius expansion
* OpenStreetMap / Overpass API integration
* Location-aware veterinary facility discovery
* Support for rural and tier-3 locations

### Rural Veterinary Fallback

Because veterinary facilities in rural areas may not always be completely mapped in OpenStreetMap, CattleVision AI includes a verified local fallback database for selected underserved regions.

The fallback currently includes:

* **Sehore Government Veterinary Hospital — Sehore**
* **State Veterinary Hospital / Rajya Pashu Chikitsalay — Bhopal**
* **Pet Spectrum Veterinary Clinic and Surgery Center — Bhopal**

The fallback system performs geographic validation before displaying these locations. It does not blindly display Sehore or Bhopal facilities to users located in unrelated regions.

This provides an additional reliability layer when live OpenStreetMap data does not return sufficient veterinary facilities.

### Deprecated API Removal

The previous **Foursquare API integration was completely removed** from the veterinary locator pipeline, eliminating obsolete API dependencies and associated API-key errors.

---

##  Prediction Experience Optimization

The frontend prediction experience has been optimized to provide faster feedback while maintaining the application's AI-analysis experience.

### Processing Experience

The artificial ML-processing animation on the prediction interface was reduced from:

**2.2 seconds → 1.2 seconds**

This reduces unnecessary waiting time while preserving the visual processing state presented to users during AI inference.

### UX Improvements

* Faster perceived prediction response
* Reduced artificial processing delay
* Cleaner prediction-loading experience
* More responsive result presentation
* Maintained visual AI-analysis feedback
* Improved overall frontend performance perception

---

##  AI & Machine Learning

The project uses **transfer learning** with EfficientNet-B0.

EfficientNet-B0 was initialized with **ImageNet pretrained weights** and adapted for the Indian cattle breed classification task.

### Model Pipeline

```text
Image
  ↓
Image Preprocessing
  ↓
EfficientNet-B0
  ↓
Feature Extraction
  ↓
Classification Layer
  ↓
18 Breed Classes
  ↓
Prediction
```

### Model Details

| Component            | Details                          |
| -------------------- | -------------------------------- |
| Model                | EfficientNet-B0                  |
| Learning Approach    | Transfer Learning                |
| Pretrained Weights   | ImageNet                         |
| Framework            | PyTorch                          |
| Classification Type  | Multi-Class Image Classification |
| Number of Classes    | 18                               |
| Test Accuracy        | **90%**                          |
| Training Environment | Kaggle                           |

---

## 📊 Dataset

The project uses an **Indian Cattle Image Dataset** containing images belonging to 18 selected Indian cattle breeds.

The dataset was researched, collected, cleaned, organized, segmented, and prepared before model training.

| Dataset Component | Details                     |
| ----------------- | --------------------------- |
| Dataset           | Indian Cattle Image Dataset |
| Number of Breeds  | 18                          |
| Training Images   | 3,327                       |
| Model             | EfficientNet-B0             |
| Framework         | PyTorch                     |
| Training Platform | Kaggle                      |
| Test Accuracy     | **90%**                     |

### Dataset Preparation

The dataset preparation pipeline included:

* Dataset research and collection
* Image cleaning
* Dataset organization
* Breed-wise segmentation
* Image preprocessing
* Preparation for model training

---

##  Model Performance

The trained EfficientNet-B0 model achieved:

### **90% Test Accuracy**

The model predicts the most likely breed along with confidence information and top-3 predictions.

> **Note:** Model confidence represents the model's prediction score and should not be interpreted as official breed certification.

---

##  System Architecture

CattleVision AI consists of three primary layers:

```text
                    CattleVision AI

                         USER
                           │
                           ▼
                 ┌─────────────────┐
                 │    Frontend     │
                 │     React       │
                 │     Vercel      │
                 └────────┬────────┘
                          │
                     HTTP Request
                          │
                          ▼
                 ┌─────────────────┐
                 │     Backend     │
                 │     FastAPI     │
                 │     Render      │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Image Processing│
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  EfficientNet   │
                 │      B0         │
                 │    PyTorch      │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Breed Prediction│
                 │ + Confidence    │
                 │ + Top-3 Results │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │    SQLite       │
                 │ Prediction      │
                 │    History      │
                 └─────────────────┘
```

---

##  End-to-End Workflow

### 1. Image Upload

The user uploads a cattle image through the web interface.

### 2. API Request

The frontend sends the image to the backend through an HTTP request.

### 3. Image Processing

The backend receives and preprocesses the uploaded image according to the model's expected input format.

### 4. AI Inference

The processed image is passed to the trained EfficientNet-B0 model.

### 5. Breed Classification

The model generates predictions across the 18 supported breed classes.

### 6. Result Generation

The backend returns the predicted breed, confidence information, and top-3 predictions.

### 7. Result Display

The frontend displays the prediction to the user.

### 8. History Storage

Prediction information can be stored in the SQLite-based identification history.

---

##  Technology Stack

### Frontend

* React
* JavaScript
* HTML
* CSS
* Vercel

### Backend

* Python
* FastAPI
* REST API
* Render

### AI / Machine Learning

* PyTorch
* EfficientNet-B0
* Computer Vision
* Transfer Learning
* ImageNet pretrained weights

### Database

* SQLite

### Development & Training

* Kaggle
* GitHub

---

##  Deployment

The application uses separate deployments for the frontend and backend.

```text
Frontend
   │
   └── Vercel
         │
         │ HTTPS API Request
         ▼
Backend
   │
   └── Render
         │
         ▼
PyTorch Model
         │
         ▼
Breed Prediction
```

### Frontend

Hosted on **Vercel**

https://cattle-vision-ai-iota.vercel.app/

### Backend

Hosted on **Render**

https://cattlevision-backend.onrender.com

---

##  Contributors

### Ankit Nag

**Frontend Development & UI/UX**

* Frontend development
* UI/UX design
* Website interface
* Interactive user experience
* Frontend implementation

### Prince Agrawal

**Frontend & Dataset Management**

* Frontend development
* UI/UX contribution
* Website implementation
* Data cleaning
* Dataset management
* Dataset preparation
* Dataset organization and segmentation

### Nitin Sharma

**AI/ML, Backend, Frontend Optimization & System Integration**

* Research and problem-domain analysis
* Dataset research and collection
* Dataset cleaning and preparation
* Dataset organization and segmentation
* AI dataset pipeline development
* EfficientNet-B0 implementation
* Model training
* AI inference pipeline
* Backend API development
* Frontend-backend-AI integration
* Veterinary clinic locator pipeline development
* OpenStreetMap / Overpass API integration for live veterinary clinic discovery
* Dynamic veterinary search-radius expansion from **40 km → 60 km → 100 km**
* Haversine-based geographic distance calculation and location validation
* Rural-area veterinary fallback database implementation
* Verified veterinary hospital and clinic location integration for underserved areas
* Geographic safety validation to prevent irrelevant out-of-region veterinary results
* Removal of deprecated Foursquare API integration and related API dependencies
* Frontend prediction experience optimization
* Reduction of artificial prediction-processing delay from **2.2 seconds to 1.2 seconds**
* Loading-state and perceived-performance optimization
* Premium AI analysis experience and responsive result presentation
* Deployment
* Debugging and troubleshooting
* End-to-end system integration
---

## 🔮 Future Scope

The system can be further improved through:

* Support for additional Indian cattle breeds
* Expansion of the training dataset
* Improved model generalization
* Detailed breed information and characteristics
* Mobile and edge-device optimization
* Explainable AI for visual prediction reasoning
* Improved handling of low-quality and challenging images
* More comprehensive model evaluation
* Additional performance and reliability improvements

---

## ⚠️ Disclaimer

CattleVision AI is developed for **educational, research, and hackathon demonstration purposes**.

The predictions generated by the system should not be considered official cattle breed certification, veterinary advice, or a substitute for professional livestock identification.

---

## 📂 Project Links

### 🌐 Live Application

https://cattle-vision-ai-iota.vercel.app/

### 🔗 Backend API

https://cattlevision-backend.onrender.com

### 💻 GitHub Repository

https://github.com/nitin25J/CattleVision-AI

---

## 📌 Project Highlights

| Category             | Details                       |
| -------------------- | ----------------------------- |
| Application          | CattleVision AI               |
| Domain               | Computer Vision / Agriculture |
| Task                 | Cattle Breed Classification   |
| Supported Breeds     | 18                            |
| Training Images      | 3,327                         |
| Model                | EfficientNet-B0               |
| Framework            | PyTorch                       |
| Pretrained Model     | ImageNet                      |
| Test Accuracy        | **90%**                       |
| Backend              | FastAPI                       |
| Database             | SQLite                        |
| Frontend             | React                         |
| Frontend Deployment  | Vercel                        |
| Backend Deployment   | Render                        |
| Training Environment | Kaggle                        |

---

## 📖 About

**CattleVision AI** is an end-to-end AI-powered cattle breed identification system that combines computer vision, deep learning, and web technologies to classify images of 18 selected Indian cattle breeds.

The system uses a fine-tuned **PyTorch EfficientNet-B0 model**, achieving **90% test accuracy** on the evaluated dataset. It provides breed predictions, confidence scores, and top-3 predictions through a web interface backed by a FastAPI inference service.

The project demonstrates the complete workflow of an AI application—from dataset preparation and model training to backend integration, frontend development, and cloud deployment.
