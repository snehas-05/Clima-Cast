import React, { useState, useEffect, useMemo } from 'react';
import TopBar from '../components/layout/TopBar';
import { useWeather } from '../hooks/useWeather';
import { useWeatherContext } from '../context/WeatherContext';
import { useAuth } from '../hooks/useAuth';
import TodaySummary from '../components/forecast/TodaySummary';
import ForecastStrip from '../components/forecast/ForecastStrip';
import DayForecastCard from '../components/forecast/DayForecastCard';
import Modal from '../components/ui/Modal';
import { usePreferences } from '../context/PreferencesContext';
import { formatTemp } from '../utils/temperature';
import { TodaySummarySkeleton, HourlyStripSkeleton, DailyGridSkeleton } from '../components/forecast/ForecastSkeletons';

export default function Forecast() {
  const { unit } = usePreferences();
  const { activeCity, coordinates, loading: geoLoading } = useWeatherContext();
  const { user } = useAuth();
  const {
    forecast,
    forecastLoading,
    fetchForecast,
    fetchWeather,
    data: currentWeatherData
  } = useWeather();

  const [selectedCard, setSelectedCard] = useState(null);

  // Unified Orchestration Callback
  const loadForecast = useCallback(async () => {
    if (!activeCity) return;
    
    // We prioritize city-based forecast for the UI
    fetchForecast(activeCity);
    
    // Also sync current weather in background for summary consistency
    if (coordinates) {
      fetchWeather({ lat: coordinates.lat, lon: coordinates.lon });
    } else {
      fetchWeather({ city: activeCity });
    }
  }, [activeCity, coordinates, fetchForecast, fetchWeather]);

  useEffect(() => {
    loadForecast();
  }, [loadForecast]);

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
  const getBackgroundClass = () => 'bg-background';

  const getModalContent = () => {
    if (!selectedCard) return null;
    const { type, data } = selectedCard;

    if (type === 'today') {
      return (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10 text-center">
              <p className="text-label-caps text-on-surface-variant mb-1">High</p>
              <p className="text-3xl font-bold text-primary">{formatTemp(data.high, unit)}°</p>
            </div>
            <div className="p-4 rounded-3xl bg-secondary/5 border border-secondary/10 text-center">
              <p className="text-label-caps text-on-surface-variant mb-1">Low</p>
              <p className="text-3xl font-bold text-secondary">{formatTemp(data.low, unit)}°</p>
            </div>
          </div>
          <div className="glass-card p-6 rounded-3xl">
             <p className="text-body-main text-on-surface-variant mb-4">
               {data.description}. The day will see a high of {formatTemp(data.high, unit)}° and a low of {formatTemp(data.low, unit)}°.
             </p>
             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div>
                   <p className="text-[10px] text-label-caps text-on-surface-variant/60 font-bold">FEELS LIKE</p>
                   <p className="text-lg font-bold text-on-surface">{formatTemp(data.feels_like, unit)}°</p>
                </div>
                <div>
                   <p className="text-[10px] text-label-caps text-on-surface-variant/60 font-bold">HUMIDITY</p>
                   <p className="text-lg font-bold text-on-surface">{data.humidity || 'N/A'}%</p>
                </div>
             </div>
          </div>
        </div>
      );
    }

    if (type === 'hourly') {
      return (
        <div className="space-y-6 text-center">
          <div className="p-10 glass-card rounded-[2.5rem] inline-block mx-auto border-primary/20">
            <p className="text-label-caps text-on-surface-variant mb-2">{data.time}</p>
            <p className="text-h1-hero text-on-surface">{formatTemp(data.temp, unit)}°</p>
            <p className="text-h3-card-title text-primary mt-2 uppercase tracking-widest">{data.condition}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-left">
             <div className="p-4 glass-card rounded-2xl">
                <p className="text-[10px] text-label-caps text-on-surface-variant/60 font-bold">WIND</p>
                <p className="text-lg font-bold text-on-surface">{data.wind_kph || '--'} km/h</p>
             </div>
             <div className="p-4 glass-card rounded-2xl">
                <p className="text-[10px] text-label-caps text-on-surface-variant/60 font-bold">CHANCE OF RAIN</p>
                <p className="text-lg font-bold text-on-surface">{data.precip_mm || '0'} mm</p>
             </div>
          </div>
        </div>
      );
    }

    if (type === 'daily') {
      return (
        <div className="space-y-6">
           <div className="flex flex-col items-center text-center space-y-4">
              <p className="text-label-caps text-primary font-bold tracking-[0.2em] mb-1">{data.day?.toUpperCase() || data.short_day?.toUpperCase()}</p>
              <h4 className="text-3xl font-bold text-on-surface">{data.condition}</h4>
              <p className="text-on-surface-variant">{data.date}</p>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div className="p-6 glass-card rounded-3xl text-center bg-gradient-to-br from-primary/5 to-transparent">
                 <p className="text-label-caps text-on-surface-variant mb-2">High</p>
                 <p className="text-4xl font-bold text-on-surface">{formatTemp(data.max_temp, unit)}°</p>
              </div>
              <div className="p-6 glass-card rounded-3xl text-center bg-gradient-to-br from-slate-800/10 to-transparent">
                 <p className="text-label-caps text-on-surface-variant mb-2">Low</p>
                 <p className="text-4xl font-bold text-on-surface">{formatTemp(data.min_temp, unit)}°</p>
              </div>
           </div>
           <div className="p-6 glass-card rounded-3xl">
              <h5 className="font-bold text-primary mb-3">Daily Summary</h5>
              <p className="text-on-surface-variant leading-relaxed">
                 Expect {data.condition.toLowerCase()} conditions throughout the day. 
                 The temperature will fluctuate between {formatTemp(data.min_temp, unit)}° and {formatTemp(data.max_temp, unit)}°.
                 {data.rain_probability > 0 ? ` There is a ${data.rain_probability}% chance of precipitation.` : ' No significant precipitation is expected.'}
              </p>
           </div>
        </div>
      );
    }

    return null;
  };


  return (
    <div className={`min-h-screen transition-colors duration-1000 ${getBackgroundClass()}`}>
      <TopBar title="Forecast" subtitle="Atmospheric Outlook" />

      <div className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-8 max-w-[1440px] mx-auto w-full space-y-8">

        {/* Today Summary Hero */}
        {forecastLoading && !memoizedForecast ? (
          <TodaySummarySkeleton />
        ) : (
          <TodaySummary 
            city={activeCity} 
            today={memoizedForecast?.today} 
            onClick={() => setSelectedCard({ type: 'today', data: memoizedForecast.today, title: `Today's Outlook - ${activeCity}` })}
          />
        )}

        {/* Hourly Strip */}
        {forecastLoading && !memoizedForecast ? (
          <HourlyStripSkeleton />
        ) : (
          <ForecastStrip 
            hourly={memoizedForecast?.hourly} 
            onCardClick={(hourData) => setSelectedCard({ type: 'hourly', data: hourData, title: `Hourly Detail - ${hourData.time}` })}
          />
        )}

        {/* Divider */}
        <div className="flex items-center gap-6 py-6">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <span className="text-label-caps text-primary/60 tracking-[0.4em] font-bold">7-Day Forecast</span>
          <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-white/10 to-transparent" />
        </div>

        {/* 7-Day Grid */}
        {forecastLoading && !memoizedForecast ? (
          <DailyGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {memoizedForecast?.daily?.map((day) => (
              <DayForecastCard 
                key={day.date} 
                {...day} 
                onClick={() => setSelectedCard({ type: 'daily', data: day, title: `${day.day || day.short_day} Forecast` })}
              />
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

      <Modal
        isOpen={!!selectedCard}
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.title || "Details"}
      >
        {getModalContent()}
      </Modal>
    </div>
  );
}
