import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
import joblib
import os

def train_rain_model():
    print("Training Rain Prediction Model...")
    if not os.path.exists('app/data/processed_rain.csv'):
        print("Processed rain data not found!")
        return None

    df = pd.read_csv('app/data/processed_rain.csv')
    
    features = ['Humidity9am', 'Humidity3pm', 'Pressure9am', 'Pressure3pm', 'Temp9am', 'MaxTemp', 'MinTemp', 'WindSpeed9am', 'WindSpeed3pm', 'RainToday']
    target = 'RainTomorrow'
    
    # Drop rows with NaN in features
    df = df.dropna(subset=features + [target])
    
    X = df[features]
    y = df[target]
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    model = RandomForestClassifier(n_estimators=200, random_state=42, class_weight='balanced')
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    report = classification_report(y_test, y_pred, output_dict=True)
    print("Rain Model Classification Report:")
    print(classification_report(y_test, y_pred))
    
    if not os.path.exists('app/models_saved'):
        os.makedirs('app/models_saved')
        
    joblib.dump(model, 'app/models_saved/rain_model.joblib')
    print("Rain model saved.")
    
    return {
        "accuracy": report['accuracy'],
        "precision": report['weighted avg']['precision'],
        "recall": report['weighted avg']['recall'],
        "f1-score": report['weighted avg']['f1-score'],
        "rows": len(df),
        "features": features
    }

if __name__ == "__main__":
    train_rain_model()
