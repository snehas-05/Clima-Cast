import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ChartContainer from './ChartContainer';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function RainfallChart({ data, loading }) {
  if (loading) return <div className="glass-card h-[300px] animate-pulse rounded-3xl" />;

  if (!data || data.length === 0) {
    return (
      <ChartContainer title="Precipitation Analysis" subtitle="Total monthly rainfall accumulation">
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-body-main text-on-surface-variant/60">No rainfall data available.</p>
        </div>
      </ChartContainer>
    );
  }

  const chartData = data.map(d => ({
    ...d,
    name: monthNames[d.month - 1]
  }));

  const getBarColor = (value) => {
    if (value > 100) return '#1A237E'; // Deep blue for high rain
    if (value > 50) return '#3949AB';
    return '#81D4FA'; // Light blue for low rain
  };

  return (
    <ChartContainer title="Precipitation Analysis" subtitle="Total monthly rainfall accumulation">
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 11 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 11 }}
              unit="mm"
            />
            <Tooltip 
              cursor={{ fill: 'rgba(0,0,0,0.05)' }}
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="avg_rainfall" name="Rainfall" radius={[6, 6, 0, 0]} animationDuration={1500}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.avg_rainfall)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
