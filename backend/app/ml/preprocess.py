import pandas as pd
import joblib
import os
from sklearn.preprocessing import LabelEncoder

def preprocess_data():
    print("Starting Preprocessing...")
    
    # 1. Global Weather Repository
    if os.path.exists('app/data/global_weather_repo.csv'):
        df = pd.read_csv('app/data/global_weather_repo.csv')
        df.dropna(subset=['temperature_celsius', 'humidity', 'location_name'], inplace=True)
        df['date'] = pd.to_datetime(df['last_updated'])
        df['month'] = df['date'].dt.month
        df['season'] = df['month'].apply(lambda m: 'Summer' if m in [3,4,5] else 'Monsoon' if m in [6,7,8,9] else 'Winter' if m in [10,11,12] else 'Spring')
        
        le = LabelEncoder()
        df['city_encoded'] = le.fit_transform(df['location_name'])
        
        if not os.path.exists('app/models_saved'):
            os.makedirs('app/models_saved')
            
        joblib.dump(le, 'app/models_saved/city_label_encoder.joblib')
        df.to_csv('app/data/processed_global.csv', index=False)
        print("Processed Global Weather Repository.")
    else:
        print("global_weather_repo.csv not found!")

    # 2. Rain in Australia
    if os.path.exists('app/data/rain_in_australia.csv'):
        df = pd.read_csv('app/data/rain_in_australia.csv')
        df.dropna(subset=['RainTomorrow'], inplace=True)
        df['RainTomorrow'] = df['RainTomorrow'].map({'Yes': 1, 'No': 0})
        df['RainToday'] = df['RainToday'].map({'Yes': 1, 'No': 0})
        
        # Fill missing values
        for col in ['Humidity9am','Humidity3pm','Pressure9am','Pressure3pm','Temp9am','MaxTemp','MinTemp', 'WindSpeed9am', 'WindSpeed3pm']:
            if col in df.columns:
                df[col] = df[col].fillna(df[col].median())
        
        df.to_csv('app/data/processed_rain.csv', index=False)
        print("Processed Rain in Australia.")
    else:
        print("rain_in_australia.csv not found!")

    # 3. Weather History
    if os.path.exists('app/data/weather_history.csv'):
        df = pd.read_csv('app/data/weather_history.csv')
        df['date'] = pd.to_datetime(df['Formatted Date'], utc=True)
        df = df[['date', 'Temperature (C)']].rename(columns={'date': 'ds', 'Temperature (C)': 'y'})
        # Remove timezone info for Prophet
        df['ds'] = df['ds'].dt.tz_localize(None)
        df.to_csv('app/data/processed_history.csv', index=False)
        print("Processed Weather History.")
    else:
        print("weather_history.csv not found!")

if __name__ == "__main__":
    preprocess_data()
