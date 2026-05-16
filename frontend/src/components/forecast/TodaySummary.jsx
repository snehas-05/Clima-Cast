import { motion } from 'framer-motion';
import { TRANSITIONS, EASING, TIMING } from '../../utils/motion';

const conditionGradients = {
  sunny: 'from-amber-400/20 via-orange-500/5 to-transparent',
  clear: 'from-blue-400/20 via-sky-500/5 to-transparent',
  clouds: 'from-slate-400/20 via-gray-500/5 to-transparent',
  cloudy: 'from-slate-400/20 via-gray-500/5 to-transparent',
  rain: 'from-blue-600/20 via-indigo-700/5 to-transparent',
  thunderstorm: 'from-purple-600/20 via-slate-900/5 to-transparent',
  snow: 'from-cyan-100/20 via-blue-200/5 to-transparent',
};

const TodaySummary = ({ city, today, onClick }) => {
  const { unit } = usePreferences();
  if (!today) return null;

  const gradientClass = conditionGradients[today.condition?.toLowerCase()] || conditionGradients.clear;

  return (
    <motion.div 
      initial={TRANSITIONS.SOFT_REVEAL.initial}
      animate={TRANSITIONS.SOFT_REVEAL.animate}
      className={`glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden bg-gradient-to-br ${gradientClass} border border-white/5 shadow-2xl group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
        <WeatherIcon condition={today.condition} className="w-80 h-80" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/20 rounded-lg">
            <span className="material-symbols-outlined text-primary text-xl">location_on</span>
          </div>
          <span className="text-label-caps text-primary tracking-[0.3em] font-bold">{city?.toUpperCase()}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end gap-6 md:gap-10 mb-10">
          <h2 className="text-[80px] md:text-[120px] font-black tracking-tighter leading-none bg-gradient-to-b from-on-surface to-on-surface/40 bg-clip-text text-transparent">
            {formatTemp(today.high, unit)}°
          </h2>
          <div className="pb-2 md:pb-6">
            <p className="text-2xl md:text-4xl font-bold text-on-surface mb-2">{today.condition || '--'}</p>
            <p className="text-on-surface-variant/60 font-medium text-base md:text-lg italic tracking-wide">"{today.description || '--'}"</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 border-t border-white/5 pt-10">
          <div className="space-y-2">
            <p className="text-[10px] text-label-caps text-on-surface-variant/40 font-black tracking-widest">HIGH / LOW</p>
            <p className="text-xl font-bold text-on-surface flex items-baseline gap-1">
              {formatTemp(today.high, unit)}° <span className="text-sm font-medium text-on-surface-variant/40">/ {formatTemp(today.low, unit)}°</span>
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-label-caps text-on-surface-variant/40 font-black tracking-widest">FEELS LIKE</p>
            <p className="text-xl font-bold text-primary">{formatTemp(today.feels_like, unit)}°</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-label-caps text-on-surface-variant/40 font-black tracking-widest">SUNRISE</p>
            <p className="text-xl font-bold text-on-surface">{today.sunrise || '--'}</p>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] text-label-caps text-on-surface-variant/40 font-black tracking-widest">SUNSET</p>
            <p className="text-xl font-bold text-on-surface">{today.sunset || '--'}</p>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 blur-[100px] rounded-full group-hover:bg-primary/10 transition-colors duration-1000" />
    </motion.div>

  );
};

export default TodaySummary;
