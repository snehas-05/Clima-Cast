import shap
import numpy as np
import logging

logger = logging.getLogger(__name__)

# Cache for explainers
_explainers = {}

def get_shap_explanation(model, input_features, feature_names, model_type="regressor"):
    """
    Generates SHAP explanations for a given prediction.
    Ensures output is JSON serializable.
    """
    try:
        model_id = id(model)
        if model_id not in _explainers:
            logger.info(f"Creating SHAP TreeExplainer for model {model_id}")
            _explainers[model_id] = shap.TreeExplainer(model)
        
        explainer = _explainers[model_id]
        shap_values = explainer.shap_values(input_features)
        
        # Handle different output formats of shap_values
        # For classifiers, it might return a list of arrays (one per class)
        if isinstance(shap_values, list):
            # For binary classification, use the positive class (usually index 1)
            # For multi-class, we'll use the first one or logic based on prediction
            # Defaulting to index 1 for rain (binary) and index 0 for others for now
            if len(shap_values) > 1:
                vals = shap_values[1]
            else:
                vals = shap_values[0]
        else:
            vals = shap_values

        # Ensure vals is 1D (for a single prediction)
        if len(vals.shape) > 1:
            vals = vals[0]

        importances = list(zip(feature_names, vals))
        # Sort by absolute contribution
        importances.sort(key=lambda x: abs(x[1]), reverse=True)
        
        top3 = importances[:3]
        
        return [{"feature": f, "contribution": float(round(v, 3))} for f, v in top3]
    except Exception as e:
        logger.error(f"SHAP explanation failed: {e}")
        return []

def preload_explainer(model):
    """Warmup for SHAP explainer."""
    model_id = id(model)
    if model_id not in _explainers:
        try:
            _explainers[model_id] = shap.TreeExplainer(model)
            logger.info(f"Preloaded SHAP explainer for model {model_id}")
        except Exception as e:
            logger.error(f"Failed to preload SHAP explainer: {e}")
