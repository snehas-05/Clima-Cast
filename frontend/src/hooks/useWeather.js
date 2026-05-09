import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useWeather() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [staleCache, setStaleCache] = useState(false);

  const fetchWeather = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    setStaleCache(false);

    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      let endpoint = `${API_BASE_URL}/weather/current`;
      if (params.lat && params.lon) {
        endpoint = `${API_BASE_URL}/weather/by-coordinates`;
      }

      const response = await axios.get(endpoint, {
        params,
        headers
      });

      if (response.data.success) {
        setData(response.data.data);
        setStaleCache(response.data.stale_cache || false);
      } else {
        setError(response.data.message || "Failed to fetch weather data");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred while fetching weather");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchForecast = useCallback(async (city) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(`${API_BASE_URL}/weather/forecast`, {
        params: { city },
        headers
      });

      return response.data;
    } catch (err) {
      console.error("Forecast fetch error:", err);
      return { success: false, message: "Failed to fetch forecast" };
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAirQuality = useCallback(async (city) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/air-quality`, {
        params: { city }
      });
      return response.data;
    } catch (err) {
      console.error("Air Quality fetch error:", err);
      return { success: false, message: "Failed to fetch air quality" };
    }
  }, []);

  return { data, loading, error, staleCache, fetchWeather, fetchForecast, fetchAirQuality };
}
