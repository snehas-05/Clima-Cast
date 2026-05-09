import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

export function useWeather() {
  const [data, setData] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [error, setError] = useState(null);
  const [staleCache, setStaleCache] = useState(false);

  const fetchWeather = useCallback(async (params) => {
    setLoading(true);
    setError(null);
    setStaleCache(false);

    try {
      let endpoint = '/weather/current';
      if (params.lat && params.lon) {
        endpoint = '/weather/by-coordinates';
      }

      const response = await api.get(endpoint, { params });

      if (response.data.success) {
        setData(response.data.data);
        setStaleCache(response.data.stale_cache || false);
        return response.data.data;
      } else {
        setError(response.data.message || "Failed to fetch weather data");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred while fetching weather");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchForecast = useCallback(async (city, isPrefetch = false) => {
    if (!isPrefetch) setForecastLoading(true);
    
    try {
      const response = await api.get('/weather/forecast', {
        params: { city }
      });

      if (response.data.success) {
        if (!isPrefetch) setForecast(response.data.data);
        return response.data;
      }
      return response.data;
    } catch (err) {
      console.error("Forecast fetch error:", err);
      return { success: false, message: "Failed to fetch forecast" };
    } finally {
      if (!isPrefetch) setForecastLoading(false);
    }
  }, []);

  const fetchAirQuality = useCallback(async (city) => {
    try {
      const response = await api.get('/weather/air-quality', {
        params: { city }
      });
      return response.data;
    } catch (err) {
      console.error("Air Quality fetch error:", err);
      return { success: false, message: "Failed to fetch air quality" };
    }
  }, []);

  return { 
    data, 
    forecast, 
    loading, 
    forecastLoading, 
    error, 
    staleCache, 
    fetchWeather, 
    fetchForecast, 
    fetchAirQuality 
  };
}
