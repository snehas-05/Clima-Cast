import os
import json
from datetime import datetime
from app.ml.preprocess import preprocess_data
from app.ml.train_rain import train_rain_model
from app.ml.train_temp import train_temp_model
from app.ml.train_trend import train_trend_model
from app.ml.train_humidity import train_humidity_model
from app.ml.train_alerts import train_alerts_model

def run_all():
    print(f"=== CLIMA-CAST ML TRAINING PIPELINE [{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] ===")
    
    # 1. Preprocess
    preprocess_data()
    
    # 2. Train Models
    rain_metrics = train_rain_model()
    temp_metrics = train_temp_model()
    trend_metrics = train_trend_model()
    humidity_metrics = train_humidity_model()
    alert_metrics = train_alerts_model()
    
    # 3. Save Metadata
    metadata = {
        "rain_model_version": "v1",
        "temp_model_version": "v1",
        "trend_model_version": "v1",
        "humidity_model_version": "v1",
        "alert_model_version": "v1",
        "trained_at": datetime.now().isoformat(),
        "datasets": {
            "global": "processed_global.csv",
            "rain": "processed_rain.csv",
            "history": "processed_history.csv"
        }
    }
    
    with open('app/models_saved/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=4)
        
    # 4. Save Metrics
    metrics = {
        "rain": {
            "accuracy": rain_metrics["accuracy"] if rain_metrics else 0,
            "precision": rain_metrics["precision"] if rain_metrics else 0,
            "recall": rain_metrics["recall"] if rain_metrics else 0,
            "f1": rain_metrics["f1-score"] if rain_metrics else 0
        },
        "temperature": {
            "mae": temp_metrics["mae"] if temp_metrics else 0
        },
        "humidity": {
            "mae": humidity_metrics["mae"] if humidity_metrics else 0
        },
        "alerts": {
            "accuracy": alert_metrics["accuracy"] if alert_metrics else 0
        },
        "trained_at": metadata["trained_at"]
    }
    
    with open('app/models_saved/model_metrics.json', 'w') as f:
        json.dump(metrics, f, indent=4)
        
    print("\n=== TRAINING COMPLETE ===")
    print(f"Metrics saved to app/models_saved/model_metrics.json")

if __name__ == "__main__":
    run_all()
