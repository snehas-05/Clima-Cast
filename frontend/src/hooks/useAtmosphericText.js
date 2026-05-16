import { useMemo } from 'react';
import { useWeatherContext } from '../context/WeatherContext';

/**
 * Hook to generate human-feeling microcopy (Vernacular Engine).
 * Focuses on emotional intelligence and atmospheric grounding.
 */
export const useAtmosphericText = () => {
  const { weatherData, atmosphericState } = useWeatherContext();

  const getMetricVernacular = useMemo(() => (id, value) => {
    if (!weatherData || !value) return null;

    // Numerical extraction for logic
    const numValue = parseFloat(value);

    switch (id) {
      case 'temp':
        if (numValue > 38) return "Heat intensity is high.";
        if (numValue < 5) return "Conditions are crisp and cold.";
        return null; // Stay quiet if normal
      
      case 'humidity':
        if (numValue > 75) return "The air feels heavy.";
        if (numValue < 25) return "Air is notably dry.";
        return null;

      case 'wind':
        if (numValue > 40) return "Winds are significant.";
        if (numValue < 5) return "The air is perfectly still.";
        return null;

      case 'aqi':
        if (numValue <= 2) return "The air is exceptionally clear.";
        if (numValue >= 4) return "Air quality is slightly strained.";
        return null;

      default:
        return null;
    }
  }, [weatherData]);

  const getStatusOutlook = useMemo(() => {
    if (!atmosphericState) return "Atmospheric Outlook • Stable";
    
    const { condition, solarPhase, mood } = atmosphericState;
    const phaseLabel = solarPhase.charAt(0).toUpperCase() + solarPhase.slice(1);
    
    if (mood === 'intense') return `Intense ${condition} • ${phaseLabel}`;
    if (condition !== 'clear') return `${condition.charAt(0).toUpperCase() + condition.slice(1)} Conditions • ${phaseLabel}`;
    
    return `Atmospheric Outlook • ${phaseLabel}`;
  }, [atmosphericState]);

  return { getMetricVernacular, getStatusOutlook };
};
