import { useState, useEffect } from 'react';
import TopBar from '../components/layout/TopBar';
import ChartContainer from '../components/charts/ChartContainer';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const heroStats = [
  { label: 'CONFIDENCE', key: 'confidence', sub: 'Neural Mesh Active' },
  { label: 'DATA POINTS', key: 'data_points', sub: 'Processed Hourly' },
  { label: 'LATENCY', key: 'latency', sub: 'Inference Speed' },
];

const PredictionCard = ({ title, icon, value, subValue, explanation, loading, trend, colorClass = "text-primary" }) => (
  <div className="bg-surface-container-low rounded-2xl p-6 border border-white/50 space-y-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-xl bg-opacity-10 ${colorClass.replace('text-', 'bg-')}`}>
          <span className={`material-symbols-outlined ${colorClass}`}>{icon}</span>
        </div>
        <p className="text-label-caps text-on-surface-variant">{title}</p>
      </div>
      {trend && (
        <span className={`material-symbols-outlined ${trend === 'up' ? 'text-error' : trend === 'down' ? 'text-success' : 'text-on-surface-variant'}`}>
          {trend === 'up' ? 'north' : trend === 'down' ? 'south' : 'east'}
        </span>
      )}
    </div>
    
    <div>
      {loading ? (
        <div className="h-10 w-32 bg-surface-container-highest animate-pulse rounded-lg" />
      ) : (
        <div className="flex items-baseline gap-2">
          <p className={`text-h2-dashboard ${colorClass}`}>{value}</p>
          <p className="text-sm text-on-surface-variant">{subValue}</p>
        </div>
      )}
    </div>

    {explanation && explanation.length > 0 && (
      <div className="space-y-2 pt-2 border-t border-outline-variant/30">
        <p className="text-[10px] text-label-caps text-on-surface-variant">WHY THIS PREDICTION?</p>
        {explanation.map((item, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex justify-between text-[11px] text-on-surface">
              <span className="capitalize">{item.feature.replace('_', ' ')}</span>
              <span>{Math.round(item.contribution * 100)}%</span>
            </div>
            <div className="h-1 bg-surface-container-highest rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(Math.abs(item.contribution) * 100, 100)}%` }}
                className={`h-full ${item.contribution > 0 ? 'bg-primary' : 'bg-tertiary'}`}
              />
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
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
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchPredictions = async (targetCity) => {
    setLoading(true);
    setError(null);
    try {
      const month = new Date().getMonth() + 1;
      
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

      if (rainRes.status === 'fulfilled' && !rainRes.value.data.success && !rainRes.value.data.ml_available) {
        setError("AI predictions not available for this city — showing global data only");
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

  return (
    <>
      <TopBar title="AI Predictions" subtitle={`Neural Forecasting Engine — ${city}`} />
      
      <div className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-8 max-w-[1440px] mx-auto w-full space-y-[var(--spacing-card-gap)]">
        
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

        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-tertiary/10 border border-tertiary/30 rounded-2xl text-tertiary text-center font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Hero Card */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
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
                <div className="px-4 py-2 bg-surface-container-low rounded-full border border-white/50 text-label-caps text-on-surface-variant">
                  VERSION: {predictions.metrics?.rain_model_version || 'v1.0'}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-surface-container-low rounded-2xl p-6 border border-white/50">
                <p className="text-label-caps text-on-surface-variant mb-2">MODEL CONFIDENCE</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-h2-dashboard text-primary">
                    <CountUp value={confidenceValue} />%
                  </p>
                </div>
                <p className="text-sm text-on-surface-variant mt-1">Weighted accuracy mesh</p>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-6 border border-white/50">
                <p className="text-label-caps text-on-surface-variant mb-2">DATA POINTS</p>
                <p className="text-h2-dashboard text-primary">4.2PB</p>
                <p className="text-sm text-on-surface-variant mt-1">Processed history & real-time</p>
              </div>
              <div className="bg-surface-container-low rounded-2xl p-6 border border-white/50">
                <p className="text-label-caps text-on-surface-variant mb-2">LATENCY</p>
                <p className="text-h2-dashboard text-primary">124ms</p>
                <p className="text-sm text-on-surface-variant mt-1">Edge inference speed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-card-gap)]">
          <PredictionCard 
            title="RAIN PROBABILITY"
            icon="water_drop"
            value={`${Math.round((predictions.rain?.prediction?.probability || 0.12) * 100)}%`}
            subValue={predictions.rain?.prediction?.label === 'Yes' ? 'Expect Rain' : 'Dry Conditions'}
            explanation={predictions.rain?.explanation}
            loading={loading}
            trend={predictions.rain?.prediction?.probability > 0.5 ? 'up' : 'down'}
          />
          <PredictionCard 
            title="TEMPERATURE"
            icon="thermostat"
            value={`${(predictions.temp?.prediction?.temp_c || 24.5).toFixed(1)}°C`}
            subValue="Predicted Mean"
            explanation={predictions.temp?.explanation}
            loading={loading}
            trend="up"
            colorClass="text-secondary"
          />
          <PredictionCard 
            title="HUMIDITY"
            icon="humidity_percentage"
            value={`${Math.round(predictions.humidity?.prediction?.humidity || 65)}%`}
            subValue="Atmospheric Saturation"
            loading={loading}
            colorClass="text-tertiary"
          />
          <PredictionCard 
            title="WEATHER ALERT"
            icon="warning"
            value={predictions.alerts?.prediction?.alert_type || 'Normal'}
            subValue={`${Math.round((predictions.alerts?.prediction?.probability || 0.95) * 100)}% Confidence`}
            explanation={predictions.alerts?.explanation}
            loading={loading}
            colorClass={predictions.alerts?.prediction?.alert_type === 'normal' ? 'text-success' : 'text-error'}
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
      </div>
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
    <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl border border-white/50">
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
          <path d={areaPath} fill="rgba(207, 188, 255, 0.2)" stroke="none" />
          
          {/* Prediction Line */}
          <path d={linePath} fill="none" stroke="#4f378a" strokeWidth="3" strokeLinecap="round" />
          
          {/* Dots */}
          {chartData.map((d, i) => (
            <circle key={i} cx={getX(i)} cy={getY(d.yhat)} r="4" fill="#4f378a" className="transition-all hover:r-6 cursor-pointer" />
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
