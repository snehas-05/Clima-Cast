import { useMemo } from 'react';
import { useWeatherContext } from '../context/WeatherContext';
import { usePreferences } from '../context/PreferencesContext';
import { SPRING, TIMING, EASING } from '../utils/motion';

/**
 * Hook to provide environment-aware motion configurations.
 * Adjusts animation urgency and damping based on the weather mood.
 */
export const useAtmosphericMotion = () => {
  const { atmosphericState } = useWeatherContext();
  const { reduceAtmospheric } = usePreferences();

  const motionConfig = useMemo(() => {
    if (reduceAtmospheric) {
      return {
        spring: { type: 'tween', duration: 0.2 },
        transition: { duration: 0.2, ease: 'linear' },
        stagger: 0
      };
    }

    const mood = atmosphericState?.mood || 'calm';
    
    // Subtle adjustments to damping based on mood
    // Intense mood -> Tighter, snappier springs
    // Calm mood -> Softer, more fluid springs
    const dampingAdj = mood === 'intense' ? -5 : mood === 'alert' ? -2 : 5;
    
    return {
      spring: { 
        ...SPRING.DEFAULT, 
        damping: Math.max(10, SPRING.DEFAULT.damping + dampingAdj) 
      },
      softSpring: {
        ...SPRING.SOFT,
        damping: Math.max(15, SPRING.SOFT.damping + dampingAdj)
      },
      transition: {
        duration: mood === 'intense' ? TIMING.FAST : TIMING.MEDIUM,
        ease: mood === 'intense' ? EASING.SOFT : EASING.CINEMATIC
      },
      stagger: mood === 'intense' ? 0.05 : 0.1
    };
  }, [atmosphericState, reduceAtmospheric]);

  return motionConfig;
};
