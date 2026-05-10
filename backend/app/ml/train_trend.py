import pandas as pd
from prophet import Prophet
import pickle
import os

def train_trend_model():
    print("Training Climate Trend Model...")
    if not os.path.exists('app/data/processed_history.csv'):
        print("Processed history data not found!")
        return None

    df = pd.read_csv('app/data/processed_history.csv')
    
    # Prophet requires ds and y columns
    model = Prophet(yearly_seasonality=True, weekly_seasonality=False)
    model.fit(df)
    
    if not os.path.exists('app/models_saved'):
        os.makedirs('app/models_saved')
        
    with open('app/models_saved/prophet_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    print("Climate trend model saved.")
    
    return {
        "rows": len(df),
        "features": ["ds"]
    }

if __name__ == "__main__":
    train_trend_model()
