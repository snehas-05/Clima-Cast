import React from 'react';

const LoadingSkeleton = ({ className = '', height = '1rem', width = '100%', borderRadius = '0.5rem' }) => {
  return (
    <div
      className={`animate-pulse bg-surface-container-high relative overflow-hidden ${className}`}
      style={{
        height,
        width,
        borderRadius,
      }}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
};

export const CardSkeleton = () => (
  <div className="glass-card p-6 rounded-3xl space-y-4">
    <LoadingSkeleton height="1.5rem" width="40%" />
    <LoadingSkeleton height="3rem" width="70%" />
    <div className="flex gap-4">
      <LoadingSkeleton height="1rem" width="30%" />
      <LoadingSkeleton height="1rem" width="30%" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="glass-card p-6 rounded-3xl h-[400px] flex flex-col justify-between">
    <div className="flex justify-between items-center">
      <LoadingSkeleton height="1.5rem" width="150px" />
      <div className="flex gap-2">
        <LoadingSkeleton height="2rem" width="60px" borderRadius="1rem" />
        <LoadingSkeleton height="2rem" width="60px" borderRadius="1rem" />
      </div>
    </div>
    <div className="flex items-end gap-2 h-[250px] px-4">
      {[...Array(12)].map((_, i) => (
        <LoadingSkeleton 
          key={i} 
          height={`${Math.random() * 60 + 20}%`} 
          className="flex-1" 
        />
      ))}
    </div>
    <div className="flex justify-between px-4">
      {[...Array(6)].map((_, i) => (
        <LoadingSkeleton key={i} height="0.75rem" width="40px" />
      ))}
    </div>
  </div>
);

export default LoadingSkeleton;
