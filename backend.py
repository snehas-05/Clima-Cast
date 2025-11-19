import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Load the dataset
try:
    # This code expects the 'dataset.csv' with columns:
    # datetime, tempmax, tempmin, temp, feelslike, dew, humidity,
    # windgust, windspeed, winddir, cloudcover, visibility, conditions...
    df = pd.read_csv('dataset.csv')
except FileNotFoundError:
    print("Error: dataset.csv not found. Please ensure the file is in the same directory.")
    exit()

# --- Data Preprocessing ---
# Convert 'datetime' to datetime objects
df['datetime'] = pd.to_datetime(df['datetime'], format='%d-%m-%Y')

# Extract numerical features from datetime
df['year'] = df['datetime'].dt.year
df['month'] = df['datetime'].dt.month
df['day'] = df['datetime'].dt.day
df['dayofweek'] = df['datetime'].dt.dayofweek
df['dayofyear'] = df['datetime'].dt.dayofyear

# Drop original datetime column as we've extracted features
df = df.drop('datetime', axis=1)

# Drop non-numerical columns that are not targets or features for this model
df = df.drop(['conditions', 'description', 'icon'], axis=1)

# Handle missing values (if any) - fill with mean for numerical columns
for col in df.columns:
    if df[col].dtype in ['float64', 'int64']:
        df[col] = df[col].fillna(df[col].mean())

# === KEY CHANGE 1: Define features (X) and target variables (y) ===
# The only features we know for a future date are the date components.
features = ['year', 'month', 'day', 'dayofweek', 'dayofyear']

# The targets are ALL the weather conditions we want to predict.
target_numerical_weather = ['tempmax', 'tempmin', 'temp', 'feelslike',
                            'dew', 'humidity', 'windgust', 'windspeed',
                            'winddir', 'cloudcover', 'visibility'] # <-- winddir, cloudcover, visibility are now TARGETS

# Separate data for training (2023 and 2024)
data_for_training = df[df['year'].isin([2023, 2024])].copy()  # Use .copy() to avoid SettingWithCopyWarning

X = data_for_training[features]
y = data_for_training[target_numerical_weather]

# --- User Input for Prediction ---
def get_user_date():
    while True:
        date_str = input("Enter a date for weather prediction (DD-MM-YYYY, e.g., 15-06-2025): ")
        try:
            user_date = pd.to_datetime(date_str, format='%d-%m-%Y')
            # Ensure the prediction year is 2025
            if user_date.year != 2025:
                print("Please enter a date in the year 2025 for prediction.")
            else:
                return user_date
        except ValueError:
            print("Invalid date format. Please use DD-MM-YYYY.")

user_prediction_date = get_user_date()

# --- Train-Test Split ---
# Split 10% of the data for testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.1, random_state=42)

print(f"Training data size: {len(X_train)} samples")
print(f"Testing data size: {len(X_test)} samples")

# --- Model Training ---
# Train a Random Forest Regressor for all numerical weather predictions
weather_model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)  # n_jobs=-1 uses all cores
weather_model.fit(X_train, y_train)

print("Weather prediction model trained successfully!")

# --- Model Evaluation on Test Data ---
y_pred_test = weather_model.predict(X_test)

print("\n--- Model Evaluation (on Test Data) ---")
# Evaluate each target variable
for i, target in enumerate(target_numerical_weather):
    # Check if y_test is a DataFrame (it should be)
    if isinstance(y_test, pd.DataFrame):
        y_test_target = y_test.iloc[:, i]
    else:
        y_test_target = y_test[:, i]

    mae = mean_absolute_error(y_test_target, y_pred_test[:, i])
    rmse = np.sqrt(mean_squared_error(y_test_target, y_pred_test[:, i]))
    r2 = r2_score(y_test_target, y_pred_test[:, i])
    print(f"  {target}:")
    print(f"    MAE: {mae:.2f}")
    print(f"    RMSE: {rmse:.2f}")
    print(f"    R-squared: {r2:.2f}")

# === KEY CHANGE 2: Prepare input for prediction ===
# We only need the date components, no .mean() values
prediction_data_input = pd.DataFrame([{
    'year': user_prediction_date.year,
    'month': user_prediction_date.month,
    'day': user_prediction_date.day,
    'dayofweek': user_prediction_date.dayofweek,
    'dayofyear': user_prediction_date.dayofyear
}])

# Ensure the order of columns matches training data
prediction_data_input = prediction_data_input[features]

# Make predictions
predicted_values_for_user_date = weather_model.predict(prediction_data_input)

# Format predictions
predicted_dict = dict(zip(target_numerical_weather, predicted_values_for_user_date[0]))

print(f"\n--- Predicted Weather for {user_prediction_date.strftime('%d-%m-%Y')} ---")
# === KEY CHANGE 3: Update print loop for new targets ===
for key, value in predicted_dict.items():
    display_name = (key.replace('tempmax', 'Max Temperature')
                       .replace('tempmin', 'Min Temperature')
                       .replace('temp', 'Average Temperature')
                       .replace('feelslike', 'Feels Like Temperature')
                       .replace('dew', 'Dew Point')
                       .replace('humidity', 'Humidity')
                       .replace('windgust', 'Wind Gust')
                       .replace('windspeed', 'Wind Speed')
                       .replace('winddir', 'Wind Direction')
                       .replace('cloudcover', 'Cloud Cover')
                       .replace('visibility', 'Visibility'))
    
    # Add units for clarity
    unit = ""
    if "Temperature" in display_name or "Dew Point" in display_name:
        unit = "°C" # Assuming Celsius, change if needed
    elif "Humidity" in display_name or "Cloud Cover" in display_name:
        unit = "%"
    elif "Speed" in display_name or "Gust" in display_name:
        unit = "km/h" # Assuming km/h
    elif "Direction" in display_name:
        unit = "°"
    elif "Visibility" in display_name:
        unit = "km" # Assuming km
    
    print(f"{display_name.title()}: {value:.2f} {unit}")