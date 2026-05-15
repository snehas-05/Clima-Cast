import React, { useState, useEffect, useMemo } from 'react';
import api from '../services/api';
import TopBar from '../components/layout/TopBar';
import MetricCard from '../components/cards/MetricCard';
import TempTrendChart from '../components/charts/TempTrendChart';
import HumidityChart from '../components/charts/HumidityChart';
import RainfallChart from '../components/charts/RainfallChart';
import PastFutureTimeline from '../components/charts/PastFutureTimeline';
import CityComparison from '../components/analytics/CityComparison';
import SeasonalInsights from '../components/analytics/SeasonalInsights';
import { motion } from 'framer-motion';

export default function Analytics() {
  const [selectedCity, setSelectedCity] = useState('Mumbai');
  const [supportedCities, setSupportedCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    history: [],
    trends: [],
    seasonal: [],
    pastFuture: []
  });

  useEffect(() => {
    // Fetch supported cities
    api.get('/weather/supported-cities')
      .then(res => setSupportedCities(res.data.cities || []))
      .catch(err => console.error('Error fetching supported cities:', err));
  }, []);

  const fetchAnalyticsData = async (city) => {
    setLoading(true);
    try {
      const [history, trends, seasonal, pastFuture] = await Promise.all([
        api.get(`/analytics/history?city=${city}`),
        api.get(`/analytics/trends?city=${city}`),
        api.get(`/analytics/seasonal?city=${city}`),
        api.get(`/analytics/past-future?city=${city}`)
      ]);

      setData({
        history: history.data,
        trends: trends.data,
        seasonal: seasonal.data,
        pastFuture: pastFuture.data
      });
    } catch (err) {
      console.error('Error fetching analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData(selectedCity);
  }, [selectedCity]);

  // Compute metrics based on data
  const metrics = useMemo(() => {
    if (!data.history.length) return [
      { icon: 'device_thermostat', label: 'MEAN TEMP', value: '--', trend: '0%', trendDirection: 'neutral' },
      { icon: 'water_drop', label: 'AVG HUMIDITY', value: '--', trend: '0%', trendDirection: 'neutral' },
      { icon: 'umbrella', label: 'ANNUAL PRECIP', value: '--', trend: '0%', trendDirection: 'neutral' },
      { icon: 'show_chart', label: 'DATA POINTS', value: '0', trend: 'Historical', trendDirection: 'up' },
    ];

    const latest = data.history[data.history.length - 1];
    const prev = data.history[data.history.length - 2] || latest;
    
    const tempTrend = ((latest.avg_temp - prev.avg_temp) / prev.avg_temp * 100).toFixed(1);
    
    return [
      { 
        icon: 'device_thermostat', 
        label: 'MEAN TEMP', 
        value: `${latest.avg_temp.toFixed(1)}°C`, 
        trend: `${tempTrend > 0 ? '+' : ''}${tempTrend}%`, 
        trendDirection: tempTrend > 0 ? 'up' : 'down' 
      },
      { 
        icon: 'water_drop', 
        label: 'AVG HUMIDITY', 
        value: `${latest.avg_humidity.toFixed(0)}%`, 
        trend: 'Stable', 
        trendDirection: 'neutral',
        iconBg: 'bg-cyan-100',
        iconColor: 'text-cyan-600'
      },
      { 
        icon: 'umbrella', 
        label: 'DATA POINTS', 
        value: data.history.length.toString(), 
        trend: 'Years', 
        trendDirection: 'up',
        iconBg: 'bg-indigo-100',
        iconColor: 'text-indigo-600'
      },
      { 
        icon: 'verified', 
        label: 'MODEL READY', 
        value: 'YES', 
        trend: 'Prophet', 
        trendDirection: 'up',
        iconBg: 'bg-amber-100',
        iconColor: 'text-amber-600'
      },
    ];
  }, [data.history]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-[#F8FAFC]">
      <TopBar title="Climate Intelligence" subtitle="Advanced Analytics & ML Forecasting" />
      
      <div className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-8 max-w-[1440px] mx-auto w-full space-y-8">
        
        {/* Global City Selector */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-white/40 shadow-sm">
            <div>
                <h2 className="text-xl font-bold text-on-surface">Regional Analytics</h2>
                <p className="text-sm text-on-surface-variant/60">Select a city to explore historical trends and future predictions</p>
            </div>
            <select 
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full sm:w-64 px-4 py-2.5 bg-white border border-outline-variant/30 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold text-on-surface cursor-pointer"
            >
                {supportedCities.map(city => (
                    <option key={city} value={city}>{city}</option>
                ))}
            </select>
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && !data.history.length ? (
            <>
              <MetricCard loading={true} />
              <MetricCard loading={true} />
              <MetricCard loading={true} />
              <MetricCard loading={true} />
            </>
          ) : (
            metrics.map((m) => <MetricCard key={m.label} {...m} loading={loading} />)
          )}
        </div>

        {/* Hero Section: Past + Future Timeline */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
        >
            <PastFutureTimeline data={data.pastFuture} loading={loading} />
        </motion.div>

        {/* Main Trends: TempTrendChart (Full Width) */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <TempTrendChart data={data.history} loading={loading} />
        </motion.div>

        {/* Side-by-Side: Humidity + Rainfall */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
            >
                <HumidityChart data={data.trends} loading={loading} />
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
            >
                <RainfallChart data={data.trends} loading={loading} />
            </motion.div>
        </div>

        {/* Seasonal Insights */}
        <section className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-primary rounded-full" />
                <h3 className="text-2xl font-bold text-on-surface">Seasonal Climate Distribution</h3>
            </div>
            <SeasonalInsights data={data.seasonal} loading={loading} />
        </section>

        {/* City Comparison (Flagship Interactivity) */}
        <section className="space-y-6 pt-8 border-t border-outline-variant/20">
            <div className="flex items-center gap-3">
                <div className="h-8 w-1 bg-tertiary rounded-full" />
                <h3 className="text-2xl font-bold text-on-surface">Comparative Intelligence</h3>
            </div>
            <CityComparison />
        </section>

      </div>
    </div>
  );
}
