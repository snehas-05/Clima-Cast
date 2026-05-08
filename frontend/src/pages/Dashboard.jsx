import { useEffect, useState } from 'react';
import TopBar from '../components/layout/TopBar';
import MetricCard from '../components/cards/MetricCard';
import HourCard from '../components/cards/HourCard';
import InsightCard from '../components/cards/InsightCard';
import ForecastRow from '../components/cards/ForecastRow';
import ChartContainer from '../components/charts/ChartContainer';
import { useGPS } from '../hooks/useGPS';
import { useWeather } from '../hooks/useWeather';
import { LoadingSkeleton } from '../components/ui/LoadingSkeleton';

export default function Dashboard() {
  const { coordinates, loading: gpsLoading, error: gpsError, permissionDenied } = useGPS();
  const { data: weatherData, loading: weatherLoading, error: weatherError, staleCache, fetchWeather, fetchForecast } = useWeather();
  const [forecast, setForecast] = useState([]);
  const [forecastLoading, setForecastLoading] = useState(false);

  useEffect(() => {
    if (coordinates) {
      fetchWeather({ lat: coordinates.lat, lon: coordinates.lon });
    } else if (permissionDenied || gpsError) {
      // Fallback to a default city or let the user search
      // For now, let's just wait for weather data to handle the fallback city if implemented in backend
      fetchWeather({ city: 'Mumbai' }); // Example default fallback
    }
  }, [coordinates, gpsError, permissionDenied, fetchWeather]);

  useEffect(() => {
    if (weatherData?.city) {
      setForecastLoading(true);
      fetchForecast(weatherData.city).then(res => {
        if (res.success) {
          setForecast(res.data.forecast);
        }
        setForecastLoading(false);
      });
    }
  }, [weatherData?.city, fetchForecast]);

  if (gpsLoading || (weatherLoading && !weatherData)) {
    return (
      <div className="p-8">
        <LoadingSkeleton type="dashboard" />
      </div>
    );
  }

  const metrics = weatherData ? [
    { icon: 'device_thermostat', label: 'TEMPERATURE', value: `${weatherData.temperature}°${weatherData.unit === 'fahrenheit' ? 'F' : 'C'}`, trend: 'Live' },
    { icon: 'water_drop', label: 'HUMIDITY', value: `${weatherData.humidity}%`, trend: 'Normal', iconBg: 'bg-secondary/10', iconColor: 'text-secondary' },
    { icon: 'air', label: 'WIND SPEED', value: `${weatherData.wind_kph} km/h`, trend: 'Stable' },
    { icon: 'compress', label: 'PRESSURE', value: `${weatherData.pressure_mb} mb`, trend: 'Stable', iconBg: 'bg-tertiary/10', iconColor: 'text-tertiary' },
  ] : [];

  return (
    <>
      <TopBar title="Dashboard" subtitle={weatherData?.city || "Real-Time Overview"} />
      
      <div className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-8 max-w-[1440px] mx-auto w-full space-y-[var(--spacing-card-gap)]">
        
        {/* Alerts / Banners */}
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
                  : `📡 Showing Live API Forecast — AI predictions not yet available for this city`}
              </p>
            </div>
          </div>
        )}

        {permissionDenied && !weatherData && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
            <span className="material-symbols-outlined">location_off</span>
            <p className="text-body-md">Location permission denied. Showing fallback weather. You can search for your city above.</p>
          </div>
        )}

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-card-gap)]">
          {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-card-gap)]">
          {/* Main Weather Card */}
          <div className={`lg:col-span-8 glass-card rounded-3xl p-8 flex flex-col relative overflow-hidden`}>
            {/* Background Gradient Accent */}
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${weatherData?.gradient || 'from-primary/20 to-transparent'} blur-3xl opacity-30 -mr-20 -mt-20`} />
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8 relative z-10">
              <div>
                <p className="text-label-caps text-on-surface-variant mb-1">CURRENT CONDITIONS</p>
                <h3 className="text-h1-hero text-on-surface leading-none">
                  {weatherData ? `${weatherData.temperature}°${weatherData.unit === 'fahrenheit' ? 'F' : 'C'}` : '--'}
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

            {/* Placeholder for Hourly (Will be hydrated in Phase 6) */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="min-w-[80px] h-24 bg-slate-800/40 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>

          {/* AI Quick Insights (Placeholder for now) */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-8 flex flex-col">
            <h4 className="text-h3-card-title text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              AI Quick Insights
            </h4>
            <div className="space-y-6 flex-1">
              {!weatherData?.ml_available ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-4">
                  <span className="material-symbols-outlined text-4xl text-slate-600 mb-2">visibility_off</span>
                  <p className="text-body-sm text-on-surface-variant">Insights are only available for cities supported by our ML model.</p>
                </div>
              ) : (
                <>
                  <InsightCard icon="psychology" iconBg="bg-primary/10" title="Model Availability" description={`Full prediction support active for ${weatherData.city}.`} />
                  <InsightCard icon="show_chart" iconBg="bg-tertiary/10" iconColor="text-tertiary" titleColor="text-tertiary" title="Trends" description="Historical patterns are being processed for upcoming predictions." />
                </>
              )}
            </div>
          </div>

          {/* 5-Day Forecast */}
          <div className="lg:col-span-12 glass-card rounded-3xl p-8">
            <h4 className="text-h3-card-title text-on-surface mb-6">5-Day Forecast</h4>
            {forecastLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-slate-800/40 rounded-xl animate-pulse" />)}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {forecast.map((f) => (
                  <div key={f.date} className="p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30 flex flex-col items-center text-center">
                    <p className="text-label-caps text-on-surface-variant mb-2">{f.day}</p>
                    <span className="material-symbols-outlined text-3xl text-primary mb-2">{f.icon}</span>
                    <p className="text-h3-card-title text-on-surface">{f.max_temp}°</p>
                    <p className="text-body-sm text-on-surface-variant">{f.min_temp}°</p>
                    <p className="text-[10px] text-primary/70 mt-2">{f.condition}</p>
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
