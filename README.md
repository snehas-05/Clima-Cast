# Clima-Cast 🌦️

Clima-Cast is a machine learning–based weather prediction application built with Python.  
It provides an interactive interface for users to input weather-related parameters and get an estimated prediction based on a trained model and historical data.

---

## 🚀 Features

- 🔮 **Weather Prediction**  
  Uses a trained ML model (see `backend.py`) on historical weather data (`dataset.csv`) to generate predictions.

- 🧑‍💻 **User Management (CSV-based)**  
  Stores basic user details in `users.csv` / `user_database.csv` so that user information can be reused or extended later.

- 🎨 **Custom UI Styling**  
  Frontend uses `style.css` and a background image (`metofficegovuk_heroMedium.jfif`) to provide a clean and visually appealing interface.

- 📊 **Data-Driven**  
  Reads from `dataset.csv` to learn patterns from historical weather data.

---

## 🗂️ Project Structure

```text
Clima-Cast/
├── backend.py              # ML model training & prediction logic
├── frontend.py             # Application UI / main entry point
├── dataset.csv             # Historical weather dataset
├── users.csv               # User data (e.g. credentials or profile info)
├── user_database.csv       # Additional user info / logs (optional usage)
├── style.css               # Frontend styling
└── metofficegovuk_heroMedium.jfif   # Background image used in UI

```text


🧠 How It Works

1. Data Loading
backend.py reads dataset.csv and preprocesses the features required for prediction.

2. Model Training / Loading
The script builds and trains a machine learning model on the dataset (e.g., to predict temperature, rainfall, or another target variable).

3. Prediction
The frontend (frontend.py) collects user inputs (such as temperature, humidity, etc.) and sends them to the prediction function in backend.py.

4. User Data Handling
Basic user-related information may be stored in users.csv / user_database.csv for simple user management or future extension into a complete auth system.

🔧 Tech Stack
-Language: Python
-Data Handling: CSV-based dataset (dataset.csv)
-Styling: Custom CSS (style.css)
-ML / Data Science Libraries: Common Python ML stack (e.g. pandas, numpy, scikit-learn, etc.)
-UI: Python-based frontend (frontend.py)

🔎 If you add or remove libraries, remember to update this section and your requirements.txt.
