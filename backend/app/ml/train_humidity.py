import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib
import os

def train_humidity_model():
    print("Training Humidity Prediction Model...")
    if not os.path.exists('app/data/processed_global.csv'):
        print("Processed global data not found!")
        return None

    df = pd.read_csv('app/data/processed_global.csv')
    
    features = ['city_encoded', 'month', 'temperature_celsius', 'pressure_mb', 'wind_kph', 'precip_mm']
    target = 'humidity'
    
    X = df[features]
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = GradientBoostingRegressor(n_estimators=200, max_depth=5, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"Humidity Model MAE: {mae}")
    
    if not os.path.exists('app/models_saved'):
        os.makedirs('app/models_saved')
        
    joblib.dump(model, 'app/models_saved/humidity_model.joblib')
    print("Humidity model saved.")
    
    return {
        "mae": float(mae),
        "rows": len(df),
        "features": features
    }

if __name__ == "__main__":
    train_humidity_model()
