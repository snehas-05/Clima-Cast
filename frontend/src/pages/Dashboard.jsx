import { useEffect, useState } from 'react';
import TopBar from '../components/layout/TopBar';
import MetricCard from '../components/cards/MetricCard';
import HourCard from '../components/cards/HourCard';
import InsightCard from '../components/cards/InsightCard';
import { useGPS } from '../hooks/useGPS';
import { useWeather } from '../hooks/useWeather';
import LoadingSkeleton, { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { usePreferences } from '../context/PreferencesContext';
import { formatTemp } from '../utils/temperature';

export default function Dashboard() {
  const { unit } = usePreferences();
  const { coordinates, loading: gpsLoading, error: gpsError, permissionDenied } = useGPS();
  const { 
    data: weatherData, 
    forecast: forecastData, 
    loading: weatherLoading, 
    forecastLoading, 
    staleCache, 
    fetchWeather, 
    fetchForecast, 
    fetchAirQuality 
  } = useWeather();
  
  const [airQuality, setAirQuality] = useState(null);

  useEffect(() => {
    if (coordinates) {
      fetchWeather({ lat: coordinates.lat, lon: coordinates.lon });
    } else if (permissionDenied || gpsError) {
      fetchWeather({ city: 'Mumbai' });
    }
  }, [coordinates, gpsError, permissionDenied, fetchWeather]);

  useEffect(() => {
    if (weatherData?.city) {
      fetchForecast(weatherData.city, false);
      fetchAirQuality(weatherData.city).then(res => {
        if (res.success) {
          setAirQuality(res.data);
        }
      });
    }
  }, [weatherData?.city, fetchForecast, fetchAirQuality]);

  if (gpsLoading || (weatherLoading && !weatherData)) {
    return (
      <div className="flex-1 p-8 space-y-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <LoadingSkeleton height="3rem" width="250px" />
          <LoadingSkeleton height="2.5rem" width="120px" borderRadius="1.25rem" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <LoadingSkeleton height="400px" borderRadius="2rem" />
          </div>
          <div className="lg:col-span-4">
            <LoadingSkeleton height="400px" borderRadius="2rem" />
          </div>
        </div>
      </div>
    );
  }

  const metrics = weatherData ? [
    { icon: 'device_thermostat', label: 'TEMPERATURE', value: `${formatTemp(weatherData.temperature, unit)}°`, trend: 'Live' },
    { icon: 'water_drop', label: 'HUMIDITY', value: `${weatherData.humidity}%`, trend: 'Normal', iconBg: 'bg-secondary/10', iconColor: 'text-secondary' },
    { icon: 'air', label: 'WIND SPEED', value: `${weatherData.wind_kph} km/h`, trend: 'Stable' },
    { icon: 'compress', label: 'PRESSURE', value: `${weatherData.pressure_mb} mb`, trend: 'Stable', iconBg: 'bg-tertiary/10', iconColor: 'text-tertiary' },
    { icon: 'eco', label: 'AIR QUALITY (AQI)', value: airQuality?.aqi || '--', trend: 'Live', iconBg: 'bg-primary/10', iconColor: 'text-primary' },
  ] : [];

  const getDynamicInsights = (data) => {
    const insights = [];
    if (data.ml_available) {
      insights.push({ icon: 'psychology', iconBg: 'bg-primary/10', title: 'Model Availability', description: `Full prediction support active for ${data.city}.` });
      insights.push({ icon: 'show_chart', iconBg: 'bg-tertiary/10', iconColor: 'text-tertiary', titleColor: 'text-tertiary', title: 'Trends', description: 'Historical patterns are being processed for upcoming predictions.' });
    } else {
      if (data.temperature > 30) insights.push({ icon: 'wb_sunny', iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500', title: 'Heat Advisory', description: 'High temperatures detected. Stay hydrated.' });
      else if (data.temperature < 10) insights.push({ icon: 'ac_unit', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500', title: 'Cold Alert', description: 'Chilly conditions. Wear a jacket.' });
      
      if (insights.length === 0) insights.push({ icon: 'verified', iconBg: 'bg-green-500/10', iconColor: 'text-green-500', title: 'Ideal Conditions', description: 'The weather looks stable and pleasant.' });
    }
    return insights;
  };

  return (
    <>
      <TopBar title="Dashboard" subtitle={weatherData?.city || "Real-Time Overview"} />
      
      <div className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-8 max-w-[1440px] mx-auto w-full space-y-[var(--spacing-card-gap)]">
        
        {staleCache && (
          <div className="bg-yellow-500/20 border border-yellow-500/50 text-yellow-200 px-6 py-3 rounded-2xl flex items-center gap-3">
            <span className="material-symbols-outlined">history</span>
            <p className="text-body-md font-medium">Showing last known weather data (Offline mode)</p>
          </div>
        )}

        {weatherData && (
          <div className={`px-6 py-3 rounded-2xl flex items-center justify-between gap-3 border ${weatherData.ml_available ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-slate-800/40 border-slate-700/50 text-on-surface-variant'}`}>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined">{weatherData.ml_available ? 'auto_awesome' : 'sensors'}</span>
              <p className="text-body-md font-medium">
                {weatherData.ml_available 
                  ? `✨ AI Predictions Available for ${weatherData.city}` 
                  : `📡 Clima-Cast Insights Active — Real-time analysis for ${weatherData.city}`}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[var(--spacing-card-gap)]">
          {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-card-gap)]">
          <div className={`lg:col-span-8 glass-card rounded-3xl p-8 flex flex-col relative overflow-hidden`}>
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${weatherData?.gradient || 'from-primary/20 to-transparent'} blur-3xl opacity-30 -mr-20 -mt-20`} />
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 relative z-10">
              <div>
                <p className="text-label-caps text-on-surface-variant mb-1">CURRENT CONDITIONS</p>
                <h3 className="text-h1-hero text-on-surface leading-none">
                  {weatherData ? `${formatTemp(weatherData.temperature, unit)}°` : '--'}
                </h3>
                <p className="text-body-lg text-on-surface-variant mt-2">
                  {weatherData ? `${weatherData.condition} • ${weatherData.city}` : 'Fetching weather...'}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {weatherData?.icon || 'cloud'}
                </span>
                {weatherData?.ml_available && (
                  <span className="text-label-caps text-primary bg-primary/10 px-2 py-1 rounded">AI POWERED</span>
                )}
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {forecastLoading ? (
                [1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="min-w-[96px] h-32 bg-slate-800/40 rounded-2xl animate-pulse" />
                ))
              ) : (
                forecastData?.hourly?.map((h, i) => (
                  <HourCard 
                    key={i} 
                    time={h.time} 
                    icon={h.icon} 
                    temp={h.temp}
                    isActive={i === 0}
                  />
                ))
              )}
            </div>
          </div>

          <div className="lg:col-span-4 glass-card rounded-3xl p-8 flex flex-col">
            <h4 className="text-h3-card-title text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              AI Quick Insights
            </h4>
            <div className="space-y-6 flex-1">
              {weatherData && getDynamicInsights(weatherData).map((insight, idx) => (
                <InsightCard key={idx} {...insight} />
              ))}
            </div>
          </div>

          <div className="lg:col-span-12 glass-card rounded-3xl p-8">
            <h4 className="text-h3-card-title text-on-surface mb-6">5-Day Forecast</h4>
            {forecastLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-slate-800/40 rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {forecastData?.daily?.slice(0, 5).map((f) => (
                  <div key={f.date} className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 flex flex-col items-center text-center">
                    <p className="text-label-caps text-on-surface-variant mb-2">{f.day || '--'}</p>
                    <span className="material-symbols-outlined text-3xl text-primary mb-2">{f.icon || 'wb_sunny'}</span>
                    <p className="text-h3-card-title text-on-surface">{formatTemp(f.max_temp, unit)}°</p>
                    <p className="text-body-sm text-on-surface-variant">{formatTemp(f.min_temp, unit)}°</p>
                    <p className="text-[10px] text-primary/70 mt-2">{f.condition || '--'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
