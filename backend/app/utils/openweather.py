import httpx
import logging
from typing import Dict, Any, Optional
import os
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger("uvicorn.error")

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5"
GEO_URL = "http://api.openweathermap.org/geo/1.0"

class OpenWeatherAPI:
    def __init__(self):
        self.api_key = OPENWEATHER_API_KEY
        self.timeout = httpx.Timeout(10.0, connect=5.0)

    async def _get(self, url: str, params: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        if not self.api_key:
            logger.error("OpenWeather API Key is missing")
            return None

        params["appid"] = self.api_key
        
        async with httpx.AsyncClient(timeout=self.timeout) as client:
            try:
                # Retry logic: 1 retry
                for attempt in range(2):
                    try:
                        response = await client.get(url, params=params)
                        response.raise_for_status()
                        return response.json()
                    except (httpx.HTTPStatusError, httpx.RequestError) as e:
                        if attempt == 0:
                            logger.warning(f"OpenWeather API call failed (attempt 1), retrying... Error: {e}")
                            continue
                        logger.error(f"OpenWeather API call failed after 2 attempts: {e}")
                        raise e
            except Exception as e:
                logger.error(f"Unexpected error calling OpenWeather API: {e}")
                return None

    async def get_current_weather(self, city: str) -> Optional[Dict[str, Any]]:
        url = f"{BASE_URL}/weather"
        params = {"q": city, "units": "metric"}
        return await self._get(url, params)

    async def get_forecast(self, city: str) -> Optional[Dict[str, Any]]:
        url = f"{BASE_URL}/forecast"
        params = {"q": city, "units": "metric"}
        return await self._get(url, params)

    async def get_by_coords(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        url = f"{BASE_URL}/weather"
        params = {"lat": lat, "lon": lon, "units": "metric"}
        return await self._get(url, params)

    async def reverse_geocode(self, lat: float, lon: float) -> Optional[str]:
        url = f"{GEO_URL}/reverse"
        params = {"lat": lat, "lon": lon, "limit": 1}
        data = await self._get(url, params)
        if data and len(data) > 0:
            return data[0].get("name")
        return None

    async def get_air_quality(self, lat: float, lon: float) -> Optional[Dict[str, Any]]:
        url = f"{BASE_URL}/air_pollution"
        params = {"lat": lat, "lon": lon}
        return await self._get(url, params)

openweather_api = OpenWeatherAPI()
