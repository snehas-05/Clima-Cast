import React from 'react';
import LoadingSkeleton from '../ui/LoadingSkeleton';

export const TodaySummarySkeleton = () => (
  <div className="glass-card rounded-3xl p-8 space-y-6">
    <LoadingSkeleton height="1rem" width="120px" />
    <div className="flex items-end gap-6 mb-8">
      <LoadingSkeleton height="5rem" width="140px" />
      <div className="space-y-2 pb-2">
        <LoadingSkeleton height="1.5rem" width="100px" />
        <LoadingSkeleton height="1rem" width="180px" />
      </div>
    </div>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-8">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="space-y-2">
          <LoadingSkeleton height="0.75rem" width="60px" />
          <LoadingSkeleton height="1.25rem" width="80px" />
        </div>
      ))}
    </div>
  </div>
);

export const HourlyStripSkeleton = () => (
  <div className="glass-card rounded-3xl p-8 space-y-6">
    <LoadingSkeleton height="1.5rem" width="160px" />
    <div className="flex gap-4 overflow-hidden">
      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <LoadingSkeleton key={i} height="128px" width="96px" borderRadius="1rem" className="flex-shrink-0" />
      ))}
    </div>
  </div>
);

export const DailyGridSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
    {[1, 2, 3, 4, 5, 6, 7].map(i => (
      <LoadingSkeleton key={i} height="256px" width="100%" borderRadius="1rem" />
    ))}
  </div>
);
