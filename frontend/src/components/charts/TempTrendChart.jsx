import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import ChartContainer from './ChartContainer';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md p-4 border border-outline-variant/30 rounded-2xl shadow-xl">
        <p className="text-label-caps text-on-surface-variant mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-body-main font-semibold text-on-surface">
              {entry.name}: {entry.value.toFixed(1)}°C
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function TempTrendChart({ data, loading }) {
  if (loading) {
    return (
      <ChartContainer title="Temperature Trends" subtitle="Annual average, maximum, and minimum temperatures">
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <p className="text-label-caps text-on-surface-variant">Analyzing Historical Data...</p>
          </div>
        </div>
      </ChartContainer>
    );
  }

  if (!data || data.length === 0) {
    return (
      <ChartContainer title="Temperature Trends" subtitle="Annual average, maximum, and minimum temperatures">
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-body-main text-on-surface-variant/60">No analytics data available for this selection.</p>
        </div>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer 
      title="Temperature Trends" 
      subtitle="Annual average, maximum, and minimum temperatures"
    >
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <defs>
              <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF7043" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#FF7043" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="year" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 12 }}
              minTickGap={30}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748B', fontSize: 12 }}
              unit="°C"
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36}/>
            <Line 
              type="monotone" 
              dataKey="max_temp" 
              name="Max Temp" 
              stroke="#FF7043" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#FF7043', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="avg_temp" 
              name="Avg Temp" 
              stroke="#00BCD4" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#00BCD4', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
            <Line 
              type="monotone" 
              dataKey="min_temp" 
              name="Min Temp" 
              stroke="#7E57C2" 
              strokeWidth={3}
              dot={{ r: 4, fill: '#7E57C2', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
