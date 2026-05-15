import React from 'react';
import { usePreferences } from '../../context/PreferencesContext';
import { formatTemp } from '../../utils/temperature';

export default function WeatherCard({
  city,
  country,
  temperature,
  condition,
  weatherIcon,
  ml_available,
  onRemove,
  gradientClass = 'weather-gradient-cloudy',
  iconColor = 'text-primary'
}) {
  const { unit } = usePreferences();

  return (
    <div className={`glass-card ${gradientClass} rounded-3xl p-6 relative group transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-error/10 hover:text-error z-20"
        >
          <span className="material-symbols-outlined text-[20px]">delete</span>
        </button>
      )}

      <div className="flex justify-between items-start mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-h3-card-title text-on-surface truncate max-w-[150px]">{city}</h3>
            {ml_available && (
              <span 
                className="material-symbols-outlined text-primary text-[18px] animate-pulse" 
                title="AI Powered Predictions Available"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                stars
              </span>
            )}
          </div>
          <p className="text-label-caps text-on-surface-variant text-[10px] opacity-70">{country || 'Location'}</p>
        </div>
        <span
          className={`material-symbols-outlined text-4xl ${iconColor}`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {weatherIcon || 'cloud'}
        </span>
      </div>

      <div className="flex items-end justify-between relative z-10">
        <div>
          <span className="text-6xl font-bold text-on-surface tracking-tighter">
            {formatTemp(temperature, unit)}°
          </span>
          <p className="text-body-main text-on-surface-variant font-medium">{condition}</p>
        </div>
        
        {ml_available && (
          <div className="flex flex-col items-end">
            <div className="flex -space-x-1 mb-1">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-1 h-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <span className="text-[10px] font-bold text-primary tracking-widest uppercase">AI ACTIVE</span>
          </div>
        )}
      </div>

      {/* Decorative inner glow for AI cities */}
      {ml_available && (
        <div className="absolute inset-0 border-2 border-primary/10 rounded-3xl pointer-events-none" />
      )}
    </div>
  );
}
