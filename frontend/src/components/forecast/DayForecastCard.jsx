import React from 'react';
import { usePreferences } from '../../context/PreferencesContext';
import { formatTemp } from '../../utils/temperature';
import WeatherIcon from './WeatherIcon';
import RainProbabilityBar from './RainProbabilityBar';

const DayForecastCard = ({ 
  date, 
  short_day, 
  icon, 
  condition, 
  max_temp, 
  min_temp, 
  rain_probability 
}) => {
  const { unit } = usePreferences();

  const formatRain = (val) => {
    if (val === undefined || val === null || isNaN(val)) return 0;
    return Number(val);
  };

  return (
    <div className="bg-surface-container-low/40 backdrop-blur-md rounded-2xl p-5 border border-white/10 hover:border-primary/30 transition-all group flex flex-col items-center text-center">
      <p className="text-label-caps text-on-surface-variant group-hover:text-primary transition-colors">
        {short_day || '--'}
      </p>
      
      <div className="my-4 transform group-hover:scale-110 transition-transform">
        <WeatherIcon condition={condition} className="w-12 h-12" />
      </div>

      <div className="flex flex-col gap-1 mb-4">
        <span className="text-2xl font-bold text-on-surface tracking-tight">
          {formatTemp(max_temp, unit)}°
        </span>
        <span className="text-sm text-on-surface-variant font-medium">
          {formatTemp(min_temp, unit)}°
        </span>
      </div>

      <p className="text-[10px] text-on-surface-variant/70 uppercase tracking-widest mb-4 h-8 flex items-center">
        {condition || '--'}
      </p>

      <RainProbabilityBar probability={formatRain(rain_probability)} />
    </div>
  );
};

export default DayForecastCard;
