import React from 'react';
import { usePreferences } from '../context/PreferencesContext';

const UnitToggle = ({ variant = 'default' }) => {
  const { unit, setUnit } = usePreferences();

  const toggle = () => {
    setUnit(unit === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  if (variant === 'button') {
    return (
      <button 
        onClick={toggle}
        className="flex items-center gap-2 px-4 py-2 rounded-full glass-card hover:bg-white/20 transition-all text-sm font-medium"
      >
        <span className={unit === 'celsius' ? 'text-primary font-bold' : 'text-on-surface-variant'}>°C</span>
        <div className="w-8 h-4 bg-surface-container rounded-full relative p-0.5">
          <div className={`absolute top-0.5 bottom-0.5 w-3 bg-primary rounded-full transition-all ${unit === 'fahrenheit' ? 'left-4' : 'left-0.5'}`} />
        </div>
        <span className={unit === 'fahrenheit' ? 'text-primary font-bold' : 'text-on-surface-variant'}>°F</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 bg-surface-container rounded-lg p-1">
      <button
        onClick={() => setUnit('celsius')}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
          unit === 'celsius' 
          ? 'bg-primary text-white shadow-md' 
          : 'text-on-surface-variant hover:bg-surface-variant'
        }`}
      >
        Metric (°C)
      </button>
      <button
        onClick={() => setUnit('fahrenheit')}
        className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
          unit === 'fahrenheit' 
          ? 'bg-primary text-white shadow-md' 
          : 'text-on-surface-variant hover:bg-surface-variant'
        }`}
      >
        Imperial (°F)
      </button>
    </div>
  );
};

export default UnitToggle;
