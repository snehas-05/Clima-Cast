import React from 'react';
import ChartContainer from '../charts/ChartContainer';

export default function SeasonalInsights({ data, loading }) {
  if (loading) return <div className="glass-card h-[300px] animate-pulse rounded-3xl" />;

  if (!data || data.length === 0) return null;

  const SeasonIcon = (season) => {
    switch (season.toLowerCase()) {
      case 'summer': return 'wb_sunny';
      case 'winter': return 'ac_unit';
      case 'spring': return 'eco';
      case 'autumn': return 'filter_vintage';
      default: return 'cloud';
    }
  };

  const getSeasonColor = (season) => {
    switch (season.toLowerCase()) {
      case 'summer': return 'text-amber-500 bg-amber-50';
      case 'winter': return 'text-blue-500 bg-blue-50';
      case 'spring': return 'text-green-500 bg-green-50';
      case 'autumn': return 'text-orange-500 bg-orange-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {data.map((s) => (
        <div key={s.season} className="glass-card p-6 rounded-3xl border border-white/40 hover:shadow-xl transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-2xl ${getSeasonColor(s.season)}`}>
              <span className="material-symbols-outlined">{SeasonIcon(s.season)}</span>
            </div>
            <span className="text-label-caps text-on-surface-variant font-bold">{s.season}</span>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-on-surface-variant/60">Average Temperature</p>
              <p className="text-2xl font-bold text-on-surface group-hover:text-primary transition-colors">{s.avg_temp.toFixed(1)}°C</p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 pt-4 border-t border-outline-variant/10">
              <div>
                <p className="text-[10px] text-label-caps text-on-surface-variant">Humidity</p>
                <p className="font-bold text-on-surface">{s.avg_humidity.toFixed(0)}%</p>
              </div>
              <div>
                <p className="text-[10px] text-label-caps text-on-surface-variant">Precipitation</p>
                <p className="font-bold text-on-surface">{s.total_precip.toFixed(0)}mm</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
