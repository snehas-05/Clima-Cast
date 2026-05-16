import logging
import asyncio
from datetime import datetime
from typing import List, Dict, Any, Optional

from app.utils.alert_engine import AlertEngine
from app.utils.historical_context import get_historical_context, get_seasonal_grounding
from app.ml.model_loader import get_models

logger = logging.getLogger("uvicorn.error")

MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

class InsightEngine:
    @staticmethod
    async def get_summary(city: str, weather_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Orchestrates all intelligence sources to generate a concise climate summary.
        """
        try:
            # 1. Fetch data in parallel
            alerts_task = AlertEngine.get_active_alerts(city, weather_data)
            
            # 2. Get Seasonal Grounding
            month = datetime.now().month
            grounding = get_seasonal_grounding(city, month)
            
            alerts = await alerts_task
            
            # 3. Calculate Risk Score (0-100)
            risk_score = InsightEngine._calculate_risk_score(alerts, weather_data)
            
            # 4. Process Anomalies and Insights
            processed_insights = []
            
            # Prioritize Alerts first
            for alert in alerts[:2]:
                processed_insights.append({
                    "id": f"alert_{alert['type']}",
                    "title": alert["label"],
                    "severity": alert["severity"],
                    "confidence": InsightEngine._refine_confidence(alert, weather_data),
                    "explanation": alert["explanation"],
                    "factors": InsightEngine._parse_drivers(alert.get("explanation", "")),
                    "historical_context": alert.get("historical_context", ""),
                    "recommendation": InsightEngine._get_recommendation(alert["type"], alert["severity"], weather_data),
                    "trend": "worsening" if alert["severity"] in ["high", "extreme"] else "stable",
                    "is_alert": True
                })

            # 5. Add Anomaly Insight if space allows
            if len(processed_insights) < 3:
                anomaly = InsightEngine._detect_anomalies(city, weather_data, grounding)
                if anomaly:
                    processed_insights.append(anomaly)

            # 6. Add General/Ideal Condition if empty
            if not processed_insights:
                processed_insights.append({
                    "id": "status_ideal",
                    "title": "Stable Conditions",
                    "severity": "low",
                    "confidence": 1.0,
                    "explanation": "Atmospheric conditions are currently within the normal range for this period.",
                    "factors": ["Stable Pressure", "Normal Humidity"],
                    "historical_context": f"Weather aligns with typical {MONTH_NAMES[month-1]} baselines for {city}.",
                    "recommendation": InsightEngine._get_recommendation("ideal", "low", weather_data),
                    "trend": "stable",
                    "is_alert": False
                })

            return {
                "city": city,
                "risk_score": risk_score,
                "overall_trend": InsightEngine._determine_global_trend(processed_insights, weather_data),
                "insights": processed_insights[:4]
            }
            
        except Exception as e:
            logger.error(f"InsightEngine Failure: {e}")
            return {"city": city, "risk_score": 0, "overall_trend": "stable", "insights": []}

    @staticmethod
    def _calculate_risk_score(alerts: List[Dict[str, Any]], weather: Dict[str, Any]) -> int:
        score = 15 # Base baseline
        for a in alerts:
            weight = {"low": 10, "medium": 20, "high": 35, "extreme": 55}
            score += weight.get(a["severity"], 10)
        
        # Add slight boost for extreme weather even if no alert
        temp = weather.get("temperature", 0)
        if temp > 38 or temp < 2: score += 10
            
        return min(max(score, 0), 100)

    @staticmethod
    def _refine_confidence(alert: Dict[str, Any], weather: Dict[str, Any]) -> float:
        """
        Makes confidence scores more dynamic for threshold alerts.
        """
        if not alert.get("threshold_triggered"):
            return float(alert.get("probability", 0.9))
            
        # For threshold alerts, confidence increases as we get further from the threshold
        temp = weather.get("temperature", 0)
        if alert["type"] == "heatwave":
            dist = max(0, temp - 40)
            return min(0.99, 0.85 + (dist * 0.02))
        elif alert["type"] == "coldwave":
            dist = max(0, 5 - temp)
            return min(0.99, 0.85 + (dist * 0.02))
            
        return 0.9

    @staticmethod
    def _detect_anomalies(city: str, weather: Dict[str, Any], grounding: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not grounding: return None
        
        month_name = MONTH_NAMES[datetime.now().month - 1]
        temp = weather.get("temperature", 0)
        hum = weather.get("humidity", 0)
        
        # 1. Temperature Anomaly
        temp_diff = temp - grounding["avg_temp"]
        if abs(temp_diff) > 7:
            status = "Hotter" if temp_diff > 0 else "Cooler"
            return {
                "id": "anomaly_temp",
                "title": "Temperature Shift",
                "severity": "medium",
                "confidence": 0.88,
                "explanation": f"{status} than typical for {city} in {month_name}.",
                "factors": ["Regional Baseline", "Solar Loading"],
                "historical_context": f"Current temp is {abs(int(temp_diff))}°C away from the seasonal mean ({int(grounding['avg_temp'])}°C).",
                "recommendation": "Adjust energy usage for indoor cooling/heating.",
                "trend": "stable",
                "is_alert": False
            }
            
        # 2. Humidity Anomaly
        hum_diff = hum - grounding["avg_hum"]
        if abs(hum_diff) > 25:
            status = "Higher" if hum_diff > 0 else "Lower"
            return {
                "id": "anomaly_humidity",
                "title": "Humidity Deviation",
                "severity": "low",
                "confidence": 0.82,
                "explanation": f"Humidity is unusually {status.lower()} compared to {month_name} averages.",
                "factors": ["Moisture Flux", "Regional Flow"],
                "historical_context": f"Seasonal average for {city} is {int(grounding['avg_hum'])}%. Current: {hum}%.",
                "recommendation": "Monitor indoor air quality and comfort levels.",
                "trend": "stable",
                "is_alert": False
            }
            
        return None

    @staticmethod
    def _get_recommendation(alert_type: str, severity: str, weather: Dict[str, Any]) -> str:
        pool = {
            "heatwave": {
                "extreme": "Immediate danger. Stay in climate-controlled environments and hydrate.",
                "high": "Limit outdoor activity between 10AM - 4PM. Seek shade.",
                "medium": "Stay hydrated and monitor vulnerable family members.",
                "low": "Drink plenty of water and wear light clothing."
            },
            "storm": {
                "extreme": "Emergency conditions. Secure all loose items and stay indoors.",
                "high": "Avoid travel and stay away from windows during peak gusts.",
                "medium": "Secure outdoor furniture and monitor local news.",
                "low": "Be aware of potential minor power fluctuations."
            },
            "coldwave": {
                "high": "Risk of frostbite. Use multiple layers and limit exposure.",
                "medium": "Ensure heating systems are functioning properly.",
                "low": "Wear extra layers and keep pets indoors."
            },
            "ideal": {
                "low": "Perfect for outdoor exercise or social gatherings." if weather.get("temperature", 0) > 15 else "Pleasant conditions for a brisk walk or outdoor activity."
            }
        }
        
        type_pool = pool.get(alert_type, {"low": "Monitor local conditions for changes."})
        return type_pool.get(severity, type_pool.get("low", "Stay informed."))

    @staticmethod
    def _determine_global_trend(insights: List[Dict[str, Any]], weather: Dict[str, Any]) -> str:
        # 1. Check if any active risks are worsening
        if any(i["trend"] == "worsening" for i in insights):
            return "worsening"
            
        # 2. Check pressure trend if available
        # If pressure is falling significantly, trend is worsening
        # (This is a simplified atmospheric rule)
        pressure = weather.get("pressure_mb", 1013)
        if pressure < 1005: return "worsening"
        
        return "stable"

    @staticmethod
    def _parse_drivers(explanation: str) -> List[str]:
        if "Top drivers:" in explanation:
            drivers = explanation.replace("Top drivers: ", "").split(", ")
            return [d.split(" (")[0] for d in drivers][:2]
        return ["Atmospheric Data", "Regional Baseline"]
