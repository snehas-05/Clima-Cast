import { useEffect } from 'react';
import { usePreferences } from '../context/PreferencesContext';

export const useTheme = () => {
  const { theme } = usePreferences();

  useEffect(() => {
    const body = document.body;
    
    // Smooth transition
    body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    if (theme === 'dark') {
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      body.classList.add('light');
      body.classList.remove('dark');
    }
  }, [theme]);

  return theme;
};
