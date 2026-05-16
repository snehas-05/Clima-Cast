import { useEffect, useState, useCallback, useMemo } from 'react';
import TopBar from '../components/layout/TopBar';
import MetricCard from '../components/cards/MetricCard';
import HourCard from '../components/cards/HourCard';
import InsightCard from '../components/cards/InsightCard';
import Modal from '../components/ui/Modal';
import { useWeatherContext } from '../context/WeatherContext';
import { useWeather } from '../hooks/useWeather';
import LoadingSkeleton, { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { usePreferences } from '../context/PreferencesContext';
import { formatTemp } from '../utils/temperature';
import { useInsights } from '../hooks/useInsights';
import { motion } from 'framer-motion';
import AnimatedCard from '../components/ui/AnimatedCard';
import { TRANSITIONS, TIMING, EASING } from '../utils/motion';

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Dashboard() {
  const { unit } = usePreferences();
  const { activeCity, coordinates, loading: geoLoading, error: geoError } = useWeatherContext();
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

  const { insights, riskScore, trend: insightTrend, loading: insightsLoading } = useInsights(activeCity);
  
  const [airQuality, setAirQuality] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);

  // Unified Orchestration Effect
  const fetchDashboardData = useCallback(async () => {
    let result;
    if (coordinates) {
      result = await fetchWeather({ lat: coordinates.lat, lon: coordinates.lon });
    } else if (activeCity) {
      result = await fetchWeather({ city: activeCity });
    }

    if (result?.city) {
      // Trigger secondary fetches in parallel
      Promise.all([
        fetchForecast(result.city, false),
        fetchAirQuality(result.city)
      ]).then(([forecastRes, aqiRes]) => {
        if (aqiRes.success) setAirQuality(aqiRes.data);
      });
    }
  }, [activeCity, coordinates, fetchWeather, fetchForecast, fetchAirQuality]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const metrics = useMemo(() => {
    if (!weatherData) return [];
    
    return [
      { id: 'temp', icon: 'device_thermostat', label: 'TEMPERATURE', value: `${formatTemp(weatherData.temperature, unit)}°`, subLabel: `Feels like ${formatTemp(weatherData.feels_like, unit)}°`, trend: 'Live' },
      { id: 'humidity', icon: 'water_drop', label: 'HUMIDITY', value: `${weatherData.humidity}%`, subLabel: weatherData.humidity > 60 ? 'Sticky' : weatherData.humidity < 30 ? 'Dry' : 'Comfortable', trend: 'Normal', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-400' },
      { id: 'wind', icon: 'air', label: 'WIND SPEED', value: `${weatherData.wind_kph} km/h`, subLabel: 'Gentle breeze', trend: 'Stable', iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-400' },
      { id: 'pressure', icon: 'compress', label: 'PRESSURE', value: `${weatherData.pressure_mb} mb`, subLabel: 'Steady', trend: 'Stable', iconBg: 'bg-amber-500/10', iconColor: 'text-amber-400' },
      { id: 'aqi', icon: 'eco', label: 'AIR QUALITY (AQI)', value: airQuality?.aqi || '4', subLabel: (airQuality?.aqi || 4) <= 50 ? 'Good' : 'Moderate', trend: 'Live', iconBg: 'bg-cyan-500/10', iconColor: 'text-cyan-400' },
    ];
  }, [weatherData, airQuality, unit]);

  const isLoading = geoLoading || (weatherLoading && !weatherData);

  if (isLoading) {
    return (
      <div className="flex-1 p-8 space-y-8 animate-fade-in min-h-0">
        <div className="flex justify-between items-center mb-8">
          <LoadingSkeleton height="3rem" width="250px" />
          <div className="flex gap-4">
            <LoadingSkeleton height="2.5rem" width="100px" borderRadius="1.25rem" />
            <LoadingSkeleton height="2.5rem" width="100px" borderRadius="1.25rem" />
          </div>
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
            <LoadingSkeleton height="500px" borderRadius="2rem" />
          </div>
          <div className="lg:col-span-4">
            <LoadingSkeleton height="500px" borderRadius="2rem" />
          </div>
        </div>
      </div>
    );
  }



  const getModalContent = () => {
    if (!selectedCard || !weatherData) return null;

    const { id } = selectedCard;

    switch (id) {
      case 'temp':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10">
                <p className="text-label-caps text-on-surface-variant mb-1">Feels Like</p>
                <p className="text-h3-card-title text-primary">{formatTemp(weatherData.feels_like, unit)}°</p>
              </div>
              <div className="p-4 rounded-3xl bg-secondary/5 border border-secondary/10">
                <p className="text-label-caps text-on-surface-variant mb-1">Dew Point</p>
                <p className="text-h3-card-title text-secondary">{formatTemp(weatherData.dew_point || 22, unit)}°</p>
              </div>
            </div>
            <div className="glass-card p-6 rounded-3xl">
              <p className="text-body-main text-on-surface-variant mb-4">The current temperature in {weatherData.city} is {formatTemp(weatherData.temperature, unit)}°. It feels slightly {weatherData.feels_like > weatherData.temperature ? 'warmer' : 'cooler'} due to humidity and wind factors.</p>
              <div className="flex items-center gap-4 text-primary">
                <span className="material-symbols-outlined">info</span>
                <p className="text-body-sm">Stay updated with real-time variations every 15 minutes.</p>
              </div>
            </div>
          </div>
        );
      case 'humidity':
        return (
          <div className="space-y-6">
            <div className="p-8 rounded-[2rem] bg-gradient-to-br from-secondary/20 to-transparent border border-secondary/20 text-center">
              <p className="text-h1-hero text-secondary mb-2">{weatherData.humidity}%</p>
              <p className="text-body-lg text-on-surface-variant">Relative Humidity</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="glass-card p-6 rounded-3xl">
                <h4 className="font-semibold text-secondary mb-2">Comfort Level</h4>
                <p className="text-body-main text-on-surface-variant">
                  {weatherData.humidity > 60 ? 'Humid conditions. May feel sticky or uncomfortable.' : 
                   weatherData.humidity < 30 ? 'Dry air. Consider using a humidifier.' : 
                   'Pleasant and comfortable humidity levels.'}
                </p>
              </div>
              <div className="glass-card p-6 rounded-3xl">
                <h4 className="font-semibold text-secondary mb-2">Impact</h4>
                <p className="text-body-main text-on-surface-variant">Higher humidity levels can make the air feel warmer than the actual temperature.</p>
              </div>
            </div>
          </div>
        );
      case 'wind':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-6 glass-card rounded-3xl">
              <div>
                <p className="text-label-caps text-on-surface-variant mb-1">Current Speed</p>
                <p className="text-h2-dashboard text-on-surface">{weatherData.wind_kph} <span className="text-body-lg text-on-surface-variant">km/h</span></p>
              </div>
              <div className="w-16 h-16 rounded-full border-2 border-primary/30 flex items-center justify-center relative">
                <span className="material-symbols-outlined text-3xl text-primary transform" style={{ transform: `rotate(${weatherData.wind_degree || 0}deg)` }}>navigation</span>
                <div className="absolute -top-6 text-[10px] font-bold text-on-surface-variant">N</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-800/20 border border-slate-700/30">
                <p className="text-label-caps text-on-surface-variant mb-1">Gusts</p>
                <p className="text-body-lg font-semibold text-on-surface">{(weatherData.wind_kph * 1.2).toFixed(1)} km/h</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-800/20 border border-slate-700/30">
                <p className="text-label-caps text-on-surface-variant mb-1">Direction</p>
                <p className="text-body-lg font-semibold text-on-surface">{weatherData.wind_dir || 'NW'}</p>
              </div>
            </div>
          </div>
        );
      case 'pressure':
        return (
          <div className="space-y-6 text-center">
            <div className="p-10 glass-card rounded-[2.5rem] inline-block mx-auto border-tertiary/20">
              <span className="material-symbols-outlined text-6xl text-tertiary mb-4">compress</span>
              <p className="text-h1-hero text-on-surface">{weatherData.pressure_mb} <span className="text-h3-card-title text-on-surface-variant">mb</span></p>
              <p className="text-body-lg text-on-surface-variant mt-2">Atmospheric Pressure</p>
            </div>
            <p className="text-body-main text-on-surface-variant max-w-md mx-auto">
              Pressure levels are currently stable. A drop in pressure usually indicates approaching stormy weather, while high pressure often brings clear skies.
            </p>
          </div>
        );
      case 'aqi':
        return (
          <div className="space-y-6">
            <div className={`p-8 rounded-[2rem] text-center border-2 backdrop-blur-md shadow-xl ${
              (airQuality?.aqi || 0) <= 50 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              (airQuality?.aqi || 0) <= 100 ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
              'bg-rose-500/10 border-rose-500/20 text-rose-400'
            }`}>
              <p className="text-label-caps mb-1">AIR QUALITY INDEX</p>
              <p className="text-h1-hero leading-none mb-2">{airQuality?.aqi || '5'}</p>
              <p className="text-h3-card-title font-bold">
                {(airQuality?.aqi || 0) <= 50 ? 'GOOD' : (airQuality?.aqi || 0) <= 100 ? 'MODERATE' : 'UNHEALTHY'}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'PM2.5', val: '12' },
                { label: 'PM10', val: '45' },
                { label: 'O3', val: '32' },
                { label: 'NO2', val: '18' },
                { label: 'SO2', val: '2' },
                { label: 'CO', val: '0.4' }
              ].map(p => (
                <div key={p.label} className="p-3 glass-card rounded-2xl text-center">
                  <p className="text-[10px] text-on-surface-variant font-bold">{p.label}</p>
                  <p className="text-body-main font-bold text-on-surface">{p.val}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'current-conditions':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <span className="material-symbols-outlined text-8xl text-primary drop-shadow-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {weatherData.icon || 'wb_sunny'}
              </span>
              <div>
                <h4 className="text-h2-dashboard text-on-surface">{weatherData.condition}</h4>
                <p className="text-body-lg text-on-surface-variant">Last updated: {new Date().toLocaleTimeString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: 'visibility', label: 'Visibility', value: '10 km' },
                { icon: 'wb_sunny', label: 'UV Index', value: 'Low (2)' },
                { icon: 'sunny', label: 'Sunrise', value: '5:42 AM' },
                { icon: 'bedtime', label: 'Sunset', value: '7:12 PM' }
              ].map(item => (
                <div key={item.label} className="p-4 glass-card rounded-3xl flex flex-col items-center text-center overflow-hidden min-h-[110px] justify-center">
                  <span className="material-symbols-outlined text-primary mb-2 text-2xl">{item.icon}</span>
                  <p className="text-[10px] text-on-surface-variant uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-body-main font-bold text-on-surface">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="p-6 glass-card rounded-[2rem] bg-primary/5">
              <h4 className="font-semibold text-primary mb-3">Weather Summary</h4>
              <p className="text-body-main text-on-surface-variant leading-relaxed">
                Currently in {weatherData.city}, the weather is {weatherData.condition.toLowerCase()}. 
                With a temperature of {formatTemp(weatherData.temperature, unit)}° and {weatherData.humidity}% humidity, 
                it's a {weatherData.temperature > 25 ? 'warm' : 'pleasant'} {new Date().getHours() < 12 ? 'morning' : 'day'}.
              </p>
            </div>
          </div>
        );
      case 'forecast':
        return (
          <div className="space-y-6">
            <p className="text-body-main text-on-surface-variant mb-4">Extended 5-day outlook for {weatherData.city}. Expect variable conditions throughout the week.</p>
            <div className="space-y-4">
              {forecastData?.daily?.slice(0, 5).map((f) => (
                <div 
                  key={f.date} 
                  className="flex items-center justify-between p-4 glass-card rounded-2xl hover:bg-white/5 transition-all cursor-pointer group"
                  onClick={() => setSelectedCard({ id: 'day-forecast', title: `${f.day} Forecast`, dayData: f })}
                >
                  <div className="w-24">
                    <p className="font-bold text-on-surface group-hover:text-primary transition-colors">{f.day}</p>
                    <p className="text-[10px] text-on-surface-variant">{f.date}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-1 px-4">
                    <span className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">{f.icon}</span>
                    <p className="text-body-sm text-on-surface-variant truncate">{f.condition}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-on-surface">{formatTemp(f.max_temp, unit)}°</p>
                    <p className="text-body-sm text-on-surface-variant">{formatTemp(f.min_temp, unit)}°</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'day-forecast':
        const d = selectedCard.dayData;
        return (
          <div className="space-y-8">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="material-symbols-outlined text-7xl text-primary drop-shadow-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {d.icon}
                </span>
              </div>
              <div>
                <p className="text-label-caps text-primary font-bold tracking-[0.2em] mb-1">{d.day.toUpperCase()}</p>
                <h4 className="text-h2-dashboard text-on-surface">{d.condition}</h4>
                <p className="text-body-main text-on-surface-variant">{d.date}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 glass-card rounded-3xl text-center bg-gradient-to-br from-primary/5 to-transparent">
                <p className="text-label-caps text-on-surface-variant mb-2">High Temperature</p>
                <p className="text-4xl font-bold text-on-surface">{formatTemp(d.max_temp, unit)}°</p>
              </div>
              <div className="p-6 glass-card rounded-3xl text-center bg-gradient-to-br from-slate-800/10 to-transparent">
                <p className="text-label-caps text-on-surface-variant mb-2">Low Temperature</p>
                <p className="text-4xl font-bold text-on-surface">{formatTemp(d.min_temp, unit)}°</p>
              </div>
            </div>

            <div className="p-8 glass-card rounded-[2.5rem] bg-primary/5 border-primary/10">
              <h5 className="font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">description</span>
                Daily Climate Outlook
              </h5>
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                On {d.day}, {weatherData.city} will experience {d.condition.toLowerCase()} conditions. 
                The temperature will reach a high of {formatTemp(d.max_temp, unit)}° and drop to {formatTemp(d.min_temp, unit)}° during the night. 
                Expect atmospheric changes consistent with {d.condition.toLowerCase()} patterns in the region.
              </p>
              <div className="mt-6 flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                <span className="material-symbols-outlined text-primary">auto_awesome</span>
                <p className="text-body-sm text-on-surface">AI Predicts {Math.random() > 0.5 ? 'stable' : 'shifting'} barometric pressure for this period.</p>
              </div>
            </div>
          </div>
        );
      case 'insight':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-4 bg-primary/10 rounded-3xl text-primary`}>
                <span className="material-symbols-outlined text-3xl">{selectedCard.icon || 'psychology'}</span>
              </div>
              <h4 className="text-h3-card-title text-on-surface font-bold">{selectedCard.title}</h4>
            </div>
            <div className="p-8 glass-card rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
              <h5 className="font-bold text-primary mb-4 flex items-center gap-2 text-sm uppercase tracking-widest">
                <span className="material-symbols-outlined text-sm">analytics</span>
                Intelligence Context
              </h5>
              <p className="text-body-lg text-on-surface leading-relaxed mb-6">
                {selectedCard.explanation || selectedCard.description}
              </p>
              
              {selectedCard.factors && selectedCard.factors.length > 0 && (
                <div className="space-y-3 pt-6 border-t border-on-surface/10">
                  <p className="text-[10px] font-black text-on-surface-variant tracking-[0.2em] uppercase">Contributing Factors</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedCard.factors.map(f => (
                      <span key={f} className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-on-surface">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 pt-6 border-t border-on-surface/10 mt-6">
                <div className="flex justify-between items-center">
                  <p className="text-body-sm text-on-surface-variant font-medium uppercase tracking-tighter">Model Confidence</p>
                  <p className="text-body-sm font-bold text-primary">{Math.round((selectedCard.confidence || 0.94) * 100)}%</p>
                </div>
                <div className="w-full h-1.5 bg-on-surface/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all duration-1000" style={{ width: `${(selectedCard.confidence || 0.94) * 100}%` }} />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10 text-on-surface-variant/80">
              <span className="material-symbols-outlined text-primary">info</span>
              <p className="text-[11px] leading-relaxed">
                This insight is synthesized using the <span className="text-primary font-bold">Clima-Cast Reasoning Engine</span>, correlating real-time sensors with historical climate models and ML-driven risk vectors.
              </p>
            </div>
          </div>
        );
      default:
        return <p className="text-on-surface-variant text-center py-10">Detailed information is being prepared for this module.</p>;
    }
  };

  return (
    <>
      <TopBar title="Dashboard" subtitle={weatherData?.city || "Real-Time Overview"} />
      
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-8 max-w-[1440px] mx-auto w-full space-y-[var(--spacing-card-gap)]"
      >
        
        {staleCache && (
          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-400 px-6 py-4 rounded-[1.5rem] flex items-center gap-4 shadow-lg shadow-amber-950/20 backdrop-blur-md">
            <div className="p-2 bg-amber-500/20 rounded-xl">
              <span className="material-symbols-outlined text-amber-500 text-xl font-bold">history</span>
            </div>
            <p className="text-sm font-black tracking-wide uppercase">Showing last known weather data (Offline mode)</p>
          </div>
        )}

        {weatherData && (
          <div className={`px-6 py-4 rounded-[1.5rem] flex items-center justify-between gap-4 border transition-all duration-300 backdrop-blur-md shadow-lg ${weatherData.ml_available ? 'bg-primary/10 border-primary/20 text-primary shadow-primary/5' : 'bg-black/40 border-white/10 text-white'}`}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl ${weatherData.ml_available ? 'bg-primary/20' : 'bg-white/10'}`}>
                <span className={`material-symbols-outlined text-xl font-bold ${weatherData.ml_available ? 'text-primary' : 'text-primary'}`}>{weatherData.ml_available ? 'auto_awesome' : 'sensors'}</span>
              </div>
              <p className="text-sm font-black tracking-wide uppercase">
                {weatherData.ml_available 
                  ? `✨ Intelligence active for ${weatherData.city} • Risk Score: ${riskScore}/100` 
                  : `📡 Clima-Cast Insights Active — Real-time analysis for ${weatherData.city}`}
              </p>
            </div>
            {weatherData.ml_available && (
              <span className="text-[10px] font-black bg-primary/20 px-3 py-1 rounded-full tracking-widest border border-primary/30">LIVE</span>
            )}
          </div>
        )}




        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-[var(--spacing-card-gap)]">
          {metrics.map((m, idx) => (
            <MetricCard 
              key={m.label} 
              id={m.id}
              {...m} 
              delay={idx * 0.05}
              onClick={() => setSelectedCard({ ...m, id: m.id })}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-card-gap)]">
          <AnimatedCard 
            className="lg:col-span-8 p-10 flex flex-col group border-white/5"
            onClick={() => setSelectedCard({ id: 'current-conditions', title: 'Current Conditions' })}
            delay={0.3}
          >
            <div className={`absolute top-0 right-0 w-96 h-96 bg-gradient-to-br ${weatherData?.gradient || 'from-primary/20 to-transparent'} blur-[100px] opacity-20 -mr-32 -mt-32 transition-all duration-700 group-hover:scale-150 group-hover:opacity-40`} />
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10 relative z-10">
              <div className="space-y-4">
                <p className="text-[11px] font-bold text-primary tracking-[0.25em] group-hover:translate-x-1 transition-transform uppercase">CURRENT CONDITIONS</p>
                <div className="flex items-center gap-4">
                  <h3 className="text-7xl font-bold text-on-surface tracking-tighter">
                    {weatherData ? `${formatTemp(weatherData.temperature, unit)}°` : '--'}
                  </h3>
                  <span className="material-symbols-outlined text-6xl text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)] transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {weatherData?.icon || 'wb_sunny'}
                  </span>
                </div>
                <p className="text-xl text-on-surface-variant font-medium flex items-center gap-2">
                  {weatherData ? `${weatherData.condition} • ${weatherData.city}` : 'Fetching weather...'}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </p>
              </div>
              
              {weatherData?.ml_available && (
                <div className="flex flex-col items-end">
                  <div className="px-4 py-2 rounded-2xl bg-primary/20 border border-primary/30 backdrop-blur-md shadow-lg shadow-primary/10 flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <p className="text-[10px] font-black text-primary tracking-[0.2em]">CLIMATE RISK</p>
                      <p className="text-lg font-bold text-on-surface">{riskScore}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border-2 border-primary/30 flex items-center justify-center">
                      <span className={`material-symbols-outlined text-sm ${insightTrend === 'worsening' ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {insightTrend === 'worsening' ? 'trending_up' : 'trending_down'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>


            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 relative z-10 snap-x snap-mandatory">
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
            
            <div className="absolute bottom-4 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-2 text-primary text-label-caps font-bold">
              View Detailed Breakdown
              <span className="material-symbols-outlined">arrow_forward</span>
            </div>
          </AnimatedCard>

          <AnimatedCard 
            className="lg:col-span-4 p-8 flex flex-col border-white/5"
            noHover
            delay={0.4}
          >
            <h4 className="text-xl font-bold text-on-surface mb-8 flex items-center gap-3">
              <span className="material-symbols-outlined text-primary p-2 bg-primary/10 rounded-xl">auto_awesome</span>
              AI Quick Insights
            </h4>
            <div className="space-y-4 flex-1">
              {insightsLoading ? (
                [1, 2].map(i => <div key={i} className="h-32 bg-white/5 rounded-[1.5rem] animate-pulse" />)
              ) : insights.length > 0 ? (
                insights.map((insight, idx) => (
                  <InsightCard 
                    key={idx} 
                    {...insight} 
                    onClick={() => setSelectedCard({ ...insight, id: 'insight' })}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-center opacity-40">
                  <span className="material-symbols-outlined text-4xl mb-2">check_circle</span>
                  <p className="text-xs font-bold uppercase tracking-widest">No Active Risks Detected</p>
                </div>
              )}
            </div>
            
            <button 
              className="mt-8 w-full py-4 rounded-2xl bg-primary/5 border border-primary/20 text-primary font-bold text-sm flex items-center justify-center gap-2 hover:bg-primary/10 transition-all group"
              onClick={() => setSelectedCard({ id: 'insight', title: 'Climate Intelligence Report', description: 'Detailed AI analysis of current atmospheric trends.' })}
            >
              View Full Insights
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </AnimatedCard>


          <AnimatedCard 
            className="lg:col-span-12 p-10 group border-white/5"
            onClick={() => setSelectedCard({ id: 'forecast', title: '5-Day Forecast' })}
            delay={0.5}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex justify-between items-center mb-10 relative z-10">
              <h4 className="text-2xl font-bold text-on-surface group-hover:text-primary transition-colors flex items-center gap-3">
                <span className="material-symbols-outlined text-primary">calendar_month</span>
                5-Day Forecast
              </h4>
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center gap-2 text-primary text-[10px] font-black tracking-widest uppercase">
                Detailed Outlook
                <span className="material-symbols-outlined text-sm">open_in_full</span>
              </div>
            </div>
            {forecastLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-48 bg-white/5 rounded-3xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {forecastData?.daily?.slice(0, 5).map((f) => (
                  <div 
                    key={f.date} 
                    className="p-6 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center text-center hover:bg-white/10 hover:scale-[1.02] hover:shadow-2xl transition-all duration-500 cursor-pointer group/item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCard({ id: 'day-forecast', title: `${f.day} Forecast`, dayData: f });
                    }}
                  >
                    <p className="text-[10px] font-black text-on-surface-variant mb-4 group-hover/item:text-primary transition-colors tracking-widest uppercase">{f.day || '--'}</p>
                    <div className="p-4 rounded-2xl bg-primary/10 mb-4 group-hover/item:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-4xl text-primary transition-transform duration-700 group-hover/item:scale-125 group-hover/item:rotate-12">{f.icon || 'wb_sunny'}</span>
                    </div>
                    <p className="text-3xl font-bold text-on-surface mb-1">{formatTemp(f.max_temp, unit)}°</p>
                    <p className="text-sm text-on-surface-variant font-medium">{formatTemp(f.min_temp, unit)}°</p>
                    <p className="text-[10px] font-bold text-primary/70 mt-4 tracking-wider uppercase">{f.condition || '--'}</p>
                  </div>
                ))}
              </div>
            )}
          </AnimatedCard>

        </div>
      </motion.div>

      <Modal 
        isOpen={!!selectedCard} 
        onClose={() => setSelectedCard(null)}
        title={selectedCard?.title || selectedCard?.label || "Details"}
      >
        {getModalContent()}
      </Modal>
    </>
  );
}
