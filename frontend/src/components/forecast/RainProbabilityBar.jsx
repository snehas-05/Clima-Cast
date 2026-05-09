import React from 'react';

const RainProbabilityBar = ({ probability }) => {
  const isHigh = probability > 60;
  
  return (
    <div className="w-full space-y-1">
      <div className="flex justify-between items-center text-[10px] text-on-surface-variant uppercase tracking-wider">
        <span className="flex items-center gap-1">
          {isHigh && <span className="text-primary animate-bounce">🌧️</span>}
          Precipitation
        </span>
        <span className="font-bold text-primary">{Math.round(probability)}%</span>
      </div>
      <div className="h-1.5 w-full bg-surface-container-high rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${probability}%` }}
        />
      </div>
    </div>
  );
};

export default RainProbabilityBar;
