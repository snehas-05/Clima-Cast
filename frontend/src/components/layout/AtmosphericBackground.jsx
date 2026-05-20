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
    dawn: 'linear-gradient(135deg, #081120 0%, #1e1b4b 52%, #061021 100%)',
    morning: 'linear-gradient(135deg, #061021 0%, #0f172a 52%, #172554 100%)',
    noon: 'linear-gradient(135deg, #030712 0%, #061021 46%, #0f172a 100%)',
    afternoon: 'linear-gradient(135deg, #030712 0%, #081120 54%, #1e1b4b 100%)',
    dusk: 'linear-gradient(135deg, #020617 0%, #111827 48%, #312e81 100%)',
    evening: 'linear-gradient(135deg, #020617 0%, #061021 52%, #0f172a 100%)',
    night: 'linear-gradient(135deg, #020617 0%, #030712 48%, #081120 100%)',
  },
  storm: 'linear-gradient(135deg, #020617 0%, #111827 52%, #1e1b4b 100%)',
  rain: 'linear-gradient(135deg, #020617 0%, #061021 54%, #172554 100%)',
  cloudy: 'linear-gradient(135deg, #030712 0%, #0f172a 56%, #1e293b 100%)',
  fog: 'linear-gradient(135deg, #081120 0%, #0f172a 58%, #334155 100%)',
  snow: 'linear-gradient(135deg, #061021 0%, #0f172a 58%, #1e3a8a 100%)'
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
  const overlayOpacity = theme === 'dark' ? 0.68 : 0.15;

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

      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: theme === 'dark'
            ? 'radial-gradient(circle at 22% 8%, rgba(56,189,248,0.10), transparent 30%), radial-gradient(circle at 84% 18%, rgba(99,102,241,0.11), transparent 34%), radial-gradient(circle at 50% 88%, rgba(15,23,42,0.52), transparent 42%)'
            : 'radial-gradient(circle at 22% 8%, rgba(14,165,233,0.12), transparent 30%), radial-gradient(circle at 82% 12%, rgba(99,102,241,0.10), transparent 34%)'
        }}
      />

      {/* Depth/Texture Layer (Subtle Noise or Tint) */}
      <div 
        className="absolute inset-0 z-[2] pointer-events-none opacity-20"
        style={{ 
          backgroundColor: theme === 'dark' ? '#000' : '#fff',
          mixBlendMode: 'overlay'
        }}
      />

      <div
        className="absolute inset-0 z-[3] pointer-events-none opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGZpbHRlciBpZD0ibiI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==')"
        }}
      />

      {/* Glass Frosting Layer */}
      {!reduceAtmospheric && (
        <div 
          className="absolute inset-0 z-[4] backdrop-blur-[var(--atmospheric-blur,40px)] pointer-events-none"
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
