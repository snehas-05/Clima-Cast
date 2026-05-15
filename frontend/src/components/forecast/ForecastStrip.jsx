import React, { useRef, useEffect } from 'react';
import WeatherIcon from './WeatherIcon';
import { usePreferences } from '../../context/PreferencesContext';
import { formatTemp } from '../../utils/temperature';

const ForecastStrip = ({ hourly = [] }) => {
  const { unit } = usePreferences();
  const scrollRef = useRef(null);

  // Persistence: Save scroll position to sessionStorage
  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem('forecast_strip_scroll');
    if (savedScrollPos && scrollRef.current) {
      scrollRef.current.scrollLeft = parseInt(savedScrollPos, 10);
    }

    const handleScroll = () => {
      if (scrollRef.current) {
        sessionStorage.setItem('forecast_strip_scroll', scrollRef.current.scrollLeft);
      }
    };

    const strip = scrollRef.current;
    if (strip) {
      strip.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (strip) {
        strip.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="glass-card rounded-3xl p-8 overflow-hidden relative">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-h3-card-title text-on-surface">Hourly Outlook</h4>
        <div className="flex gap-2">
          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })}
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button 
            onClick={() => scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })}
            className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
        style={{ scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }}
      >
        {hourly.map((h, i) => (
          <div 
            key={`${h.time}-${i}`} 
            className="flex-shrink-0 w-24 bg-surface-container-low/50 rounded-2xl p-4 flex flex-col items-center border border-white/5 snap-center hover:border-primary/20 transition-all group"
          >
            <span className="text-xs font-bold text-on-surface-variant mb-3 group-hover:text-primary transition-colors">
              {h.time || '--'}
            </span>
            <WeatherIcon condition={h.condition} className="w-10 h-10 mb-3" />
            <span className="text-lg font-bold text-on-surface">
              {formatTemp(h.temp, unit)}°
            </span>
            <span className="text-[10px] text-on-surface-variant mt-1 uppercase opacity-60">
              {h.condition || '--'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastStrip;
