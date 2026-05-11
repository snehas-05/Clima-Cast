import React from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Scatter } from 'recharts';
import ChartContainer from './ChartContainer';
import { format, parseISO } from 'date-fns';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 border border-outline-variant/30 rounded-2xl shadow-2xl min-w-[180px]">
        <p className="text-label-caps text-on-surface-variant mb-2">{format(parseISO(data.date), 'MMM dd, yyyy')}</p>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-on-surface-variant">Temperature:</span>
            <span className="text-base font-bold text-on-surface">{data.temperature.toFixed(1)}°C</span>
          </div>
          <div className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full inline-block ${
            data.type === 'historical' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
          }`}>
            {data.type}
          </div>
          {data.type === 'predicted' && data.temp_upper && (
            <div className="mt-2 pt-2 border-t border-outline-variant/20">
              <p className="text-[10px] text-on-surface-variant uppercase">Confidence Range</p>
              <p className="text-xs font-semibold text-on-surface-variant">
                {data.temp_lower.toFixed(1)}° - {data.temp_upper.toFixed(1)}°
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export default function PastFutureTimeline({ data, loading }) {
  if (loading) return <ChartContainer title="Past + Future Timeline" className="h-[450px] animate-pulse" />;

  if (!data || data.length === 0) return (
    <ChartContainer title="Past + Future Timeline">
      <div className="h-[350px] flex items-center justify-center">No forecasting data available.</div>
    </ChartContainer>
  );

  // Find index where predicted starts
  const todayIndex = data.findIndex(d => d.type === 'predicted');
  const todayDate = todayIndex > 0 ? data[todayIndex].date : null;

  // Prepare data for seamless connection: 
  // We need a shared point where historical ends and predicted begins.
  // The API should ideally provide this, but we'll ensure it here.
  
  return (
    <ChartContainer 
      title="Past + Future Timeline" 
      subtitle="30-day historical intelligence + 7-day Prophet ML forecasting"
      className="overflow-hidden"
    >
      <div className="h-[400px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="predictionGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FFC107" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#FFC107" stopOpacity={0}/>
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(str) => format(parseISO(str), 'MMM d')}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 10 }}
              minTickGap={40}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748B', fontSize: 10 }}
              unit="°C"
              domain={['auto', 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Confidence Interval Area */}
            <Area
              type="monotone"
              dataKey={(d) => d.type === 'predicted' ? [d.temp_lower, d.temp_upper] : null}
              stroke="none"
              fill="#FFC107"
              fillOpacity={0.1}
              name="Confidence Range"
            />

            {/* Historical Line */}
            <Line
              type="monotone"
              dataKey={(d) => d.type === 'historical' ? d.temperature : null}
              stroke="#03A9F4"
              strokeWidth={4}
              dot={false}
              activeDot={{ r: 6, fill: '#03A9F4', stroke: '#fff', strokeWidth: 2 }}
              name="Historical"
              animationDuration={2000}
            />

            {/* Predicted Line (Dashed) */}
            <Line
              type="monotone"
              dataKey={(d) => d.type === 'predicted' ? d.temperature : null}
              stroke="#FFC107"
              strokeWidth={4}
              strokeDasharray="8 5"
              dot={false}
              activeDot={{ r: 6, fill: '#FFC107', stroke: '#fff', strokeWidth: 2 }}
              name="Predicted"
              style={{ filter: 'drop-shadow(0 0 5px rgba(255, 193, 7, 0.5))' }}
              animationDuration={2000}
            />

            {/* Shared Point to bridge the gap */}
            {todayIndex > 0 && (
                <Scatter 
                    data={[data[todayIndex-1], data[todayIndex]]} 
                    line={{ stroke: '#FFC107', strokeWidth: 2, strokeDasharray: '5 5' }} 
                    shape={() => null}
                />
            )}

            {todayDate && (
              <ReferenceLine 
                x={todayDate} 
                stroke="#FFC107" 
                strokeWidth={2}
                label={{ 
                  value: 'TODAY', 
                  position: 'top', 
                  fill: '#FFC107', 
                  fontSize: 10, 
                  fontWeight: 'bold',
                  letterSpacing: '1px'
                }}
              >
              </ReferenceLine>
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center gap-6 mt-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-1 bg-blue-500 rounded-full" />
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Historical</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-1 bg-amber-500 rounded-full border-t border-dashed" />
          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">ML Prediction</span>
        </div>
      </div>
    </ChartContainer>
  );
}
