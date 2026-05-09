import React, { useEffect, useMemo, useState } from 'react';
import TopBar from '../components/layout/TopBar';
import { useWeather } from '../hooks/useWeather';
import { useGPS } from '../hooks/useGPS';
import { useAuth } from '../hooks/useAuth';
import TodaySummary from '../components/forecast/TodaySummary';
import ForecastStrip from '../components/forecast/ForecastStrip';
import DayForecastCard from '../components/forecast/DayForecastCard';
import { TodaySummarySkeleton, HourlyStripSkeleton, DailyGridSkeleton } from '../components/forecast/ForecastSkeletons';

export default function Forecast() {
  const { coordinates, loading: gpsLoading } = useGPS();
  const { user } = useAuth();
  const {
    forecast,
    forecastLoading,
    fetchForecast,
    fetchWeather,
    data: currentWeatherData
  } = useWeather();

  const [activeCity, setActiveCity] = useState(null);

  // 1. Resolve Active City (GPS > Home > Last Searched > Mumbai)
  useEffect(() => {
    const resolveCity = async () => {
      // a. GPS
      if (coordinates) {
        const weather = await fetchWeather({ lat: coordinates.lat, lon: coordinates.lon });
        if (weather?.city) {
          setActiveCity(weather.city);
          localStorage.setItem('last_searched_city', weather.city);
          return;
        }
      }

      // b. Home City
      if (user?.home_city) {
        setActiveCity(user.home_city);
        return;
      }

      // c. Last Searched
      const lastCity = localStorage.getItem('last_searched_city');
      if (lastCity) {
        setActiveCity(lastCity);
        return;
      }

      // d. Fallback
      setActiveCity('Mumbai');
    };

    if (!gpsLoading) {
      resolveCity();
    }
  }, [coordinates, gpsLoading, user, fetchWeather]);

  // 2. Fetch Forecast once city is resolved
  useEffect(() => {
    if (activeCity) {
      fetchForecast(activeCity);
    }
  }, [activeCity, fetchForecast]);

  // 3. Memoize grouped forecast calculations
  const memoizedForecast = useMemo(() => {
    if (!forecast) return null;
    return {
      today: forecast.today,
      hourly: forecast.hourly,
      daily: forecast.daily
    };
  }, [forecast]);

  // 4. Dynamic Background Background Color based on weather
  const getBackgroundClass = () => {
    if (!memoizedForecast?.today) return 'bg-background';
    const condition = memoizedForecast.today.condition?.toLowerCase();

    if (condition.includes('sun') || condition.includes('clear')) return 'bg-amber-900/5';
    if (condition.includes('cloud')) return 'bg-slate-900/5';
    if (condition.includes('rain')) return 'bg-blue-900/5';
    if (condition.includes('thunder')) return 'bg-purple-900/5';
    if (condition.includes('snow')) return 'bg-cyan-900/5';
    return 'bg-background';
  };

  return (
    <div className={`min-h-screen transition-colors duration-1000 ${getBackgroundClass()}`}>
      <TopBar title="Forecast" subtitle="Atmospheric Outlook" />

      <div className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-8 max-w-[1440px] mx-auto w-full space-y-8">

        {/* Today Summary Hero */}
        {forecastLoading && !memoizedForecast ? (
          <TodaySummarySkeleton />
        ) : (
          <TodaySummary city={activeCity} today={memoizedForecast?.today} />
        )}

        {/* Hourly Strip */}
        {forecastLoading && !memoizedForecast ? (
          <HourlyStripSkeleton />
        ) : (
          <ForecastStrip hourly={memoizedForecast?.hourly} />
        )}

        {/* Divider */}
        <div className="flex items-center gap-4 py-4">
          <div className="h-[1px] flex-1 bg-white/5" />
          <span className="text-label-caps text-on-surface-variant/40 tracking-[0.3em]">7-Day Forecast</span>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>

        {/* 7-Day Grid */}
        {forecastLoading && !memoizedForecast ? (
          <DailyGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {memoizedForecast?.daily?.map((day) => (
              <DayForecastCard key={day.date} {...day} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!forecastLoading && !memoizedForecast && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/20 mb-4">cloud_off</span>
            <h3 className="text-xl font-bold text-on-surface mb-2">No Forecast Available</h3>
            <p className="text-on-surface-variant">We couldn't retrieve the forecast for {activeCity}. Please check your connection or try another city.</p>
          </div>
        )}
      </div>
    </div>
  );
}
