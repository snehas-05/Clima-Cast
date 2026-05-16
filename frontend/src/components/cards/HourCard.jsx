import React from 'react';
import { usePreferences } from '../../context/PreferencesContext';
import { formatTemp } from '../../utils/temperature';

export default function HourCard({ time, icon, temp, isActive = false, iconStyle }) {
  const { unit } = usePreferences();
  
  return (
    <div
      className={`flex-shrink-0 w-28 flex flex-col items-center p-5 rounded-[1.5rem] transition-all duration-500 group
        ${isActive
          ? 'bg-primary/20 border-2 border-primary/40 shadow-[0_0_20px_rgba(192,132,252,0.2)] scale-110 z-10'
          : 'bg-white/5 border border-white/5 hover:bg-white/10'
        }`}
    >
      <p className={`text-[10px] font-black mb-4 tracking-widest uppercase transition-colors ${isActive ? 'text-primary' : 'text-on-surface-variant'}`}>
        {time}
      </p>
      <div className={`p-3 rounded-xl mb-3 transition-all duration-500 ${isActive ? 'bg-primary/20 scale-110' : 'bg-transparent group-hover:bg-white/5'}`}>
        <span
          className={`material-symbols-outlined text-2xl transition-all duration-500 ${isActive ? 'text-primary scale-110' : 'text-on-surface-variant group-hover:text-primary group-hover:scale-110'}`}
          style={{ ...iconStyle, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
        >
          {icon}
        </span>
      </div>
      <p className={`text-xl font-bold transition-all duration-500 ${isActive ? 'text-primary' : 'text-on-surface'}`}>
        {formatTemp(temp, unit)}°
      </p>
    </div>

  );
}
