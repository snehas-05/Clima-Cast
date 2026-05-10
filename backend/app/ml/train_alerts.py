import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import os

def train_alerts_model():
    print("Training Weather Alerts Model...")
    if not os.path.exists('app/data/processed_global.csv'):
        print("Processed global data not found!")
        return None

    df = pd.read_csv('app/data/processed_global.csv')
    
    # Create target alert_type
    def categorize_alert(row):
        if row['temperature_celsius'] > 40: return 'heatwave'
        if row['wind_kph'] > 60: return 'storm'
        if row['temperature_celsius'] < 5: return 'coldwave'
        return 'normal'

    df['alert_type'] = df.apply(categorize_alert, axis=1)
    
    features = ['city_encoded', 'month', 'temperature_celsius', 'humidity', 'pressure_mb', 'wind_kph']
    target = 'alert_type'
    
    X = df[features]
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=150, random_state=42)
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Alerts Model Accuracy: {acc}")
    
    if not os.path.exists('app/models_saved'):
        os.makedirs('app/models_saved')
        
    joblib.dump(model, 'app/models_saved/alert_model.joblib')
    print("Alerts model saved.")
    
    return {
        "accuracy": float(acc),
        "rows": len(df),
        "features": features
    }

if __name__ == "__main__":
    train_alerts_model()
