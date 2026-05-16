import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import api from '../services/api';
import axios from 'axios';
import { getAtmosphericState } from '../utils/atmosphericEngine';

const WeatherContext = createContext();

export const useWeatherContext = () => useContext(WeatherContext);

export const WeatherProvider = ({ children }) => {
  const [activeCity, setActiveCity] = useState(localStorage.getItem('last_active_city') || 'Mumbai');
  const [coordinates, setCoordinates] = useState(null);
  const [isGPSMode, setIsGPSMode] = useState(localStorage.getItem('is_gps_mode') === 'true');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  
  const hasInitialized = useRef(false);

  // Resolution function: Coords -> City Name
  const resolveCityFromCoords = useCallback(async (lat, lon) => {
    try {
      const response = await api.get('/weather/by-coordinates', {
        params: { lat, lon }
      });
      if (response.data.success && response.data.data.city) {
        return response.data.data.city;
      }
      return null;
    } catch (err) {
      console.error("Failed to resolve city from coords:", err);
      return null;
    }
  }, []);

  // GPS Trigger
  const triggerGPS = useCallback(async (isExplicit = false) => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      setIsGPSMode(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lon: longitude });
        
        const cityName = await resolveCityFromCoords(latitude, longitude);
        if (cityName) {
          setActiveCity(cityName);
          localStorage.setItem('last_active_city', cityName);
        }
        
        setIsGPSMode(true);
        localStorage.setItem('is_gps_mode', 'true');
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setIsGPSMode(false);
        localStorage.setItem('is_gps_mode', 'false');
        setLoading(false);
        if (isExplicit) {
           // If user explicitly clicked, maybe show an alert or toast
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, [resolveCityFromCoords]);

  // Initial Load Logic
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const savedGPSMode = localStorage.getItem('is_gps_mode') === 'true';
    const savedCity = localStorage.getItem('last_active_city');

    if (savedGPSMode || !savedCity) {
      triggerGPS();
    }
  }, [triggerGPS]);

  // Set Manual City
  const setCity = useCallback((cityName) => {
    setActiveCity(cityName);
    setCoordinates(null);
    setIsGPSMode(false);
    localStorage.setItem('last_active_city', cityName);
    localStorage.setItem('is_gps_mode', 'false');
  }, []);

  // Shared Weather Fetcher for Atmosphere
  const fetchCurrentWeather = useCallback(async () => {
    try {
      let endpoint = '/weather/current';
      let params = { city: activeCity };
      
      if (isGPSMode && coordinates) {
        endpoint = '/weather/by-coordinates';
        params = { lat: coordinates.lat, lon: coordinates.lon };
      }

      const response = await api.get(endpoint, { params });
      if (response.data.success) {
        setWeatherData(response.data.data);
      }
    } catch (err) {
      console.error("Atmospheric fetch error:", err);
    }
  }, [activeCity, isGPSMode, coordinates]);

  useEffect(() => {
    fetchCurrentWeather();
  }, [fetchCurrentWeather]);

  const atmosphericState = useMemo(() => getAtmosphericState(weatherData), [weatherData]);

  // Reset to GPS
  const resetToGPS = useCallback(() => {
    triggerGPS(true);
  }, [triggerGPS]);

  return (
    <WeatherContext.Provider value={{ 
      activeCity, 
      coordinates, 
      isGPSMode, 
      loading, 
      error, 
      weatherData,
      atmosphericState,
      setCity, 
      resetToGPS 
    }}>
      {children}
    </WeatherContext.Provider>
  );
};
