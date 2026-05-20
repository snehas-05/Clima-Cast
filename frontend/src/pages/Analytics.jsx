import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
import AnimatedCard from '../components/ui/AnimatedCard';
import { TRANSITIONS, TIMING, EASING } from '../utils/motion';
import { useWeatherContext } from '../context/WeatherContext';
import { usePreferences } from '../context/PreferencesContext';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Analytics() {
  const { activeCity } = useWeatherContext();
  const { unit } = usePreferences();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    history: [],
    trends: [],
    seasonal: [],
    pastFuture: []
  });

  const fetchAnalyticsData = useCallback(async (city) => {
    if (!city) return;
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
  }, []);

  useEffect(() => {
    fetchAnalyticsData(activeCity);
  }, [activeCity, fetchAnalyticsData]);

  // Compute metrics based on data
  const metrics = useMemo(() => {
    if (!data.history || !data.history.length) return [
      { icon: 'device_thermostat', label: 'MEAN TEMP', value: '--', trend: '0%', trendDirection: 'neutral' },
      { icon: 'water_drop', label: 'AVG HUMIDITY', value: '--', trend: '0%', trendDirection: 'neutral' },
      { icon: 'umbrella', label: 'ANNUAL PRECIP', value: '--', trend: '0%', trendDirection: 'neutral' },
      { icon: 'show_chart', label: 'DATA POINTS', value: '0', trend: 'Historical', trendDirection: 'up' },
    ];

    const latest = data.history[data.history.length - 1];
    const prev = data.history[data.history.length - 2] || latest;
    
    const tempTrend = prev.avg_temp !== 0 ? ((latest.avg_temp - prev.avg_temp) / prev.avg_temp * 100).toFixed(1) : 0;
    
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
        iconBg: 'bg-cyan-100/10',
        iconColor: 'text-cyan-400'
      },
      { 
        icon: 'umbrella', 
        label: 'DATA POINTS', 
        value: data.history.length.toString(), 
        trend: 'Years', 
        trendDirection: 'up',
        iconBg: 'bg-indigo-100/10',
        iconColor: 'text-indigo-400'
      },
      { 
        icon: 'verified', 
        label: 'MODEL READY', 
        value: 'YES', 
        trend: 'Prophet', 
        trendDirection: 'up',
        iconBg: 'bg-amber-100/10',
        iconColor: 'text-amber-400'
      },
    ];
  }, [data.history]);

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-background">
      <TopBar title="Climate Intelligence" subtitle={`Grounding analysis for ${activeCity}`} />
      
      <motion.div 
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="dashboard-shell dashboard-stack"
      >
        
        {/* Intelligence Context Header */}
        <AnimatedCard 
          className="card-pad-lg border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-transparent"
          noHover
          delay={0.1}
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
              <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Intelligence Context</span>
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(56,189,248,0.35)]" />
                  </div>
                  <h2 className="text-4xl font-black text-on-surface tracking-tighter">
                    {activeCity} <span className="text-on-surface-variant/40 font-light">Regional Model</span>
                  </h2>
                  <p className="text-sm text-on-surface-variant/60 font-medium tracking-wide mt-2">Correlating historical patterns with short-term trajectories.</p>
              </div>
              <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md hidden md:block">
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Active Grounding</p>
                  <p className="text-xs font-medium text-primary">Synchronized with Dashboard</p>
              </div>
            </div>
        </AnimatedCard>

        {/* Metrics Section */}
        <div className="metric-grid grid-cols-2 lg:grid-cols-4">
          {loading && !data.history.length ? (
            <>
              <MetricCard loading={true} />
              <MetricCard loading={true} />
              <MetricCard loading={true} />
              <MetricCard loading={true} />
            </>
          ) : (
            metrics.map((m, idx) => <MetricCard key={m.label} {...m} loading={loading} delay={0.2 + idx * 0.05} />)
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[var(--spacing-card-gap)]">
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

      </motion.div>
    </div>
  );
}
