from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from app.services.weather_service import WeatherService
from app.utils.city_checker import get_supported_cities
import random

from app.models.preferences import UnitType

class SearchService:
    @staticmethod
    async def perform_search(db: Session, query: str, city: Optional[str] = "Ludhiana", user: Optional[Any] = None) -> Dict[str, Any]:
        query_lower = query.lower()
        
        unit_label = "°C"
        if user and user.preferences and user.preferences.unit == UnitType.FAHRENHEIT:
            unit_label = "°F"

        
        # Default response
        response = {
            "query": query,
            "answer": f"I couldn't find specific information for '{query}'. Try asking about temperature, humidity, or specific cities.",
            "data": None,
            "related_questions": [
                "What is the temperature today?",
                "Will it rain tomorrow?",
                "Show me the 5-day forecast",
                "Air quality index in Ludhiana"
            ],
            "success": True
        }

        # 1. Check for city searches
        supported_cities = get_supported_cities()
        found_city = None
        for sc in supported_cities:
            if sc.lower() in query_lower:
                found_city = sc
                break
        
        target_city = found_city or city

        # 2. Fetch data if needed
        weather_data = await WeatherService.get_current_weather(db, target_city, user)
        forecast_data = await WeatherService.get_forecast(db, target_city, user)

        if not weather_data.get("success"):
            return response

        current = weather_data["data"]
        forecast = forecast_data.get("data", {})
        today = forecast.get("today", {})
        
        # 3. Intent matching
        if "min" in query_lower and "max" in query_lower:
            min_temp = today.get("low", "N/A")
            max_temp = today.get("high", "N/A")
            response["answer"] = f"Today in {target_city}, the minimum temperature is {min_temp}{unit_label} and the maximum is {max_temp}{unit_label}."
            response["related_questions"] = [
                "Is it going to rain today?",
                "What's the humidity like?",
                "5-day forecast"
            ]
        elif "min" in query_lower and ("temp" in query_lower or "temperature" in query_lower):
            min_temp = today.get("low", current.get("temperature", "N/A"))
            response["answer"] = f"The minimum temperature in {target_city} today is {min_temp}{unit_label}."
            response["related_questions"] = [
                f"What is the maximum temperature in {target_city}?",
                f"Humidity level in {target_city}",
                "Weather forecast for tomorrow"
            ]
        elif "max" in query_lower and ("temp" in query_lower or "temperature" in query_lower):
            max_temp = today.get("high", current.get("temperature", "N/A"))
            response["answer"] = f"The maximum temperature in {target_city} today is {max_temp}{unit_label}."
            response["related_questions"] = [
                f"What is the minimum temperature in {target_city}?",
                f"Is it windy in {target_city}?",
                "Air quality index"
            ]

        elif "humidity" in query_lower:
            humidity = current.get("humidity", "N/A")
            response["answer"] = f"The humidity in {target_city} is currently {humidity}%."
            response["related_questions"] = [
                f"Temperature in {target_city}",
                "Chance of rain today",
                "Wind speed"
            ]
        elif "wind" in query_lower or "speed" in query_lower:
            wind_speed = current.get("wind_kph", "N/A")
            wind_dir = current.get("wind_dir", "N/A")
            response["answer"] = f"Wind speed in {target_city} is {wind_speed} km/h coming from the {wind_dir}."
            response["related_questions"] = [
                "Is it going to rain?",
                f"Humidity in {target_city}",
                "Maximum temperature today"
            ]
        elif "aqi" in query_lower or "air quality" in query_lower:
            # We would need to fetch AQI here if not in current
            aqi_res = await WeatherService.get_air_quality(db, target_city)
            if aqi_res.get("success"):
                aqi = aqi_res["data"]["aqi"]
                response["answer"] = f"The Air Quality Index (AQI) in {target_city} is {aqi}, which is considered { 'Good' if aqi <= 50 else 'Moderate' if aqi <= 100 else 'Unhealthy' }."
            else:
                response["answer"] = f"I couldn't fetch the AQI for {target_city} right now."
            response["related_questions"] = [
                "Pollutant details",
                f"Weather in {target_city}",
                "Is it safe for a run?"
            ]
        elif found_city or "weather" in query_lower or "today" in query_lower:
            response["answer"] = f"Currently in {target_city}: {current['temperature']}{unit_label} with {current['condition']}."
            response["data"] = current
            response["related_questions"] = [
                f"5-day forecast for {target_city}",
                f"Air quality in {target_city}",
                f"Is it going to rain in {target_city}?"
            ]

        
        # Add some AI-like flavor
        if "answer" in response and response["answer"] != f"I couldn't find specific information for '{query}'. Try asking about temperature, humidity, or specific cities.":
            response["source"] = "Clima-Cast AI Engine"
        
        return response

    @staticmethod
    async def search_cities(query: str) -> Dict[str, Any]:
        from app.utils.openweather import openweather_api
        try:
            results = await openweather_api.search_cities(query)
            if not results:
                return {"success": True, "results": []}
            
            formatted_results = []
            for r in results:
                formatted_results.append({
                    "name": r.get("name"),
                    "state": r.get("state"),
                    "country": r.get("country"),
                    "lat": r.get("lat"),
                    "lon": r.get("lon")
                })
            
            return {"success": True, "results": formatted_results}
        except Exception as e:
            return {"success": False, "message": str(e)}
