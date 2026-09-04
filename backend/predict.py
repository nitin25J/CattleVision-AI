import os
import io
import json
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image

MODEL_PATH = os.path.join(os.path.dirname(__file__), "model", "final_cow_breed_model.pth")
CLASS_NAMES_PATH = os.path.join(os.path.dirname(__file__), "class_names.json")

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = None
idx_to_class = {}

def load_class_names():
    global idx_to_class
    if os.path.exists(CLASS_NAMES_PATH):
        with open(CLASS_NAMES_PATH, "r") as f:
            data = json.load(f)
            idx_to_class = {int(k): v for k, v in data.items()}
    else:
        raise FileNotFoundError(f"class_names.json not found at {CLASS_NAMES_PATH}")

def load_model():
    global model, idx_to_class
    load_class_names()
    
    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found at {MODEL_PATH}")
        
    num_classes = len(idx_to_class)
    
    # Instantiate EfficientNet-B0
    model_arch = models.efficientnet_b0(weights=None)
    in_features = model_arch.classifier[1].in_features
    model_arch.classifier[1] = nn.Linear(in_features, num_classes)
    
    checkpoint = torch.load(MODEL_PATH, map_location=device)
    if isinstance(checkpoint, dict) and "model_state_dict" in checkpoint:
        model_arch.load_state_dict(checkpoint["model_state_dict"])
    else:
        model_arch.load_state_dict(checkpoint)
        
    model_arch.to(device)
    model_arch.eval()
    model = model_arch
    print(f"[Predict] Loaded PyTorch model on {device} with {num_classes} classes.")

# Image preprocessing pipeline
transform_pipeline = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def predict_breed_from_bytes(image_bytes: bytes):
    if model is None:
        load_model()

    try:
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        raise ValueError(f"Invalid image file: {str(e)}")

    tensor = transform_pipeline(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.nn.functional.softmax(outputs, dim=1)[0]
        top3_prob, top3_idx = torch.topk(probabilities, k=min(3, len(idx_to_class)))

    alternatives = []
    for prob, idx in zip(top3_prob, top3_idx):
        idx_int = idx.item()
        raw_breed_name = idx_to_class.get(idx_int, f"Breed_{idx_int}")
        display_breed = raw_breed_name.replace("_", " ")
        conf_pct = round(prob.item() * 100.0, 1)
        alternatives.append({
            "breed": display_breed,
            "species": "Cattle",
            "confidence": conf_pct
        })

    # Sort alternatives by confidence descending
    alternatives.sort(key=lambda x: x["confidence"], reverse=True)

    top = alternatives[0]
    return {
        "breed": top["breed"],
        "species": "Cattle",
        "confidence": top["confidence"],
        "alternatives": alternatives
    }
