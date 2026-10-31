import os

# Limit CPU threads before importing any numeric/deep learning libraries.
# Render free tier provides limited CPU and 512MB RAM on large shared multi-core host nodes.
# Restricting to 1 thread prevents PyTorch and OpenMP from allocating dozens of thread-local memory caches.
os.environ["OMP_NUM_THREADS"] = "1"
os.environ["MKL_NUM_THREADS"] = "1"
os.environ["OPENBLAS_NUM_THREADS"] = "1"
os.environ["VECLIB_MAXIMUM_THREADS"] = "1"
os.environ["NUMEXPR_NUM_THREADS"] = "1"

import io
import gc
import json
import torch
import torch.nn as nn
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image

# Enforce single-threaded execution in PyTorch
torch.set_num_threads(1)
try:
    torch.set_num_interop_threads(1)
except (RuntimeError, AttributeError):
    pass

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

    # Freeze all parameters to eliminate autograd graph overhead and reduce memory retention
    for param in model_arch.parameters():
        param.requires_grad = False

    # Minimal warmup with inference_mode
    try:
        dummy = torch.zeros((1, 3, 224, 224), dtype=torch.float32, device=device)
        with torch.inference_mode():
            _ = model_arch(dummy)
        del dummy
    except Exception as e:
        print(f"[Predict] Warmup warning: {e}")

    model = model_arch
    gc.collect()
    print(f"[Predict] Loaded and warmed up PyTorch model on {device} with {num_classes} classes (memory-optimized).")

# Image preprocessing pipeline
transform_pipeline = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def predict_breed_from_bytes(image_bytes: bytes):
    global model
    if model is None:
        load_model()

    try:
        with Image.open(io.BytesIO(image_bytes)) as raw_img:
            # Pre-downscale high-res images to avoid allocating 40MB+ uncompressed bitmaps in RAM
            # EfficientNet-B0 only needs 224x224, so max 448x448 retains all necessary features while saving RAM
            raw_img.thumbnail((448, 448))
            image = raw_img.convert("RGB")
    except Exception as e:
        raise ValueError(f"Invalid image file: {str(e)}")

    try:
        tensor = transform_pipeline(image).unsqueeze(0).to(device)
        # Release PIL image memory immediately
        del image

        with torch.inference_mode():
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

        # Explicitly delete intermediate tensors and force garbage collection to keep RSS minimal
        del tensor, outputs, probabilities, top3_prob, top3_idx
        gc.collect()

        # Sort alternatives by confidence descending
        alternatives.sort(key=lambda x: x["confidence"], reverse=True)

        top = alternatives[0]
        return {
            "breed": top["breed"],
            "species": "Cattle",
            "confidence": top["confidence"],
            "alternatives": alternatives
        }
    except Exception as e:
        gc.collect()
        raise e
