import logging
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.models.cache import WeatherCache, is_cache_expired
from app.models.user import User
from app.models.preferences import UnitType
from app.models.history import SearchHistory
from app.utils.openweather import openweather_api
from app.utils.city_checker import is_city_in_model
from app.utils.weather_icons import get_weather_theme

logger = logging.getLogger("uvicorn.error")

class WeatherService:
    @staticmethod
    async def get_current_weather(db: Session, city: str, user: Optional[User] = None) -> Dict[str, Any]:
        # 1. Check Cache
        cached = db.query(WeatherCache).filter(WeatherCache.city == city).first()
        use_cache = False
        stale_cache = False

        if cached and not is_cache_expired(cached.updated_at):
            use_cache = True
            logger.info(f"Using valid cache for city: {city}")
        
        # 2. Call API if cache invalid or missing
        api_data = None
        if not use_cache:
            try:
                api_data = await openweather_api.get_current_weather(city)
                if api_data:
                    # Update cache
                    if cached:
                        cached.api_data = api_data
                        cached.updated_at = datetime.now()
                    else:
                        new_cache = WeatherCache(city=city, api_data=api_data)
                        db.add(new_cache)
                    db.commit()
                else:
                    if cached:
                        stale_cache = True
                        api_data = cached.api_data
                        logger.warning(f"API failed, using stale cache for city: {city}")
            except Exception as e:
                if cached:
                    stale_cache = True
                    api_data = cached.api_data
                    logger.warning(f"API error, using stale cache for city: {city}")
                else:
                    logger.error(f"Error fetching current weather: {e}")
                    return {"success": False, "message": f"Could not fetch weather for {city}", "error": str(e)}

        if not api_data and cached:
            api_data = cached.api_data
            stale_cache = True
        
        if not api_data:
            return {"success": False, "message": f"Could not fetch weather for {city}", "error": "API Failure"}

        # 3. Format Response
        weather_data = WeatherService._format_current_weather(api_data, user)
        weather_data["ml_available"] = is_city_in_model(city)
        
        # 4. Update Search History if user is authenticated
        if user:
            WeatherService._update_search_history(db, user.id, city)

        return {
            "success": True,
            "message": "Weather fetched successfully",
            "data": weather_data,
            "stale_cache": stale_cache
        }

    @staticmethod
    async def get_forecast(db: Session, city: str, user: Optional[User] = None) -> Dict[str, Any]:
        # 1. Check Cache
        cached = db.query(WeatherCache).filter(WeatherCache.city == city).first()
        use_cache = False
        stale_cache = False

        if cached and cached.forecast_data and not is_cache_expired(cached.updated_at):
            use_cache = True
            logger.info(f"Using valid forecast cache for city: {city}")
        
        # 2. Call API if cache invalid or missing
        api_data = None
        if not use_cache:
            try:
                api_data = await openweather_api.get_forecast(city)
                if api_data:
                    # Update cache
                    if cached:
                        cached.forecast_data = api_data
                        cached.updated_at = datetime.now()
                    else:
                        new_cache = WeatherCache(city=city, forecast_data=api_data)
                        db.add(new_cache)
                    db.commit()
                else:
                    if cached and cached.forecast_data:
                        stale_cache = True
                        api_data = cached.forecast_data
                        logger.warning(f"Forecast API failed, using stale cache for city: {city}")
            except Exception as e:
                if cached and cached.forecast_data:
                    stale_cache = True
                    api_data = cached.forecast_data
                    logger.warning(f"Forecast API error, using stale cache for city: {city}")
                else:
                    logger.error(f"Error fetching forecast: {e}")
                    return {"success": False, "message": f"Could not fetch forecast for {city}", "error": str(e)}

        if not api_data and cached and cached.forecast_data:
            api_data = cached.forecast_data
            stale_cache = True
        
        if not api_data:
            return {"success": False, "message": f"Could not fetch forecast for {city}", "error": "API Failure"}

        # 3. Format Response
        forecast_data = WeatherService._aggregate_forecast(api_data, user)
        
        return {
            "success": True,
            "message": "Forecast fetched successfully",
            "data": forecast_data,
            "stale_cache": stale_cache
        }

    @staticmethod
    async def get_by_coordinates(db: Session, lat: float, lon: float, user: Optional[User] = None) -> Dict[str, Any]:
        # 1. Reverse geocode to get city name
        city = await openweather_api.reverse_geocode(lat, lon)
        if not city:
            # Fallback to user home city if reverse geocoding fails
            if user and user.home_city:
                city = user.home_city
            else:
                return {"success": False, "message": "Could not determine city from coordinates and no home city found."}

        # 2. Get weather for that city
        return await WeatherService.get_current_weather(db, city, user)

    @staticmethod
    async def get_air_quality(db: Session, city: str) -> Dict[str, Any]:
        try:
            # Resolve city to coords
            coords = await openweather_api.get_city_coords(city)
            if not coords:
                return {"success": False, "message": f"Could not find coordinates for {city}"}
            
            aqi_data = await openweather_api.get_air_quality(coords["lat"], coords["lon"])
            if not aqi_data or not aqi_data.get("list"):
                return {"success": False, "message": "Failed to fetch air quality data"}
            
            list_data = aqi_data["list"][0]
            components = list_data.get("components", {})
            
            return {
                "success": True,
                "message": "Air quality fetched successfully",
                "data": {
                    "city": city,
                    "aqi": list_data.get("main", {}).get("aqi"),
                    "pm2_5": components.get("pm2_5"),
                    "no2": components.get("no2"),
                    "o3": components.get("o3"),
                    "so2": components.get("so2")
                }
            }
        except Exception as e:
            logger.error(f"Error fetching air quality: {e}")
            return {"success": False, "message": str(e)}

    @staticmethod
    def _format_current_weather(api_data: Dict[str, Any], user: Optional[User] = None) -> Dict[str, Any]:
        main = api_data.get("main", {})
        wind = api_data.get("wind", {})
        weather = api_data.get("weather", [{}])[0]
        
        temp_c = main.get("temp")
        unit = UnitType.CELSIUS
        if user and user.preferences and user.preferences.unit == UnitType.FAHRENHEIT:
            unit = UnitType.FAHRENHEIT
            temp = (temp_c * 9/5) + 32
        else:
            temp = temp_c

        theme = get_weather_theme(weather.get("icon", ""))
        
        return {
            "city": api_data.get("name"),
            "temperature": round(temp, 1),
            "unit": unit,
            "humidity": main.get("humidity"),
            "wind_kph": round(wind.get("speed", 0) * 3.6, 1), # m/s to kph
            "pressure_mb": main.get("pressure"),
            "uv_index": 0, # OpenWeather free current API doesn't include UV, requires One Call (paid/limited)
            "condition": theme["label"],
            "icon": theme["icon"],
            "gradient": theme["gradient"],
            "raw_icon": weather.get("icon")
        }

    @staticmethod
    def _aggregate_forecast(api_data: Dict[str, Any], user: Optional[User] = None) -> Dict[str, Any]:
        # Aggregate 3-hour blocks into daily summaries
        forecast_list = api_data.get("list", [])
        city_info = api_data.get("city", {})
        daily_data = {}
        
        unit = UnitType.CELSIUS
        if user and user.preferences and user.preferences.unit == UnitType.FAHRENHEIT:
            unit = UnitType.FAHRENHEIT

        # 1. Process Raw Data for daily grouping
        for entry in forecast_list:
            dt = datetime.fromtimestamp(entry.get("dt"))
            date_str = dt.strftime("%Y-%m-%d")
            
            if date_str not in daily_data:
                daily_data[date_str] = {
                    "temps": [],
                    "humidities": [],
                    "conditions": [],
                    "rain_probs": []
                }
            
            main = entry.get("main", {})
            temp_c = main.get("temp")
            temp = (temp_c * 9/5) + 32 if unit == UnitType.FAHRENHEIT else temp_c
            
            daily_data[date_str]["temps"].append(temp)
            daily_data[date_str]["humidities"].append(main.get("humidity"))
            daily_data[date_str]["conditions"].append(entry.get("weather", [{}])[0].get("icon"))
            daily_data[date_str]["rain_probs"].append(entry.get("pop", 0))

        # 2. Generate Hourly Strip Data (Next 24-36 hours)
        hourly_strip = []
        for entry in forecast_list[:12]: # Next 36 hours
            dt = datetime.fromtimestamp(entry.get("dt"))
            main = entry.get("main", {})
            weather = entry.get("weather", [{}])[0]
            temp_c = main.get("temp")
            temp = (temp_c * 9/5) + 32 if unit == UnitType.FAHRENHEIT else temp_c
            
            theme = get_weather_theme(weather.get("icon", ""))
            
            hourly_strip.append({
                "time": dt.strftime("%I %p").lstrip('0'),
                "temp": round(temp, 1),
                "condition": theme["label"],
                "icon": theme["icon"],
                "raw_icon": weather.get("icon")
            })

        # 3. Generate Daily Summaries
        daily_summaries = []
        for date_str, data in list(daily_data.items()):
            # Dominant condition (most frequent icon)
            dom_icon = max(set(data["conditions"]), key=data["conditions"].count)
            theme = get_weather_theme(dom_icon)
            
            daily_summaries.append({
                "date": date_str,
                "day": datetime.strptime(date_str, "%Y-%m-%d").strftime("%A"),
                "short_day": datetime.strptime(date_str, "%Y-%m-%d").strftime("%a"),
                "min_temp": round(min(data["temps"]), 1),
                "max_temp": round(max(data["temps"]), 1),
                "condition": theme["label"],
                "icon": theme["icon"],
                "raw_icon": dom_icon,
                "rain_probability": round(sum(data["rain_probs"]) / len(data["rain_probs"]) * 100, 1) # Average pop
            })

        # 4. Generate Today Summary
        today_str = datetime.now().strftime("%Y-%m-%d")
        # Find the day data for today or the first available day
        today_data = daily_data.get(today_str, list(daily_data.values())[0])
        
        # Current feels like and description from first block
        first_block = forecast_list[0] if forecast_list else {}
        feels_like_c = first_block.get("main", {}).get("feels_like", 0)
        feels_like = (feels_like_c * 9/5) + 32 if unit == UnitType.FAHRENHEIT else feels_like_c

        today_summary = {
            "high": round(max(today_data["temps"]), 1),
            "low": round(min(today_data["temps"]), 1),
            "feels_like": round(feels_like, 1),
            "sunrise": datetime.fromtimestamp(city_info.get("sunrise", 0)).strftime("%I:%M %p").lstrip('0'),
            "sunset": datetime.fromtimestamp(city_info.get("sunset", 0)).strftime("%I:%M %p").lstrip('0'),
            "condition": daily_summaries[0]["condition"],
            "description": first_block.get("weather", [{}])[0].get("description", "").title()
        }
            
        return {
            "city": city_info.get("name"),
            "unit": unit,
            "today": today_summary,
            "hourly": hourly_strip,
            "daily": daily_summaries
        }

    @staticmethod
    def _update_search_history(db: Session, user_id: int, city: str):
        try:
            # Check if city is in ML model
            ml_available = is_city_in_model(city)
            
            # Create new history entry
            history = SearchHistory(
                user_id=user_id,
                city=city,
                ml_used=ml_available
            )
            db.add(history)
            db.commit()
        except Exception as e:
            db.rollback()
            logger.error(f"Failed to update search history: {e}")
