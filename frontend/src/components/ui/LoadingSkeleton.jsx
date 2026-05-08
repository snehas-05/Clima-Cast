import React from 'react';

const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-700/50 rounded ${className}`} />
);

export function LoadingSkeleton({ type = "card" }) {
  if (type === "dashboard") {
    return (
      <div className="space-y-6">
        {/* Banner Skeleton */}
        <Skeleton className="h-12 w-full rounded-xl" />
        
        {/* Main Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        
        {/* Chart Skeleton */}
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  if (type === "card") {
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }

  return <Skeleton className="h-4 w-full" />;
}
