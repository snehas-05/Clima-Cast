import React from 'react';

export const TodaySummarySkeleton = () => (
  <div className="glass-card rounded-3xl p-8 animate-pulse">
    <div className="h-4 w-32 bg-surface-container-high rounded mb-6" />
    <div className="flex items-end gap-6 mb-8">
      <div className="h-20 w-32 bg-surface-container-high rounded" />
      <div className="space-y-2 mb-2">
        <div className="h-6 w-24 bg-surface-container-high rounded" />
        <div className="h-4 w-40 bg-surface-container-high rounded" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="space-y-2">
          <div className="h-3 w-16 bg-surface-container-high rounded" />
          <div className="h-5 w-20 bg-surface-container-high rounded" />
        </div>
      ))}
    </div>
  </div>
);

export const HourlyStripSkeleton = () => (
  <div className="glass-card rounded-3xl p-8 animate-pulse">
    <div className="h-6 w-40 bg-surface-container-high rounded mb-6" />
    <div className="flex gap-4 overflow-hidden">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <div key={i} className="flex-shrink-0 w-24 h-32 bg-surface-container-low rounded-2xl" />
      ))}
    </div>
  </div>
);

export const DailyGridSkeleton = () => (
  <div className="animate-pulse">
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {[1, 2, 3, 4, 5, 6, 7].map(i => (
        <div key={i} className="bg-surface-container-low rounded-2xl p-5 h-64" />
      ))}
    </div>
  </div>
);
