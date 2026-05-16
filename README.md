# <p align="center">🌦️ Clima-Cast </p>
<p align="center">
  <strong>The Future of Climate Intelligence: Precision Weather Forecasting Powered by Explainable AI</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</p>

---

## 🌟 Overview

**Clima-Cast** is a premium climate intelligence platform that bridges the gap between raw meteorological data and actionable human insights. By combining high-resolution real-time weather APIs with advanced Machine Learning (XGBoost, Prophet, Random Forest), Clima-Cast provides the "why" behind the weather through **Explainable AI (SHAP)**.

Engineered for high performance, the platform delivers a **cinematic UX** featuring environment-aware atmospheric rendering, adaptive motion, and a unified climate timeline.

### 🎯 Why This Project Matters
In an era of climate volatility, traditional weather apps often fail to provide deep context. Clima-Cast solves this by:
- **Demystifying AI**: Using SHAP values to explain why a rain prediction was made.
- **Unified Timeline**: Merging historical climate data with future projections in a single visual flow.
- **Proactive Intelligence**: Classifying weather alerts using multi-class models rather than simple thresholding.

---

## 🏆 Portfolio Highlights

- **Cinematic UX**: High-fidelity environmental motion system with adaptive glassmorphism.
- **Ensemble Intelligence**: Integrated **5 distinct ML models** (Random Forest, XGBoost, Prophet).
- **Atmospheric Engine**: Environment-aware UI orchestration synchronized with real-time weather metadata.
- **Hybrid Intelligence**: Seamlessly combines real-time APIs, historical analytics, and AI forecasting.
- **Explainable AI (XAI)**: Native support for **SHAP** to provide transparent model reasoning.
- **Enterprise Architecture**: Decoupled React + FastAPI stack with centralized state management.
- **Interactive Analytics**: High-performance visualization dashboards powered by Recharts.
- **Performance Optimized**: Robust caching, lazy loading, and state memoization.

---

## 🚀 Key Features

### 🧠 Intelligence & Analytics
- **Cinematic Climate Timeline**: A unified journey through historical grounded patterns and ML projections.
- **AI Rain Prediction**: High-precision classification using Random Forest (84% accuracy).
- **Atmospheric Intelligence**: Real-time mapping of weather data to semantic UI tokens (mood, solar phase, intensity).
- **Climate Trend Analysis**: Long-term forecasting using Facebook's Prophet model.
- **Explainable AI (XAI)**: Integrated SHAP visualization for every prediction.

### ⚡ Performance & UX
- **Adaptive UI System**: Dynamic background transitions and environmental motion that respond to weather severity.
- **Contextual AI Microcopy**: Vernacular engine providing human-readable, weather-aware insights.
- **Real-time GPS Sync**: Automatic location detection with robust IP-based fallbacks.
- **Saved Cities System**: Persistence-backed favorites with centralized orchestration.
- **Smart Theming**: Advanced glassmorphism with seamless Dark/Light/Atmospheric transitions.
- **Accessibility Mode**: High-contrast, reduced-motion setting for distraction-free analysis.

### 🛠️ Production Engineering
- **Robust Persistence**: MySQL 8.0 storage with SQLAlchemy ORM.
- **Hybrid Caching**: Multi-layer caching strategy to minimize API costs and latency.
- **Fault Tolerance**: Automatic retry logic, 10s global timeouts, and React Error Boundaries.
- **Security First**: Full environment variable isolation and sanitized SQL interactions.

---

## 🏗️ System Architecture

Clima-Cast utilizes a modern decoupled architecture designed for high availability and low latency.

```mermaid
graph TD
    User((User)) <--> Frontend[React SPA / Vite]
    Frontend <--> API[FastAPI Gateway]
    API <--> Cache[(Weather Cache Layer)]
    API <--> DB[(MySQL 8.0)]
    API <--> ML[ML Inference Engine]
    ML --- Models[RF / XGBoost / Prophet]
    API <--> OpenWeather[[OpenWeather API]]
    
    subgraph "Machine Learning Pipeline"
    Data[Historical CSVs] --> Training[Scikit-Learn / XGBoost]
    Training --> Joblib[Serialized Models]
    Joblib --> Inference[SHAP Interpretability]
    end
```

---

## 📊 Machine Learning Excellence

The core of Clima-Cast is its ensemble of purpose-built models, trained on millions of historical data points.

### Model Performance Matrix
| Model Type | Target | Algorithm | Accuracy / MAE |
| :--- | :--- | :--- | :--- |
| **Classifier** | Rain Prediction | Random Forest | **~84% Accuracy** |
| **Regressor** | Temperature | XGBoost | **~2.43°C MAE** |
| **Regressor** | Humidity | Gradient Boosting | **~9.4% MAE** |
| **Multi-Class** | Weather Alerts | Random Forest | **~94% Accuracy** |
| **Time-Series** | Climate Trends | FB Prophet | **Proprietary Tuning** |

### 🔍 Explainable AI (SHAP)
Every AI prediction includes a **Feature Importance** breakdown. Users can see exactly which factors (e.g., pressure drops, humidity spikes, or wind shifts) contributed most to the current forecast, fostering trust and transparency.

---

## 💻 Tech Stack

| Component | Technology |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Recharts, Axios, Context API |
| **Backend** | FastAPI, SQLAlchemy, Uvicorn, Python 3.10+ |
| **Database** | MySQL 8.0 |
| **Data Science** | Pandas, Scikit-Learn, XGBoost, Prophet, SHAP, Joblib |
| **DevOps** | Git LFS, Vercel (FE), Railway (BE/DB) |

---

## 📁 Project Structure

```text
Clima-Cast/
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # UI Building Blocks (Cards, Charts, Layouts)
│   │   ├── context/        # Global State (Auth, Preferences, Weather)
│   │   ├── hooks/          # Custom Geolocation & API hooks
│   │   ├── pages/          # Dashboard, Analytics, Forecast
│   │   └── services/       # Axios API Client
├── backend/                # FastAPI Application
│   ├── app/
│   │   ├── database/       # ORM Config & Session Management
│   │   ├── ml/             # Training & Inference Logic
│   │   ├── models_saved/   # Joblib Model Blobs (via LFS)
│   │   ├── routes/         # API Endpoints (Weather, AI, Analytics)
│   │   ├── schemas/        # Pydantic Data Validation
│   │   └── utils/          # Alert Engine, SHAP Helpers
├── .gitattributes          # Git LFS Configuration
└── README.md
```

---

## 🛠️ Installation & Setup

### 1. Clone & Git LFS
This project uses **Git LFS** (Large File Storage) to track trained machine learning models. Standard `git clone` will only pull pointers; follow these steps to get the actual models:

```bash
# Clone the repository
git clone https://github.com/snehas-05/Clima-Cast.git
cd Clima-Cast

# Install Git LFS and pull large model files
git lfs install
git lfs pull
```
> [!NOTE]
> **Why Git LFS?** Our models exceed 100MB. LFS ensures the repository stays lightweight while providing access to high-performance pre-trained binaries.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

pip install -r requirements.txt

# Initialize environment variables
# Linux/Mac: cp .env.example .env
# Windows: copy .env.example .env

uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install

# Initialize environment variables
# Linux/Mac: cp .env.example .env
# Windows: copy .env.example .env

npm run dev
```

---

## 🧪 Dataset Management

Datasets are utilized for **model retraining** and are not included in the primary repository due to size constraints. 

To retrain models, place the following datasets in `backend/app/data/`:
- **Global Weather Repository**: For general climate patterns.
- **Rain in Australia Dataset**: Specialized training for precipitation classification.
- **Historical Climate Dataset**: Used for Prophet trend forecasting.

> [!TIP]
> The project runs perfectly using the **pre-trained models** provided via Git LFS. Manual dataset placement is only required if you intend to execute the training scripts.

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
```env
# Database Configuration
DATABASE_URL=mysql+pymysql://user:pass@localhost:3306/clima_cast

# External APIs
OPENWEATHER_API_KEY=your_key_here

# Security
SECRET_KEY=your_super_secret_jwt_key
ALGORITHM=HS256
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
```
> [!IMPORTANT]
> **Security Note**: OpenWeather API requests are securely proxied through the FastAPI backend. This prevents exposing sensitive API keys client-side.

---

## 🛠️ Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Model Load Error** | Ensure `git lfs pull` was executed and files exist in `models_saved/`. |
| **DB Connection Fail** | Verify MySQL service is running and `DATABASE_URL` matches your local config. |
| **CORS Errors** | Check that `BACKEND_CORS_ORIGINS` in `main.py` includes your frontend URL. |
| **Missing Packages** | Run `pip install -r requirements.txt` within your virtual environment. |

---

## 🛡️ Production Readiness & Security

- **Performance**: Implemented **Async Batching** for analytics and **Lazy Loading** for route-level code splitting.
- **Security**: All database inputs are sanitized via SQLAlchemy; no sensitive keys are committed to version control.
- **Accessibility**: 100% keyboard navigable with full ARIA support for dynamic charts.
- **UX Excellence**: Reduced Layout Shift (CLS) through fixed-aspect-ratio chart containers and skeleton states.

---

## ⚙️ Engineering Challenges Solved

### 📍 Orchestrated Synchronization
Engineered a centralized `WeatherContext` system to manage global location state and city orchestration, eliminating race conditions across decoupled components.

### 📈 Cinematic Timeline Merging
Developing a custom algorithm to merge **Historical Climate Data** with **AI-Predicted Forecasts** into a single, continuous visual flow required complex temporal normalization.

### 🛡️ Adaptive Environmental Rendering
Designed a parameter-driven styling system that dynamically calibrates UI depth, transparency, and motion intensity based on real-time meteorological severity.

### 🚄 Performance at Scale
Implemented a multi-layer **Caching Strategy** and **Lazy Loading** architecture to reduce initial bundle size and minimize redundant external API calls.

---

## 📈 Roadmap

- [ ] **Satellite Overlays**: Integration of real-time cloud and wind map layers.
- [ ] **WebSocket Integration**: Live "Storm Chaser" updates without polling.
- [ ] **AI Assistant**: Natural language weather queries (e.g., "Will it be too windy for a drone flight tomorrow?").
- [ ] **Edge Deployment**: Transitioning models to ONNX/TensorFlow.js for client-side inference.
- [ ] **PWA Support**: Offline-first capabilities and push notifications.

---

## 🤝 Contributing

We welcome contributions from the community!
1. **Fork** the repository.
2. Create your **Feature Branch** (`git checkout -b feature/AmazingFeature`).
3. **Commit** your changes (`git commit -m 'Add AmazingFeature'`).
4. **Push** to the branch (`git push origin feature/AmazingFeature`).
5. Open a **Pull Request**.

---

## 📜 License & Credits

Distributed under the **MIT License**. See `LICENSE` for more information.

### Acknowledgements
- [OpenWeather API](https://openweathermap.org/) for high-fidelity data.
- [Scikit-learn](https://scikit-learn.org/) & [XGBoost](https://xgboost.ai/) for the intelligence layer.
- [Recharts](https://recharts.org/) for stunning visualization.
- [FastAPI](https://fastapi.tiangolo.com/) for the lightning-fast backend.

---

<p align="center">
  <b>Maintainer: Sneha Singhania</b><br>
  <a href="https://github.com/snehas-05">GitHub</a> • 
  <a href="#">LinkedIn</a> • 
  <a href="#">Portfolio</a>
</p>

<p align="center">
  ⭐ <b>If you find this project impressive, please consider starring the repository!</b> ⭐
</p>
