import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useWeatherContext } from '../../context/WeatherContext';
import api from '../../services/api';
import axios from 'axios';

export default function CitySearch() {
  const { setCity, resetToGPS, isGPSMode, activeCity } = useWeatherContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  
  const dropdownRef = useRef(null);
  const abortControllerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchCities = useCallback(async (searchQuery) => {
    console.log("fetchCities called with:", searchQuery);
    if (!searchQuery || searchQuery.length < 2) {
      console.log("Query too short, returning early.");
      setResults([]);
      setShowDropdown(false);
      return;
    }

    if (abortControllerRef.current) {
      console.log("Aborting previous request.");
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    try {
      console.log("Executing API call via api service...");
      const response = await api.get('/search/cities', {
        params: { q: searchQuery },
        signal: abortControllerRef.current.signal
      });
      console.log("API Response received:", response.data);
      if (response.data.success) {
        setResults(response.data.results);
        setShowDropdown(true);
        setActiveIndex(-1);
      }
    } catch (err) {
      if (!axios.isCancel(err)) {
        console.error("City search error:", err);
      } else {
        console.log("Request cancelled.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Use useEffect for debouncing query changes
  useEffect(() => {
    console.log("Query state changed to:", query);
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.length >= 2) {
      debounceTimerRef.current = setTimeout(() => {
        console.log("Debounce timeout reached, triggering fetch for:", query);
        fetchCities(query);
      }, 300);
    } else {
      setResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, fetchCities]);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSelectCity = (city) => {
    setCity(city.name);
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      if (activeIndex >= 0 && results[activeIndex]) {
        handleSelectCity(results[activeIndex]);
      } else if (results.length > 0) {
        handleSelectCity(results[0]);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative flex-1 max-w-md group" ref={dropdownRef}>
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined ml-3 text-primary group-focus-within:text-on-surface transition-colors">search</span>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && results.length > 0 && setShowDropdown(true)}
          placeholder={`Search city (e.g. ${activeCity})`}
          className="w-full pl-4 pr-4 py-3 bg-white/90 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-white dark:focus:bg-white/10 transition-all text-sm text-on-surface placeholder:text-on-surface-variant/70 dark:placeholder:text-on-surface-variant/60 backdrop-blur-md"
        />
        {loading ? (
          <div className="ml-2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
        ) : (
          <button 
            onClick={resetToGPS}
            className={`ml-2 p-1 rounded-lg flex-shrink-0 transition-all ${isGPSMode ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'}`}
            title="Use My Location"
          >
            <span className="material-symbols-outlined text-[20px]">my_location</span>
          </button>
        )}
      </div>

      {showDropdown && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface-container-highest border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl animate-fade-in">
          <div className="py-2">
            {results.map((city, index) => (
              <button
                key={`${city.lat}-${city.lon}`}
                onClick={() => handleSelectCity(city)}
                onMouseEnter={() => setActiveIndex(index)}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-colors text-left ${index === activeIndex ? 'bg-primary/10 text-primary' : 'hover:bg-white/5 text-on-surface'}`}
              >
                <span className="material-symbols-outlined text-sm opacity-50">location_on</span>
                <div className="flex-1">
                  <p className="text-sm font-bold">{city.name}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider">
                    {city.state ? `${city.state}, ` : ''}{city.country}
                  </p>
                </div>
                <span className="material-symbols-outlined text-xs opacity-0 group-hover:opacity-100">north_west</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
