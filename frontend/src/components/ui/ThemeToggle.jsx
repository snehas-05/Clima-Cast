import React from 'react';
import { usePreferences } from '../../context/PreferencesContext';

export default function ThemeToggle() {
  const { theme, updateTheme } = usePreferences();

  return (
    <button
      onClick={() => updateTheme(theme === 'dark' ? 'light' : 'dark')}
      className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/30 transition-all group"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <span className="material-symbols-outlined transition-transform group-hover:rotate-12" aria-hidden="true">
        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  );
}
