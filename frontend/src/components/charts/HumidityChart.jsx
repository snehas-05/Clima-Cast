import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartContainer from './ChartContainer';

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function HumidityChart({ data, loading }) {
  if (loading) return <div className="glass-card h-[300px] animate-pulse rounded-3xl" />;

  if (!data || data.length === 0) {
    return (
      <ChartContainer title="Humidity Distribution" subtitle="Monthly average humidity levels">
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-body-main text-on-surface-variant/60">No humidity data available.</p>
        </div>
      </ChartContainer>
    );
  }

  const chartData = data.map(d => ({
    ...d,
    name: monthNames[d.month - 1]
  }));

  return (
    <ChartContainer title="Humidity Distribution" subtitle="Monthly average humidity levels">
      <div className="h-[250px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorHumidity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00BCD4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00BCD4" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              unit="%"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px rgba(0,0,0,0.1)' }}
              itemStyle={{ color: '#00BCD4', fontWeight: 'bold' }}
            />
            <Area 
              type="monotone" 
              dataKey="avg_humidity" 
              name="Humidity"
              stroke="#00BCD4" 
              fillOpacity={1} 
              fill="url(#colorHumidity)" 
              strokeWidth={3}
              animationDuration={2000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
