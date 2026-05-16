import { useMemo } from 'react';

export default function InsightCard({ 
  icon = 'psychology', 
  title, 
  explanation, 
  severity = 'low', 
  confidence = 0.9, 
  factors = [], 
  trend = 'stable',
  onClick 
}) {
  
  const severityStyles = useMemo(() => {
    switch(severity) {
      case 'extreme':
      case 'high':
        return {
          glow: 'shadow-[0_0_20px_rgba(244,63,94,0.15)] border-rose-500/20',
          icon: 'text-rose-400 bg-rose-400/10',
          title: 'text-rose-400',
          accent: 'bg-rose-400'
        };
      case 'medium':
        return {
          glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)] border-amber-500/20',
          icon: 'text-amber-400 bg-amber-400/10',
          title: 'text-amber-400',
          accent: 'bg-amber-400'
        };
      default:
        return {
          glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)] border-primary/20',
          icon: 'text-primary bg-primary/10',
          title: 'text-primary',
          accent: 'bg-primary'
        };
    }
  }, [severity]);

  const dashOffset = useMemo(() => {
    const circumference = 2 * Math.PI * 8;
    return circumference - (confidence * circumference);
  }, [confidence]);

  return (
    <div 
      className={`relative flex gap-5 items-start p-6 rounded-[1.5rem] transition-all duration-500 group border bg-white/[0.02] backdrop-blur-md ${severityStyles.glow} ${onClick ? 'cursor-pointer hover:bg-white/[0.05] active:scale-[0.98]' : ''}`}
      onClick={onClick}
    >
      {/* Confidence Ring */}
      <div className="absolute top-4 right-4 flex flex-col items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
        <svg className="w-5 h-5 -rotate-90">
          <circle cx="10" cy="10" r="8" fill="transparent" stroke="currentColor" strokeWidth="2" className="text-white/10" />
          <circle 
            cx="10" cy="10" r="8" fill="transparent" stroke="currentColor" strokeWidth="2" 
            className={severityStyles.title} 
            style={{ 
              strokeDasharray: 2 * Math.PI * 8,
              strokeDashoffset: dashOffset,
              transition: 'stroke-dashoffset 1s ease-out'
            }}
          />
        </svg>
        <span className="text-[8px] font-black tracking-tighter opacity-70 uppercase">{Math.round(confidence * 100)}%</span>
      </div>

      <div className={`p-4 rounded-2xl ${severityStyles.icon} transition-all duration-700 group-hover:scale-110 group-hover:rotate-6 shadow-lg shadow-black/20 shrink-0`}>
        <span className="material-symbols-outlined text-2xl">{icon || 'psychology'}</span>
      </div>

      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center gap-2 mb-2">
          <p className={`font-bold text-sm tracking-wide uppercase ${severityStyles.title}`}>{title}</p>
          {trend !== 'stable' && (
            <span className={`material-symbols-outlined text-sm ${trend === 'worsening' ? 'text-rose-400 rotate-45' : 'text-emerald-400 -rotate-45'}`}>
              north_east
            </span>
          )}
        </div>
        
        <p className="text-body-sm text-on-surface-variant leading-relaxed group-hover:text-on-surface transition-colors duration-300 mb-4 line-clamp-2">
          {explanation}
        </p>

        {factors.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {factors.map((f, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-bold text-on-surface-variant tracking-wider uppercase">
                {f}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
