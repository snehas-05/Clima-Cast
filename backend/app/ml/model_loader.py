import joblib
import pickle
import os
import json
import logging
import numpy as np
from app.ml.explainer import preload_explainer

logger = logging.getLogger(__name__)

# Global model cache
MODELS = {}

def load_models():
    """
    Loads all trained models and encoders into memory.
    Performs warmup and validation.
    """
    model_paths = {
        "rain": "app/models_saved/rain_model.joblib",
        "temp": "app/models_saved/temp_model.joblib",
        "humidity": "app/models_saved/humidity_model.joblib",
        "alerts": "app/models_saved/alert_model.joblib",
        "prophet": "app/models_saved/prophet_model.pkl",
        "encoder": "app/models_saved/city_label_encoder.joblib"
    }
    
    missing_models = []
    for name, path in model_paths.items():
        if not os.path.exists(path):
            missing_models.append(name)
            continue
            
        try:
            if path.endswith('.joblib'):
                MODELS[name] = joblib.load(path)
            elif path.endswith('.pkl'):
                with open(path, 'rb') as f:
                    MODELS[name] = pickle.load(f)
            logger.info(f"Loaded {name} model from {path}")
        except Exception as e:
            logger.error(f"Failed to load {name} model: {e}")

    if missing_models:
        logger.warning(f"WARNING: Models not trained yet: {', '.join(missing_models)}. Run 'python -m app.ml.train_all'")
    else:
        # Warmup and preload SHAP
        warmup_models()
        logger.info("ML Models preloaded and warmed up.")

def warmup_models():
    """Run dummy predictions to reduce first-request latency."""
    try:
        if "rain" in MODELS:
            dummy_input = np.zeros((1, 10))
            MODELS["rain"].predict(dummy_input)
            preload_explainer(MODELS["rain"])
            
        if "temp" in MODELS:
            dummy_input = np.zeros((1, 7))
            MODELS["temp"].predict(dummy_input)
            preload_explainer(MODELS["temp"])
            
        if "alerts" in MODELS:
            dummy_input = np.zeros((1, 6))
            MODELS["alerts"].predict(dummy_input)
            preload_explainer(MODELS["alerts"])
            
        if "humidity" in MODELS:
            dummy_input = np.zeros((1, 6))
            MODELS["humidity"].predict(dummy_input)
            # Preload if needed
    except Exception as e:
        logger.error(f"Model warmup failed: {e}")

def get_models():
    return MODELS

def get_model_metrics():
    path = 'app/models_saved/model_metrics.json'
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return {}
