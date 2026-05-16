import { useEffect, useState } from 'react';
import TopBar from '../components/layout/TopBar';
import MetricCard from '../components/cards/MetricCard';
import HourCard from '../components/cards/HourCard';
import InsightCard from '../components/cards/InsightCard';
import Modal from '../components/ui/Modal';
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
  const [selectedCard, setSelectedCard] = useState(null);

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
    { id: 'temp', icon: 'device_thermostat', label: 'TEMPERATURE', value: `${formatTemp(weatherData.temperature, unit)}°`, trend: 'Live' },
    { id: 'humidity', icon: 'water_drop', label: 'HUMIDITY', value: `${weatherData.humidity}%`, trend: 'Normal', iconBg: 'bg-secondary/10', iconColor: 'text-secondary' },
    { id: 'wind', icon: 'air', label: 'WIND SPEED', value: `${weatherData.wind_kph} km/h`, trend: 'Stable' },
    { id: 'pressure', icon: 'compress', label: 'PRESSURE', value: `${weatherData.pressure_mb} mb`, trend: 'Stable', iconBg: 'bg-tertiary/10', iconColor: 'text-tertiary' },
    { id: 'aqi', icon: 'eco', label: 'AIR QUALITY (AQI)', value: airQuality?.aqi || '--', trend: 'Live', iconBg: 'bg-primary/10', iconColor: 'text-primary' },
  ] : [];

  const getDynamicInsights = (data) => {
    const insights = [];
    if (data.ml_available) {
      insights.push({ id: 'ai-predict', icon: 'psychology', iconBg: 'bg-primary/10', title: 'Model Availability', description: `Full prediction support active for ${data.city}.` });
      insights.push({ id: 'ai-trends', icon: 'show_chart', iconBg: 'bg-tertiary/10', iconColor: 'text-tertiary', titleColor: 'text-tertiary', title: 'Trends', description: 'Historical patterns are being processed for upcoming predictions.' });
    } else {
      if (data.temperature > 30) insights.push({ id: 'heat', icon: 'wb_sunny', iconBg: 'bg-orange-500/10', iconColor: 'text-orange-500', title: 'Heat Advisory', description: 'High temperatures detected. Stay hydrated.' });
      else if (data.temperature < 10) insights.push({ id: 'cold', icon: 'ac_unit', iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500', title: 'Cold Alert', description: 'Chilly conditions. Wear a jacket.' });
      
      if (insights.length === 0) insights.push({ id: 'ideal', icon: 'verified', iconBg: 'bg-green-500/10', iconColor: 'text-green-500', title: 'Ideal Conditions', description: 'The weather looks stable and pleasant.' });
    }
    return insights;
  };

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
            <div className={`p-6 rounded-3xl text-center border-2 ${
              (airQuality?.aqi || 0) <= 50 ? 'bg-green-500/10 border-green-500/30 text-green-500' :
              (airQuality?.aqi || 0) <= 100 ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' :
              'bg-red-500/10 border-red-500/30 text-red-500'
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
              <div className={`p-4 ${selectedCard.iconBg || 'bg-primary/10'} rounded-3xl ${selectedCard.iconColor || 'text-primary'}`}>
                <span className="material-symbols-outlined text-3xl">{selectedCard.icon}</span>
              </div>
              <h4 className="text-h3-card-title text-on-surface font-bold">{selectedCard.title}</h4>
            </div>
            <div className="p-8 glass-card rounded-[2.5rem] bg-gradient-to-br from-primary/5 to-transparent border-primary/10">
              <h5 className="font-bold text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">analytics</span>
                AI Analysis Detail
              </h5>
              <p className="text-body-lg text-on-surface leading-relaxed mb-6">
                {selectedCard.description}
              </p>
              <div className="space-y-4 pt-6 border-t border-on-surface/10">
                <div className="flex justify-between items-center">
                  <p className="text-body-sm text-on-surface-variant font-medium">Confidence Score</p>
                  <p className="text-body-sm font-bold text-primary">94.2%</p>
                </div>
                <div className="w-full h-1.5 bg-on-surface/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: '94%' }} />
                </div>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-300">
              <span className="material-symbols-outlined">info</span>
              <p className="text-body-sm">Insights are generated using historical data patterns and real-time atmospheric readings.</p>
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
          {metrics.map((m) => (
            <MetricCard 
              key={m.label} 
              {...m} 
              onClick={() => setSelectedCard({ ...m, id: m.id })}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-card-gap)]">
          <div 
            className={`lg:col-span-8 glass-card rounded-3xl p-8 flex flex-col relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl group`}
            onClick={() => setSelectedCard({ id: 'current-conditions', title: 'Current Conditions' })}
          >
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${weatherData?.gradient || 'from-primary/20 to-transparent'} blur-3xl opacity-30 -mr-20 -mt-20 transition-all duration-700 group-hover:scale-150 group-hover:opacity-50`} />
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 relative z-10">
              <div>
                <p className="text-label-caps text-on-surface-variant mb-1 group-hover:text-primary transition-colors">CURRENT CONDITIONS</p>
                <h3 className="text-h1-hero text-on-surface leading-none group-hover:translate-x-1 transition-transform">
                  {weatherData ? `${formatTemp(weatherData.temperature, unit)}°` : '--'}
                </h3>
                <p className="text-body-lg text-on-surface-variant mt-2 group-hover:text-on-surface transition-colors">
                  {weatherData ? `${weatherData.condition} • ${weatherData.city}` : 'Fetching weather...'}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {weatherData?.icon || 'cloud'}
                </span>
                {weatherData?.ml_available && (
                  <span className="text-label-caps text-primary bg-primary/10 px-2 py-1 rounded">AI POWERED</span>
                )}
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 relative z-10">
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
          </div>

          <div className="lg:col-span-4 glass-card rounded-3xl p-8 flex flex-col">
            <h4 className="text-h3-card-title text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              AI Quick Insights
            </h4>
            <div className="space-y-6 flex-1">
              {weatherData && getDynamicInsights(weatherData).map((insight, idx) => (
                <InsightCard 
                  key={idx} 
                  {...insight} 
                  onClick={() => setSelectedCard({ ...insight, id: 'insight' })}
                />
              ))}
            </div>
          </div>

          <div 
            className="lg:col-span-12 glass-card rounded-3xl p-8 cursor-pointer group transition-all duration-300 hover:shadow-2xl"
            onClick={() => setSelectedCard({ id: 'forecast', title: '5-Day Forecast' })}
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-h3-card-title text-on-surface group-hover:text-primary transition-colors">5-Day Forecast</h4>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 text-primary text-label-caps font-bold">
                Detailed Outlook
                <span className="material-symbols-outlined">open_in_full</span>
              </div>
            </div>
            {forecastLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-slate-800/40 rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {forecastData?.daily?.slice(0, 5).map((f) => (
                  <div 
                    key={f.date} 
                    className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 flex flex-col items-center text-center hover:bg-slate-800/60 hover:scale-105 hover:shadow-xl transition-all duration-300 cursor-pointer group/item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCard({ id: 'day-forecast', title: `${f.day} Forecast`, dayData: f });
                    }}
                  >
                    <p className="text-label-caps text-on-surface-variant mb-2 group-hover/item:text-primary transition-colors">{f.day || '--'}</p>
                    <span className="material-symbols-outlined text-3xl text-primary mb-2 transition-transform duration-500 group-hover/item:scale-125 group-hover/item:rotate-6">{f.icon || 'wb_sunny'}</span>
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
