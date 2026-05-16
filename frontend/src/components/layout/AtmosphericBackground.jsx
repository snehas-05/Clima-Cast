import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWeatherContext } from '../../context/WeatherContext';
import { usePreferences } from '../../context/PreferencesContext';

/**
 * CLIMA-CAST Cinematic Atmospheric Background
 * 
 * Uses layered CSS gradients and Framer Motion for performance-safe
 * environmental transitions. Respects accessibility settings.
 */

const ATMOSPHERIC_THEMES = {
  clear: {
    dawn: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    morning: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    noon: 'linear-gradient(135deg, #00c6fb 0%, #005bea 100%)',
    afternoon: 'linear-gradient(135deg, #2af598 0%, #009efd 100%)',
    dusk: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    evening: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
    night: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
  },
  storm: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
  rain: 'linear-gradient(135deg, #616161 0%, #9bc5c3 100%)',
  cloudy: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
  fog: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)',
  snow: 'linear-gradient(135deg, #e6e9f0 0%, #eef1f5 100%)'
};

const AtmosphericBackground = ({ children }) => {
  const { atmosphericState } = useWeatherContext();
  const { reduceAtmospheric, theme } = usePreferences();

  const currentGradient = useMemo(() => {
    if (!atmosphericState) return ATMOSPHERIC_THEMES.clear.noon;

    const { condition, solarPhase, mood } = atmosphericState;

    if (condition !== 'clear') {
      return ATMOSPHERIC_THEMES[condition] || ATMOSPHERIC_THEMES.clear.noon;
    }

    return ATMOSPHERIC_THEMES.clear[solarPhase] || ATMOSPHERIC_THEMES.clear.noon;
  }, [atmosphericState]);

  // Determine if we should apply the "Deep Glass" blur based on settings
  const blurAmount = reduceAtmospheric ? '0px' : '40px';
  const overlayOpacity = theme === 'dark' ? 0.4 : 0.15;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Base Atmospheric Layer */}
      <motion.div
        key={currentGradient}
        initial={reduceAtmospheric ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={reduceAtmospheric ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        style={{ background: currentGradient }}
        className="absolute inset-0 z-0"
      />

      {/* Depth/Texture Layer (Subtle Noise or Tint) */}
      <div 
        className="absolute inset-0 z-[1] pointer-events-none opacity-20"
        style={{ 
          backgroundColor: theme === 'dark' ? '#000' : '#fff',
          mixBlendMode: 'overlay'
        }}
      />

      {/* Glass Frosting Layer */}
      {!reduceAtmospheric && (
        <div 
          className="absolute inset-0 z-[2] backdrop-blur-[var(--atmospheric-blur,40px)] pointer-events-none"
          style={{ backgroundColor: `rgba(var(--background-rgb), ${overlayOpacity})` }}
        />
      )}

      {/* Content Layer */}
      <div className="relative z-[10] min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AtmosphericBackground;
