import LoadingSkeleton from '../ui/LoadingSkeleton';

export default function MetricCard({
  icon,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
  label,
  value,
  trend,
  trendDirection,
  loading = false,
  onClick,
}) {
  const trendColor = trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-500' : 'text-on-surface-variant opacity-60';
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
      className={`glass-card p-6 rounded-3xl transition-all duration-300 group ${onClick ? 'cursor-pointer hover:-translate-y-2 hover:shadow-xl active:scale-95' : ''}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <span className={`p-2 ${iconBg} rounded-xl ${iconColor} material-symbols-outlined transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          {icon}
        </span>
        {trend && (
          <span className={`text-label-caps flex items-center gap-0.5 ${trendColor}`}>
            {trend}
            {trendIcon && (
              <span className="material-symbols-outlined text-xs">{trendIcon}</span>
            )}
          </span>
        )}
      </div>
      <p className="text-label-caps text-on-surface-variant mb-1 group-hover:text-primary transition-colors">{label}</p>
      <h3 className="text-h2-dashboard text-on-surface group-hover:translate-x-1 transition-transform">{value}</h3>
    </div>
  );
}
