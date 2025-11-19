import streamlit as st
import pandas as pd
import numpy as np
import base64
import hashlib
import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor
import io

# --- Set Background Image and Disable Sidebar Toggle ---
def set_background(image_file):
    # Check if file exists before trying to open
    if os.path.exists(image_file):
        with open(image_file, "rb") as f:
            encoded = base64.b64encode(f.read()).decode()
        st.markdown(f"""
            <style>
            .stApp {{
                background-image: url("data:image/jpg;base64,{encoded}");
                background-size: cover;
            }}
            </style>
        """, unsafe_allow_html=True)
    else:
        st.warning(f"Background image '{image_file}' not found.")

# Use a placeholder path if 'metofficegovuk_heroMedium.jfif' isn't guaranteed
# For this example, we'll assume it's in the same folder.
set_background("metofficegovuk_heroMedium.jfif")

# --- User Handling ---
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

user_file = "users.csv"
if not os.path.exists(user_file):
    pd.DataFrame(columns=["username", "password"]).to_csv(user_file, index=False)

def register_user(username, password):
    users = pd.read_csv(user_file)
    if username in users["username"].values:
        return False
    hashed_pw = hash_password(password)
    new_user = pd.DataFrame([{"username": username, "password": hashed_pw}])
    users = pd.concat([users, new_user], ignore_index=True)
    users.to_csv(user_file, index=False)
    return True

def login_user(username, password):
    users = pd.read_csv(user_file)
    hashed_pw = hash_password(password)
    user_data = users[users["username"] == username]
    if not user_data.empty and user_data.iloc[0]["password"] == hashed_pw:
        return True
    return False

# --- Data Loading and Model Training ---
@st.cache_data
def load_data():
    try:
        df = pd.read_csv("dataset.csv")
    except FileNotFoundError:
        st.error("Error: dataset.csv not found. Please make sure it's in the same folder as frontend.py.")
        return pd.DataFrame()

    # Handle missing values (fill forward)
    df.ffill(inplace=True)

    # --- KEY CHANGES START HERE ---

    # 1. Load the 'Date' column (from your new CSV)
    # Use errors='coerce' to handle any bad date formats
    df['datetime'] = pd.to_datetime(df['Date'], errors='coerce')
    
    # Drop rows where date conversion failed
    df.dropna(subset=['datetime'], inplace=True)

    # 2. Extract date features
    df['year'] = df['datetime'].dt.year
    df['month'] = df['datetime'].dt.month
    df['day'] = df['datetime'].dt.day
    df['dayofweek'] = df['datetime'].dt.dayofweek
    df['dayofyear'] = df['datetime'].dt.dayofyear

    # 3. Rename columns to match what the app expects
    df = df.rename(columns={
        'Maximum temperature (°F)': 'tempmax',
        'Minimum temperature (°F)': 'tempmin',
        'Average temperature (°F)': 'temp',
        'Maximum heat index (°F)': 'feelslike', # Using this as 'feelslike'
        'Average dewpoint (°F)': 'dew',
        'Average humidity (%)': 'humidity',
        'Maximum gust speed (mph)': 'windgust',
        'Average windspeed (mph)': 'windspeed',
        'Average direction (°deg)': 'winddir'
    })
    
    # --- KEY CHANGES END HERE ---
    
    # Check if all renamed columns exist
    expected_cols = ['tempmax', 'tempmin', 'temp', 'feelslike', 'dew', 'humidity', 'windgust', 'windspeed', 'winddir']
    missing_cols = [col for col in expected_cols if col not in df.columns]
    if missing_cols:
        st.error(f"Data is missing expected columns after renaming: {', '.join(missing_cols)}")
        st.stop()
        
    return df

@st.cache_resource
def train_model(_df, target_cols):
    # --- KEY CHANGE: Removed 'cloudcover' and 'visibility' ---
    # These features are not in your new dataset.
    features = ['year', 'month', 'day', 'dayofweek', 'dayofyear', 'winddir']
    
    X = _df[features]
    y = _df[target_cols]
    
    # Train a single model for all targets
    model = RandomForestRegressor(n_estimators=100, random_state=42, n_jobs=-1)
    model.fit(X, y)
    return model, features

# --- Load Custom CSS ---
def load_css(file_name):
    if os.path.exists(file_name):
        with open(file_name) as f:
            st.markdown(f'<style>{f.read()}</style>', unsafe_allow_html=True)
    else:
        st.warning(f"CSS file '{file_name}' not found.")
        
load_css("style.css")

# --- Main App ---
if "logged_in" not in st.session_state:
    st.session_state.logged_in = False
    st.session_state.username = ""

# Sidebar Navigation
st.sidebar.title("Navigation")
if st.session_state.logged_in:
    st.sidebar.success(f"Logged in as: {st.session_state.username}")
    menu = st.sidebar.radio("Go to", ["ClimaCast", "About ClimaCast"])
    if st.sidebar.button("Logout"):
        st.session_state.logged_in = False
        st.session_state.username = ""
        st.rerun()
else:
    menu = st.sidebar.radio("Go to", ["Login/Register", "About ClimaCast"])

# --- Page Content ---

if menu == "Login/Register":
    st.title("Login or Register")
    choice = st.selectbox("Choose action", ["Login", "Register"])

    with st.form(key=f"{choice}_form"):
        username = st.text_input("Username")
        password = st.text_input("Password", type="password")
        submit = st.form_submit_button(choice)

    if submit:
        if choice == "Register":
            if register_user(username, password):
                st.success("Registered successfully! Please login.")
            else:
                st.error("Username already exists.")
        elif choice == "Login":
            if login_user(username, password):
                st.session_state.logged_in = True
                st.session_state.username = username
                st.rerun()
            else:
                st.error("Invalid username or password.")

elif menu == "About ClimaCast":
    st.title("About ClimaCast")
    st.markdown("""
    ClimaCast is a smart weather prediction app built using machine learning and historical data.
    
    This system predicts key weather parameters like:
    * Temperature (max, min, average)
    * Humidity, Dew Point
    * Wind Speed & Gust
    
    It visualizes both predictions and historical trends to help users plan their activities effectively.
    """)
    
    # --- Footer only on About Page ---
    st.markdown("""
        <style>
            .footer {
                position: fixed;
                bottom: 0;
                right: 0;
                padding: 10px 20px;
                font-size: 14px;
                color: black;
                border-top-left-radius: 10px;
                background-color: rgba(255, 255, 255, 0.7);
            }
        </style>
        <div class="footer">
            Made by <b><span style='color:#ff69b4;'>Sneha</span></b>
        </div>
    """, unsafe_allow_html=True)


elif menu == "ClimaCast":
    if not st.session_state.logged_in:
        st.error("You must be logged in to use ClimaCast.")
        st.stop()
    
    st.title(f"ClimaCast Weather Prediction")

    # --- Load Data ---
    df = load_data()
    if df.empty:
        st.stop()
        
    min_date = df['datetime'].min().date()
    max_date = df['datetime'].max().date()

    # --- User Input ---
    st.subheader("🗓️ Choose Date for Prediction")
    st.markdown(f"Model trained on data from **{min_date}** to **{max_date}**.")
    
    # Predict for 2025 by default, as in the original code
    user_datetime = st.date_input("Enter date in 2025", 
                                  value=pd.to_datetime("2025-01-01"),
                                  min_value=pd.to_datetime("2025-01-01"),
                                  max_value=pd.to_datetime("2025-12-31"))
    
    user_datetime = pd.to_datetime(user_datetime)

    st.subheader("🎯 Select Weather Parameters to Predict")
    target_cols = st.multiselect(
        "Select one or more values:",
        options=['tempmax', 'tempmin', 'temp', 'feelslike', 'dew', 'humidity', 'windgust', 'windspeed', 'winddir'],
        default=['tempmax', 'tempmin', 'humidity', 'windspeed']
    )

    if st.button("Predict Weather", type="primary"):
        if not target_cols:
            st.error("Please select at least one weather parameter to predict.")
        else:
            # --- Train Model ---
            with st.spinner("Training model on historical data..."):
                model, features = train_model(df, target_cols)
            
            # --- Prepare Prediction Input ---
            prediction_input = pd.DataFrame([{
                'year': user_datetime.year,
                'month': user_datetime.month,
                'day': user_datetime.day,
                'dayofweek': user_datetime.dayofweek,
                'dayofyear': user_datetime.dayofyear,
                # We only need winddir from the historical average for that day
                'winddir': df[df['dayofyear'] == user_datetime.dayofyear]['winddir'].mean()
            }])
            
            # Ensure column order matches
            prediction_input = prediction_input[features]

            # --- Make Prediction ---
            predicted_values = model.predict(prediction_input)
            pred_dict = dict(zip(target_cols, predicted_values[0]))

            st.subheader(f"🌦️ Predicted Weather for {user_datetime.strftime('%d-%m-%Y')}")
            
            # --- Display Metrics ---
            cols = st.columns(len(pred_dict))
            for i, (key, value) in enumerate(pred_dict.items()):
                label = (key.replace('tempmax', 'Max Temp')
                            .replace('tempmin', 'Min Temp')
                            .replace('temp', 'Avg Temp')
                            .replace('feelslike', 'Feels Like')
                            .replace('humidity', 'Humidity')
                            .replace('windgust', 'Wind Gust')
                            .replace('windspeed', 'Wind Speed')
                            .replace('winddir', 'Wind Dir')
                            .replace('dew', 'Dew Point')
                            .title())
                
                with cols[i]:
                    st.metric(label=label, value=f"{value:.1f}")

            # --- Historical Plot ---
            st.subheader("📈 Historical Trend vs. Predicted (For Same Day of Year)")
            
            # Filter data for the same day of the year
            same_day_data = df[df['dayofyear'] == user_datetime.dayofyear].copy()
            
            if same_day_data.empty:
                st.warning("No historical data available for this specific day of the year.")
            else:
                # Melt data for plotting
                melted = same_day_data[['year'] + target_cols].melt(id_vars='year', var_name='Variable', value_name='Value')

                sns.set_theme(style="whitegrid")
                sns.set_palette("Set2")

                fig, ax = plt.subplots(figsize=(14, 6))
                sns.lineplot(data=melted, x='year', y='Value', hue='Variable', marker='o', linewidth=2.5, ax=ax)
                
                # Plot the 2025 predicted point
                for col in target_cols:
                    ax.scatter(user_datetime.year, pred_dict[col], s=200, marker='*', edgecolor='black', zorder=5, label=f"Predicted {col} (2025)")
                    ax.annotate(f"{pred_dict[col]:.1f}",
                                 (user_datetime.year, pred_dict[col]),
                                 textcoords="offset points", xytext=(0, 10), ha='center', fontsize=10, weight='bold')

                # Set plot aesthetics
                ax.set_title(f"Historical Trend for Day {user_datetime.dayofyear} (like {user_datetime.strftime('%B %d')})", fontsize=16)
                ax.set_xlabel("Year", fontsize=12)
                ax.set_ylabel("Value", fontsize=12)
                
                # Adjust x-axis to include 2025
                current_ticks = list(ax.get_xticks())
                if user_datetime.year not in current_ticks:
                    current_ticks.append(user_datetime.year)
                ax.set_xticks(sorted(list(set([int(t) for t in current_ticks] + [user_datetime.year]))))
                ax.set_xlim(left=min(current_ticks) - 1, right=user_datetime.year + 1)
                
                plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
                plt.tight_layout()
                st.pyplot(fig)