import React from 'react';
import WeatherIcon from './WeatherIcon';
import { usePreferences } from '../../context/PreferencesContext';
import { formatTemp } from '../../utils/temperature';

const conditionGradients = {
  sunny: 'from-amber-400/20 via-orange-500/10 to-transparent',
  clear: 'from-blue-400/20 via-sky-500/10 to-transparent',
  clouds: 'from-slate-400/20 via-gray-500/10 to-transparent',
  cloudy: 'from-slate-400/20 via-gray-500/10 to-transparent',
  rain: 'from-blue-600/20 via-indigo-700/10 to-transparent',
  thunderstorm: 'from-purple-600/20 via-slate-900/10 to-transparent',
  snow: 'from-cyan-100/20 via-blue-200/10 to-transparent',
};

const TodaySummary = ({ city, today, onClick }) => {
  const { unit } = usePreferences();
  if (!today) return null;

  const gradientClass = conditionGradients[today.condition?.toLowerCase()] || conditionGradients.clear;

  return (
    <div 
      className={`glass-card rounded-[2.5rem] p-10 relative overflow-hidden transition-all duration-500 bg-gradient-to-br ${gradientClass} border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)] group ${onClick ? 'cursor-pointer hover:scale-[1.01] active:scale-[0.99]' : ''}`}
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
        <WeatherIcon condition={today.condition} className="w-80 h-80" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <span className="material-symbols-outlined text-primary text-xl">location_on</span>
          </div>
          <span className="text-label-caps text-primary tracking-[0.3em] font-bold">{city?.toUpperCase()}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-8 mb-10">
          <h2 className="text-[100px] font-black tracking-tighter leading-none bg-gradient-to-b from-on-surface to-on-surface/60 bg-clip-text text-transparent">
            {formatTemp(today.high, unit)}°
          </h2>
          <div className="pb-4">
            <p className="text-3xl font-bold text-on-surface mb-2">{today.condition || '--'}</p>
            <p className="text-on-surface-variant/80 font-medium text-lg italic">"{today.description || '--'}"</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/5 pt-10">
          <div className="space-y-2">
            <p className="text-[10px] text-label-caps text-on-surface-variant/40 font-black tracking-widest">HIGH / LOW</p>
            <p className="text-xl font-bold text-on-surface flex items-baseline gap-1">
              {formatTemp(today.high, unit)}° <span className="text-sm font-medium text-on-surface-variant/40">/ {formatTemp(today.low, unit)}°</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-label-caps text-on-surface-variant/40 font-black tracking-widest">FEELS LIKE</p>
            <p className="text-xl font-bold text-primary">{formatTemp(today.feels_like, unit)}°</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-label-caps text-on-surface-variant/40 font-black tracking-widest">SUNRISE</p>
            <p className="text-xl font-bold text-on-surface">{today.sunrise || '--'}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-label-caps text-on-surface-variant/40 font-black tracking-widest">SUNSET</p>
            <p className="text-xl font-bold text-on-surface">{today.sunset || '--'}</p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default TodaySummary;
