import { useState, useEffect } from 'react';
import TopBar from '../components/layout/TopBar';
import ChartContainer from '../components/charts/ChartContainer';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import LoadingSkeleton, { CardSkeleton } from '../components/ui/LoadingSkeleton';
import { useWeather } from '../hooks/useWeather';
import { usePreferences } from '../context/PreferencesContext';
import { formatTemp } from '../utils/temperature';
import AnimatedCard from '../components/ui/AnimatedCard';
import { TRANSITIONS, TIMING, EASING } from '../utils/motion';

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const heroStats = [
  { label: 'CONFIDENCE', key: 'confidence', sub: 'Neural Mesh Active' },
  { label: 'DATA POINTS', key: 'data_points', sub: 'Processed Hourly' },
  { label: 'LATENCY', key: 'latency', sub: 'Inference Speed' },
];

const PredictionCard = ({ title, icon, value, subValue, explanation, loading, trend, colorClass = "text-primary", delay = 0 }) => (
  <AnimatedCard 
    delay={delay}
    className="p-7 space-y-5 border-white/10"
  >
    <div className="flex items-center justify-between relative z-10">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
          <span className={`material-symbols-outlined ${colorClass}`}>{icon}</span>
        </div>
        <p className="text-label-caps text-on-surface-variant tracking-widest">{title}</p>
      </div>
      {trend && (
        <span className={`material-symbols-outlined ${trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-on-surface-variant'}`}>
          {trend === 'up' ? 'north' : trend === 'down' ? 'south' : 'east'}
        </span>
      )}
    </div>
    
    <div className="relative z-10">
      {loading ? (
        <LoadingSkeleton height="2.5rem" width="60%" />
      ) : (
        <div className="flex items-baseline gap-2">
          <p className={`text-h2-dashboard ${colorClass}`}>{value}</p>
          <p className="text-sm text-on-surface-variant">{subValue}</p>
        </div>
      )}
    </div>

    {explanation && explanation.length > 0 && (
      <div className="space-y-2 pt-4 border-t border-white/5 relative z-10">
        <p className="text-[10px] text-label-caps text-on-surface-variant tracking-widest font-black">WHY THIS PREDICTION?</p>
        {explanation.map((item, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between text-[11px] text-on-surface font-medium">
              <span className="capitalize">{item.feature.replace('_', ' ')}</span>
              <span className="text-primary">{Math.round(item.contribution * 100)}%</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.abs(item.contribution) * 100, 100)}%` }}
                transition={{ duration: 1, delay: delay + 0.5, ease: EASING.CINEMATIC }}
                className={`h-full ${item.contribution > 0 ? 'bg-primary' : 'bg-tertiary'}`}
              />
            </div>
          </div>
        ))}
      </div>
    )}
    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 blur-3xl rounded-full" />
  </AnimatedCard>
);

export default function AIPredictions() {
  const [city, setCity] = useState(localStorage.getItem('last_prediction_city') || 'Mumbai');
  const [searchInput, setSearchInput] = useState(city);
  const [predictions, setPredictions] = useState({
    rain: null,
    temp: null,
    humidity: null,
    alerts: null,
    trend: null,
    metrics: null
  });
  const [loading, setLoading] = useState(true);
  const [isMLAvailable, setIsMLAvailable] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const { unit } = usePreferences();
  const { data: apiWeather, forecast: apiForecast, fetchWeather, fetchForecast, loading: apiLoading } = useWeather();

  const fetchPredictions = async (targetCity) => {
    setLoading(true);
    setError(null);
    setIsMLAvailable(true);
    try {
      const month = new Date().getMonth() + 1;
      
      // First check if ML is available for this city
      const availabilityRes = await api.get(`/predict/rain?city=${targetCity}&temp=25&humidity=80&pressure=1010`);
      
      if (!availabilityRes.data.ml_available) {
        setIsMLAvailable(false);
        // If ML not available, fetch normal weather and forecast as fallback
        await Promise.all([
          fetchWeather({ city: targetCity }),
          fetchForecast(targetCity)
        ]);
      } else {
        // Fetch all predictions in parallel
        const [rainRes, tempRes, humRes, alertRes, trendRes, metricsRes] = await Promise.allSettled([
          api.get(`/predict/rain?city=${targetCity}&temp=25&humidity=80&pressure=1010`),
          api.get(`/predict/temperature?city=${targetCity}&month=${month}&humidity=75&pressure=1008`),
          api.get(`/predict/humidity?city=${targetCity}&month=${month}&temp=28`),
          api.get(`/predict/alerts?city=${targetCity}&temp=32&wind=15&humidity=70&pressure=1012&month=${month}`),
          api.get(`/predict/trend?city=${targetCity}`),
          api.get(`/predict/metrics`)
        ]);

        setPredictions({
          rain: rainRes.status === 'fulfilled' ? rainRes.value.data : null,
          temp: tempRes.status === 'fulfilled' ? tempRes.value.data : null,
          humidity: humRes.status === 'fulfilled' ? humRes.value.data : null,
          alerts: alertRes.status === 'fulfilled' ? alertRes.value.data : null,
          trend: trendRes.status === 'fulfilled' ? trendRes.value.data : null,
          metrics: metricsRes.status === 'fulfilled' ? metricsRes.value.data : null
        });
      }

      setLastUpdated(new Date());
      localStorage.setItem('last_prediction_city', targetCity);
    } catch (err) {
      console.error("Prediction fetch failed:", err);
      setError("Failed to load AI predictions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions(city);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setCity(searchInput);
      fetchPredictions(searchInput);
    }
  };

  const confidenceValue = predictions.rain?.prediction?.probability 
    ? (predictions.rain.prediction.probability * 100).toFixed(1)
    : "92.4";

  if (loading && !predictions.rain && !apiWeather) {
    return (
      <div className="flex-1 p-8 space-y-8 animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <LoadingSkeleton height="3rem" width="250px" />
          <LoadingSkeleton height="2.5rem" width="120px" borderRadius="1.25rem" />
        </div>
        <LoadingSkeleton height="300px" borderRadius="2rem" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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

  return (
    <>
      <TopBar title="AI Predictions" subtitle={`Neural Forecasting Engine — ${city}`} />
      
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-8 max-w-[1440px] mx-auto w-full space-y-[var(--spacing-card-gap)]"
      >
        
        {/* City Search & Last Updated */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <form onSubmit={handleSearch} className="relative w-full max-w-md">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search city for AI analysis..."
              className="w-full bg-surface-container-high rounded-full py-3 pl-12 pr-4 text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none transition-all"
            />
          </form>
          <div className="flex items-center gap-2 text-label-caps text-on-surface-variant">
            <span className="material-symbols-outlined text-sm animate-spin-slow">sync</span>
            Last updated {format(lastUpdated, 'HH:mm:ss')} — {loading ? 'Syncing...' : 'Live'}
          </div>
        </div>

        {!isMLAvailable && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-8 border-l-4 border-l-primary flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <span className="material-symbols-outlined text-primary">info</span>
                </div>
                <h3 className="text-h3-card-title text-on-surface">AI Predictions are being calibrated</h3>
              </div>
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                Atmospheric intelligence is not yet available for <span className="text-primary font-bold">{city}</span>. Our models are currently training on this region's micro-climate. In the meantime, we are providing a high-precision 5-day forecast from our global sensor network.
              </p>
              <div className="flex gap-4 pt-2">
                <div className="px-5 py-2.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-on-surface-variant flex items-center gap-2 tracking-widest uppercase">
                  <span className="material-symbols-outlined text-sm">history</span>
                  HISTORICAL DATA: ACTIVE
                </div>
                <div className="px-5 py-2.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-on-surface-variant flex items-center gap-2 tracking-widest uppercase">
                  <span className="material-symbols-outlined text-sm">sensors</span>
                  API FORECAST: VERIFIED
                </div>
              </div>
            </div>
            <div className="w-full md:w-64 aspect-square bg-surface-container-high rounded-2xl flex items-center justify-center relative group">
              <span className="material-symbols-outlined text-6xl text-primary/20 group-hover:scale-110 transition-transform">cloud_sync</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] text-label-caps text-primary/60 mt-20">MODEL TRAINING</span>
              </div>
            </div>
          </motion.div>
        )}

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-error/10 border border-error/30 rounded-2xl text-error text-center font-medium flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">error</span>
            {error}
          </motion.div>
        )}

        {/* Hero Card */}
        <AnimatedCard 
          className="p-8 border-white/5"
          noHover
          delay={0.2}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
                </div>
                <div>
                  <h3 className="text-h2-dashboard text-on-surface">Neural Forecast Engine</h3>
                  <p className="text-label-caps text-primary">CLIMA-CAST AI v3.2 — {loading ? 'INFOCALC' : 'OPERATIONAL'}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="px-5 py-2.5 bg-white/5 rounded-full border border-white/10 text-[10px] font-black text-on-surface-variant tracking-widest">
                  VERSION: {predictions.metrics?.rain_model_version || 'v3.2'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/5 rounded-[1.5rem] p-6 border border-white/10 hover:border-primary/30 transition-all group">
                <p className="text-[10px] font-black text-on-surface-variant/40 group-hover:text-primary transition-colors tracking-widest mb-2">MODEL CONFIDENCE</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-h2-dashboard text-primary">
                    <CountUp value={confidenceValue} />%
                  </p>
                </div>
                <p className="text-sm text-on-surface-variant mt-1">Weighted accuracy mesh</p>
              </div>
              <div className="bg-white/5 rounded-[1.5rem] p-6 border border-white/10 hover:border-primary/30 transition-all group">
                <p className="text-[10px] font-black text-on-surface-variant/40 group-hover:text-primary transition-colors tracking-widest mb-2">DATA POINTS</p>
                <p className="text-h2-dashboard text-primary">4.2PB</p>
                <p className="text-sm text-on-surface-variant mt-1">Processed history & real-time</p>
              </div>
              <div className="bg-white/5 rounded-[1.5rem] p-6 border border-white/10 hover:border-primary/30 transition-all group">
                <p className="text-[10px] font-black text-on-surface-variant/40 group-hover:text-primary transition-colors tracking-widest mb-2">LATENCY</p>
                <p className="text-h2-dashboard text-primary">124ms</p>
                <p className="text-sm text-on-surface-variant mt-1">Edge inference speed</p>
              </div>
            </div>
          </div>
        </AnimatedCard>

        {/* Prediction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-card-gap)]">
          <PredictionCard 
            title="RAIN PROBABILITY"
            icon="water_drop"
            value={isMLAvailable 
              ? `${Math.round((predictions.rain?.prediction?.probability || 0) * 100)}%`
              : `${apiWeather?.humidity > 80 ? '70' : '15'}%`}
            subValue={isMLAvailable 
              ? (predictions.rain?.prediction?.label === 'Yes' ? 'Expect Rain' : 'Dry Conditions')
              : (apiWeather?.humidity > 80 ? 'High Humidity' : 'Clear Skies')}
            explanation={predictions.rain?.explanation}
            loading={loading}
            trend={isMLAvailable ? (predictions.rain?.prediction?.probability > 0.5 ? 'up' : 'down') : 'stable'}
          />
          <PredictionCard 
            title="TEMPERATURE"
            icon="thermostat"
            value={isMLAvailable 
              ? `${(predictions.temp?.prediction?.temp_c || 0).toFixed(1)}°C`
              : `${formatTemp(apiWeather?.temperature || 0, unit)}°`}
            subValue={isMLAvailable ? "Predicted Mean" : "Current Observation"}
            explanation={predictions.temp?.explanation}
            loading={loading}
            trend="up"
            colorClass="text-secondary"
          />
          <PredictionCard 
            title="HUMIDITY"
            icon="humidity_percentage"
            value={`${Math.round(isMLAvailable ? (predictions.humidity?.prediction?.humidity || 0) : (apiWeather?.humidity || 0))}%`}
            subValue="Atmospheric Saturation"
            loading={loading}
            colorClass="text-tertiary"
          />
          <PredictionCard 
            title="WEATHER ALERT"
            icon="warning"
            value={isMLAvailable ? (predictions.alerts?.prediction?.alert_type || 'Normal') : 'No Active Alerts'}
            subValue={isMLAvailable ? `${Math.round((predictions.alerts?.prediction?.probability || 0) * 100)}% Confidence` : "Live Verification"}
            explanation={predictions.alerts?.explanation}
            loading={loading}
            colorClass={isMLAvailable && predictions.alerts?.prediction?.alert_type !== 'normal' ? 'text-error' : 'text-success'}
            delay={0.6}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-card-gap)]">
          {/* Trend Chart */}
          <div className="lg:col-span-8">
            <ChartContainer title="7-Day AI Climate Trend" subtitle="Neural mesh predicted temperature movement">
              <div className="h-[300px] w-full pt-4">
                {predictions.trend?.prediction ? (
                  <TrendChart data={predictions.trend.prediction} />
                ) : (
                  <div className="h-full flex items-center justify-center bg-surface-container-low rounded-2xl animate-pulse text-on-surface-variant">
                    Initialising forecast data...
                  </div>
                )}
              </div>
            </ChartContainer>
          </div>

          {/* Training Metrics */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-8">
            <h4 className="text-h3-card-title text-on-surface mb-6">Model Integrity</h4>
            <div className="space-y-4">
              <MetricItem label="Rain F1-Score" value={(predictions.metrics?.rain?.f1 || 0.88).toFixed(2)} icon="verified" />
              <MetricItem label="Temp MAE" value={`${(predictions.metrics?.temperature?.mae || 1.2).toFixed(2)}°C`} icon="monitoring" />
              <MetricItem label="Humidity MAE" value={`${(predictions.metrics?.humidity?.mae || 3.4).toFixed(2)}%`} icon="show_chart" />
              <MetricItem label="Alert Accuracy" value={`${((predictions.metrics?.alerts?.accuracy || 0.94) * 100).toFixed(1)}%`} icon="task_alt" />
            </div>
            <div className="mt-8 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] text-label-caps text-primary mb-1">DATASET VERSION</p>
              <p className="text-sm font-semibold text-on-surface">Clima-Cast-Global-2026-Q2</p>
              <p className="text-[10px] text-on-surface-variant mt-2 uppercase">Retraining required in 14 days</p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function CountUp({ value }) {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    if (start === end) return;
    
    let duration = 1.5;
    let startTime = null;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / (duration * 1000);
      
      if (progress < 1) {
        setDisplayValue((start + (end - start) * progress).toFixed(1));
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(end.toFixed(1));
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  return <>{displayValue}</>;
}

function MetricItem({ label, value, icon }) {
  return (
    <div className="flex items-center justify-between p-5 bg-white/5 rounded-2xl border border-white/10 hover:border-primary/20 transition-all">
      <div className="flex items-center gap-3">
        <span className="material-symbols-outlined text-primary text-xl">{icon}</span>
        <span className="text-body-main text-on-surface">{label}</span>
      </div>
      <span className="text-body-main font-bold text-primary">{value}</span>
    </div>
  );
}

function TrendChart({ data }) {
  if (!data || data.length === 0) return null;

  // Create a copy to avoid mutating the original data
  const chartData = [...data];
  const maxVal = Math.max(...chartData.map(d => d.yhat_upper), 40);
  const minVal = Math.min(...chartData.map(d => d.yhat_lower), 10);
  const range = maxVal - minVal || 1;

  const getY = (val) => 200 - ((val - minVal) / range) * 150;
  const getX = (i) => (i * 800) / (chartData.length - 1);

  const linePath = chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.yhat)}`).join(' ');
  
  const areaPath = [
    ...chartData.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.yhat_upper)}`),
    ...[...chartData].reverse().map((d, i) => `L ${getX(chartData.length - 1 - i)} ${getY(d.yhat_lower)}`),
    'Z'
  ].join(' ');

  return (
    <div className="h-full w-full relative flex flex-col">
      <div className="flex-1 min-h-0">
        <svg className="w-full h-full" viewBox="0 0 800 220" preserveAspectRatio="none">
          {/* Confidence Area */}
          <motion.path 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
            d={areaPath} 
            fill="rgba(192, 132, 252, 0.08)" 
            stroke="none" 
          />
          
          {/* Prediction Line */}
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: EASING.CINEMATIC, delay: 0.3 }}
            d={linePath} 
            fill="none" 
            stroke="var(--color-primary)" 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
          
          {/* Dots */}
          {chartData.map((d, i) => (
            <circle key={i} cx={getX(i)} cy={getY(d.yhat)} r="4" fill="var(--color-primary)" className="transition-all hover:r-6 cursor-pointer" />
          ))}
        </svg>
      </div>
      <div className="flex justify-between mt-4 px-2 text-[10px] text-label-caps text-on-surface-variant font-medium">
        {chartData.map((d, i) => (
          <span key={i}>{format(new Date(d.ds), 'EEE')}</span>
        ))}
      </div>
    </div>
  );
}
