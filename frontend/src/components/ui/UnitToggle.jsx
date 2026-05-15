import React from 'react';
import { usePreferences } from '../../context/PreferencesContext';

export default function UnitToggle() {
  const { unit, updateUnit } = usePreferences();

  return (
    <div className="flex bg-surface-container-high p-1 rounded-full border border-outline-variant/30">
      <button
        onClick={() => updateUnit('celsius')}
        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
          unit === 'celsius'
            ? 'bg-primary text-white shadow-sm'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        °C
      </button>
      <button
        onClick={() => updateUnit('fahrenheit')}
        className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
          unit === 'fahrenheit'
            ? 'bg-primary text-white shadow-sm'
            : 'text-on-surface-variant hover:text-primary'
        }`}
      >
        °F
      </button>
    </div>
  );
}
