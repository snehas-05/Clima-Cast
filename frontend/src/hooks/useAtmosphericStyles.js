import { useEffect } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { usePreferences } from '../context/PreferencesContext';

/**
 * Hook to inject dynamic atmospheric CSS variables into the document root.
 * Reacts to weather conditions, solar phase, and user preferences.
 */
export const useAtmosphericStyles = () => {
  const { atmosphericState } = useWeatherContext();
  const { reduceAtmospheric, theme } = usePreferences();

  useEffect(() => {
    if (!atmosphericState) return;

    const { condition, intensity, solarPhase, mood, isDay } = atmosphericState;
    const root = document.documentElement;

    // 1. Glass Blur & Opacity
    let blurValue = '24px';
    let glassOpacity = theme === 'dark' ? '0.08' : '0.4';

    if (reduceAtmospheric) {
      blurValue = '0px';
      glassOpacity = theme === 'dark' ? '0.15' : '0.8';
    } else if (condition === 'fog' || condition === 'rain') {
      blurValue = '40px'; // Thicker atmosphere
      glassOpacity = theme === 'dark' ? '0.12' : '0.5';
    }

    // 2. Accent & Glow Colors
    let accentGlow = 'rgba(192, 132, 252, 0.3)'; // Default purple
    if (mood === 'intense') {
      accentGlow = theme === 'dark' ? 'rgba(248, 113, 113, 0.4)' : 'rgba(239, 68, 68, 0.2)'; // Reddish
    } else if (solarPhase === 'dawn' || solarPhase === 'dusk') {
      accentGlow = 'rgba(251, 146, 60, 0.3)'; // Orange/Gold
    } else if (!isDay) {
      accentGlow = 'rgba(129, 140, 248, 0.3)'; // Indigo/Night
    }

    // 3. Inject Variables
    root.style.setProperty('--glass-blur', blurValue);
    root.style.setProperty('--glass-opacity', glassOpacity);
    root.style.setProperty('--atmospheric-glow', accentGlow);
    root.style.setProperty('--intensity-factor', intensity.toString());

    // 4. Update Theme Saturation (Subtle)
    if (!reduceAtmospheric) {
      const saturation = condition === 'storm' || condition === 'rain' ? '0.6' : '1';
      root.style.setProperty('--ui-saturation', saturation);
    } else {
      root.style.setProperty('--ui-saturation', '1');
    }

  }, [atmosphericState, reduceAtmospheric, theme]);
};
