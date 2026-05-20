import LoadingSkeleton from '../ui/LoadingSkeleton';
import AnimatedCard from '../ui/AnimatedCard';
import { motion } from 'framer-motion';
import { TIMING, EASING } from '../../utils/motion';
import { useAtmosphericText } from '../../hooks/useAtmosphericText';
import { usePreferences } from '../../context/PreferencesContext';
import { useMemo } from 'react';

export default function MetricCard({ 
  id, 
  icon, 
  label, 
  value, 
  subLabel, 
  trend, 
  trendDirection, 
  iconBg = 'bg-primary/10', 
  iconColor = 'text-primary', 
  loading, 
  delay = 0, 
  onClick 
}) {
  const { getMetricVernacular } = useAtmosphericText();
  const { reduceAtmospheric } = usePreferences();
  
  const trendColor = trendDirection === 'up' ? 'text-cyan-300' : trendDirection === 'down' ? 'text-rose-400' : 'text-slate-300';
  const trendIcon = trendDirection === 'up' ? 'trending_up' : trendDirection === 'down' ? 'trending_down' : null;

  const displaySubLabel = useMemo(() => {
    // If we have an ID (e.g., 'temp'), try to get a smart vernacular label first
    const smartLabel = id ? getMetricVernacular(id, value) : null;
    return smartLabel || subLabel;
  }, [id, value, getMetricVernacular, subLabel]);

  if (loading) {
    return (
      <div className="glass-card card-pad rounded-2xl space-y-4">
        <div className="flex justify-between items-center">
          <LoadingSkeleton height="2.5rem" width="2.5rem" borderRadius="0.75rem" />
          <LoadingSkeleton height="1rem" width="3rem" />
        </div>
        <div className="space-y-1">
          <LoadingSkeleton height="0.75rem" width="50%" />
          <LoadingSkeleton height="1.5rem" width="70%" />
        </div>
      </div>
    );
  }

  return (
    <AnimatedCard 
      onClick={onClick}
      delay={delay}
      className="card-pad-lg overflow-hidden min-h-[180px] flex flex-col justify-between rounded-2xl border-white/5"
    >
      <div className="flex justify-between items-center gap-var(--spacing-lg) mb-var(--spacing-lg)">
        <div className={`w-11 h-11 ${iconBg} rounded-xl ${iconColor} flex items-center justify-center transition-all duration-500 group-hover:shadow-lg group-hover:shadow-primary/5 shrink-0`}>
          <span className="material-symbols-outlined text-2xl">
            {icon}
          </span>
        </div>
        {trend && (
          <span className={`text-[10px] font-bold tracking-wider px-2.5 py-1 rounded-full bg-cyan-400/5 ${trendColor} border border-cyan-400/10 shrink-0`}>
            {trend}
          </span>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-end space-y-1.5 relative z-10">
        <p className="text-[11px] font-bold text-on-surface-variant tracking-[0.15em] transition-colors group-hover:text-primary uppercase">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-on-surface tracking-tight group-hover:translate-x-1 transition-transform duration-500">{value}</h3>
        </div>
        {displaySubLabel && (
          <p className="text-xs text-on-surface-variant/70 font-medium">{displaySubLabel}</p>
        )}
      </div>

      {/* Simplified Sparkline Placeholder */}
      {!reduceAtmospheric && (
        <div className="mt-4 h-8 w-full opacity-30 group-hover:opacity-60 transition-opacity duration-500">
          <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
            <motion.path 
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: delay + 0.5, ease: EASING.CINEMATIC }}
              d="M0 15 Q 25 5, 50 12 T 100 8" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className={iconColor}
            />
          </svg>
        </div>
      )}

      <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[var(--atmospheric-glow,rgba(var(--primary-rgb),0.05))] rounded-full blur-2xl group-hover:bg-[var(--atmospheric-glow,rgba(var(--primary-rgb),0.1))] transition-colors duration-700" />
    </AnimatedCard>
  );
}
