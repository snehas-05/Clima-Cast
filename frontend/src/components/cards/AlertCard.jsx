export default function AlertCard({
  severity = 'warning',
  severityLabel,
  icon,
  title,
  location,
  description,
  actionText,
  expiresIn,
}) {
  const severityStyles = {
    emergency: {
      border: 'border-t-4 border-error',
      badge: 'bg-error text-white',
      action: 'text-error',
      iconColor: 'text-error',
      decorBg: 'bg-error/5',
    },
    warning: {
      border: 'border-t-4 border-tertiary',
      badge: 'bg-tertiary text-on-tertiary',
      action: 'text-tertiary',
      iconColor: 'text-tertiary',
      decorBg: 'bg-tertiary/5',
    },
    watch: {
      border: 'border-t-4 border-secondary-container/50',
      badge: 'bg-surface-container-highest text-on-surface-variant',
      action: 'text-on-surface-variant',
      iconColor: 'text-on-surface-variant',
      decorBg: 'bg-surface-container',
    },
  };

  const styles = severityStyles[severity] || severityStyles.watch;

  return (
    <div
      className={`glass-card p-5 rounded-3xl ${styles.border} relative overflow-hidden group hover:-translate-y-0.5 transition-transform cursor-pointer`}
    >
      <div className={`absolute top-0 right-0 w-24 h-24 ${styles.decorBg} rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110`} />

      <div className="flex justify-between items-start mb-3">
        <div className={`px-2 py-0.5 ${styles.badge} text-[10px] font-bold rounded uppercase tracking-wider`}>
          {severityLabel}
        </div>
        <span className={`material-symbols-outlined ${styles.iconColor}`}>{icon}</span>
      </div>

      <h4 className="font-bold text-on-surface text-lg mb-1">{title}</h4>

      {location && (
        <p className="text-xs text-on-surface-variant font-medium mb-4 flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">location_on</span>
          {location}
        </p>
      )}

      <p className="text-sm text-on-surface-variant leading-snug mb-4">{description}</p>

      <div className="flex items-center justify-between text-xs pt-4 border-t border-outline-variant/20">
        <span className={`font-bold ${styles.action}`}>{actionText}</span>
        {expiresIn && <span className="text-on-surface-variant">{expiresIn}</span>}
      </div>
    </div>
  );
}
