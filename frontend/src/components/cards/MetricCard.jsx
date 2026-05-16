import LoadingSkeleton from '../ui/LoadingSkeleton';

export default function MetricCard({
  icon,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
  label,
  value,
  subLabel,
  trend,
  trendDirection,
  loading = false,
  onClick,
}) {
  const trendColor = trendDirection === 'up' ? 'text-green-400' : trendDirection === 'down' ? 'text-red-400' : 'text-emerald-400';
  const trendIcon = trendDirection === 'up' ? 'trending_up' : trendDirection === 'down' ? 'trending_down' : null;

  if (loading) {
    return (
      <div className="glass-card p-6 rounded-3xl space-y-4">
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
    <div 
      className={`glass-card p-6 rounded-[2rem] transition-all duration-500 group relative overflow-hidden ${onClick ? 'cursor-pointer hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(192,132,252,0.15)] active:scale-95' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 ${iconBg} rounded-2xl ${iconColor} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 group-hover:shadow-lg`}>
          <span className="material-symbols-outlined text-2xl">
            {icon}
          </span>
        </div>
        {trend && (
          <span className={`text-[10px] font-bold tracking-wider px-2 py-1 rounded-full bg-emerald-500/10 ${trendColor} border border-emerald-500/20`}>
            {trend}
          </span>
        )}
      </div>

      <div className="space-y-1 relative z-10">
        <p className="text-[11px] font-bold text-on-surface-variant tracking-[0.15em] transition-colors group-hover:text-primary uppercase">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-3xl font-bold text-on-surface tracking-tight group-hover:translate-x-1 transition-transform duration-300">{value}</h3>
        </div>
        {subLabel && (
          <p className="text-xs text-on-surface-variant/70 font-medium">{subLabel}</p>
        )}
      </div>

      {/* Simplified Sparkline Placeholder */}
      <div className="mt-4 h-8 w-full opacity-30 group-hover:opacity-60 transition-opacity duration-500">
        <svg viewBox="0 0 100 20" className="w-full h-full overflow-visible">
          <path 
            d="M0 15 Q 25 5, 50 12 T 100 8" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            className={iconColor}
          />
        </svg>
      </div>

      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-700" />
    </div>
  );
}

