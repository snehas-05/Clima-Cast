import React from 'react';

const RainProbabilityBar = ({ probability }) => {
  const isHigh = probability > 60;
  
  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between items-center text-[10px] font-black text-on-surface-variant/40 tracking-[0.2em] uppercase">
        <span className="flex items-center gap-1.5">
          <span className={`material-symbols-outlined text-xs ${isHigh ? 'text-primary animate-pulse' : 'text-on-surface-variant/40'}`}>water_drop</span>
          RAIN
        </span>
        <span className="font-black text-primary">{Math.round(probability)}%</span>
      </div>
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div 
          className={`h-full bg-gradient-to-r from-primary/40 to-primary transition-all duration-1000 ease-out rounded-full shadow-[0_0_10px_rgba(192,132,252,0.3)] ${isHigh ? 'animate-pulse' : ''}`}
          style={{ width: `${probability}%` }}
        />
      </div>
    </div>

  );
};

export default RainProbabilityBar;
