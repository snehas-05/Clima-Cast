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
  rain_probability,
  onClick 
}) => {
  const { unit } = usePreferences();

  const formatRain = (val) => {
    if (val === undefined || val === null || isNaN(val)) return 0;
    return Number(val);
  };

  return (
    <div 
      className={`bg-surface-container-low/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 hover:border-primary/40 hover:bg-surface-container-high transition-all duration-500 group flex flex-col items-center text-center shadow-lg hover:shadow-primary/5 ${onClick ? 'cursor-pointer hover:-translate-y-2 active:scale-95' : ''}`}
      onClick={onClick}
    >
      <p className="text-[10px] font-black text-on-surface-variant/40 group-hover:text-primary transition-colors tracking-[0.2em]">
        {short_day?.toUpperCase() || '--'}
      </p>
      
      <div className="my-6 relative">
        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative transform group-hover:scale-125 group-hover:-translate-y-1 transition-all duration-500">
          <WeatherIcon condition={condition} className="w-14 h-14" />
        </div>
      </div>

      <div className="flex flex-col gap-1 mb-5">
        <span className="text-3xl font-black text-on-surface tracking-tighter">
          {formatTemp(max_temp, unit)}°
        </span>
        <span className="text-sm text-on-surface-variant/60 font-bold">
          {formatTemp(min_temp, unit)}°
        </span>
      </div>

      <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-6 h-8 flex items-center leading-tight">
        {condition || '--'}
      </p>

      <div className="w-full mt-auto">
        <RainProbabilityBar probability={formatRain(rain_probability)} />
      </div>
    </div>

  );
};

export default DayForecastCard;
