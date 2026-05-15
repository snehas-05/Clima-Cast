import React from 'react';

export default function AlertCard({
  type,
  label,
  probability,
  severity = 'low',
  explanation,
  historical_context,
  recommendation,
  ml_fallback
}) {
  const severityStyles = {
    extreme: {
      border: 'border-t-4 border-error shadow-[0_0_20px_rgba(186,26,26,0.3)]',
      badge: 'bg-error text-white',
      action: 'text-error',
      iconColor: 'text-error',
      decorBg: 'bg-error/10',
      glow: 'shadow-[0_0_15px_rgba(186,26,26,0.4)]'
    },
    high: {
      border: 'border-t-4 border-[#ff4d4d]',
      badge: 'bg-[#ff4d4d] text-white',
      action: 'text-[#ff4d4d]',
      iconColor: 'text-[#ff4d4d]',
      decorBg: 'bg-[#ff4d4d]/10',
    },
    medium: {
      border: 'border-t-4 border-tertiary',
      badge: 'bg-tertiary text-on-tertiary',
      action: 'text-tertiary',
      iconColor: 'text-tertiary',
      decorBg: 'bg-tertiary/10',
    },
    low: {
      border: 'border-t-4 border-secondary-container',
      badge: 'bg-surface-container-highest text-on-surface-variant',
      action: 'text-on-surface-variant',
      iconColor: 'text-on-surface-variant',
      decorBg: 'bg-surface-container',
    },
  };

  const styles = severityStyles[severity] || severityStyles.low;

  return (
    <div
      className={`glass-card p-6 rounded-3xl ${styles.border} relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 ${severity === 'extreme' ? 'animate-pulse-subtle' : ''}`}
    >
      <div className={`absolute top-0 right-0 w-32 h-32 ${styles.decorBg} rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125`} />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex flex-col gap-1">
          <div className={`px-2.5 py-1 ${styles.badge} text-[10px] font-bold rounded-full uppercase tracking-wider w-fit`}>
            {severity.toUpperCase()} ALERT
          </div>
          {ml_fallback && (
            <span className="text-[10px] text-on-surface-variant font-bold opacity-70">
              [SYSTEM FALLBACK ACTIVE]
            </span>
          )}
        </div>
        <span className="text-2xl font-bold text-on-surface">
          {probability ? `${Math.round(probability * 100)}%` : ''}
        </span>
      </div>

      <h4 className="font-bold text-on-surface text-xl mb-2 relative z-10">{label}</h4>

      <div className="space-y-3 relative z-10">
        <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/10">
          <p className="text-xs font-bold text-on-surface mb-1 uppercase tracking-tighter opacity-60">ML EXPLANATION</p>
          <p className="text-sm text-on-surface leading-snug">{explanation}</p>
        </div>

        <div className="p-3 bg-primary/5 rounded-xl border border-primary/10">
          <p className="text-xs font-bold text-primary mb-1 uppercase tracking-tighter opacity-60">HISTORICAL CONTEXT</p>
          <p className="text-sm text-on-surface leading-snug">{historical_context}</p>
        </div>

        <div className="pt-2">
          <p className="text-xs font-bold text-secondary mb-1 uppercase tracking-tighter opacity-60">WHAT TO DO</p>
          <p className="text-sm text-on-surface-variant italic leading-snug">"{recommendation}"</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-xs pt-4 border-t border-outline-variant/20 relative z-10">
        <span className={`font-bold ${styles.action} flex items-center gap-1 cursor-pointer hover:underline`}>
          View Safety Protocol <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </span>
        <span className="text-on-surface-variant opacity-60">Detected just now</span>
      </div>
    </div>
  );
}
