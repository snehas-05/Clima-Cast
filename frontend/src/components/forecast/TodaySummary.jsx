import React from 'react';
import WeatherIcon from './WeatherIcon';

const conditionGradients = {
  sunny: 'from-amber-400/20 via-orange-500/10 to-transparent',
  clear: 'from-blue-400/20 via-sky-500/10 to-transparent',
  clouds: 'from-slate-400/20 via-gray-500/10 to-transparent',
  cloudy: 'from-slate-400/20 via-gray-500/10 to-transparent',
  rain: 'from-blue-600/20 via-indigo-700/10 to-transparent',
  thunderstorm: 'from-purple-600/20 via-slate-900/10 to-transparent',
  snow: 'from-cyan-100/20 via-blue-200/10 to-transparent',
};

const TodaySummary = ({ city, today, unit }) => {
  if (!today) return null;

  const gradientClass = conditionGradients[today.condition?.toLowerCase()] || conditionGradients.clear;

  // Safe formatting helper
  const formatValue = (val) => {
    if (val === undefined || val === null || isNaN(val)) return '--';
    return Number(val).toFixed(0);
  };

  return (
    <div className={`glass-card rounded-3xl p-8 relative overflow-hidden transition-all duration-1000 bg-gradient-to-br ${gradientClass}`}>
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <WeatherIcon condition={today.condition} className="w-64 h-64" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">location_on</span>
          <span className="text-label-caps text-primary tracking-[0.2em]">{city?.toUpperCase()}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-8">
          <h2 className="text-[84px] font-bold text-on-surface tracking-tighter leading-none">
            {formatValue(today.high)}°
          </h2>
          <div className="pb-3">
            <p className="text-2xl font-medium text-on-surface-variant mb-1">{today.condition || '--'}</p>
            <p className="text-body-main text-on-surface-variant/60">{today.description || '--'}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-8">
          <div className="space-y-1">
            <p className="text-label-caps text-on-surface-variant/60">High / Low</p>
            <p className="text-lg font-bold text-on-surface">{formatValue(today.high)}° / {formatValue(today.low)}°</p>
          </div>
          <div className="space-y-1">
            <p className="text-label-caps text-on-surface-variant/60">Feels Like</p>
            <p className="text-lg font-bold text-on-surface">{formatValue(today.feels_like)}°</p>
          </div>
          <div className="space-y-1">
            <p className="text-label-caps text-on-surface-variant/60">Sunrise</p>
            <p className="text-lg font-bold text-on-surface">{today.sunrise || '--'}</p>
          </div>
          <div className="space-y-1">
            <p className="text-label-caps text-on-surface-variant/60">Sunset</p>
            <p className="text-lg font-bold text-on-surface">{today.sunset || '--'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaySummary;
