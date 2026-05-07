export default function MetricCard({
  icon,
  iconBg = 'bg-primary/10',
  iconColor = 'text-primary',
  label,
  value,
  trend,
  trendDirection,
}) {
  const trendColor = trendDirection === 'up' ? 'text-green-600' : trendDirection === 'down' ? 'text-red-500' : 'text-on-surface-variant opacity-60';
  const trendIcon = trendDirection === 'up' ? 'trending_up' : trendDirection === 'down' ? 'trending_down' : null;

  return (
    <div className="glass-card p-6 rounded-3xl">
      <div className="flex justify-between items-start mb-4">
        <span className={`p-2 ${iconBg} rounded-xl ${iconColor} material-symbols-outlined`}>
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
      <p className="text-label-caps text-on-surface-variant mb-1">{label}</p>
      <h3 className="text-h2-dashboard text-on-surface">{value}</h3>
    </div>
  );
}
