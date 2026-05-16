import React, { useMemo } from 'react';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Scatter, Cell } from 'recharts';
import ChartContainer from './ChartContainer';
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { usePreferences } from '../../context/PreferencesContext';
import { formatTemp } from '../../utils/temperature';

const CustomTooltip = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isMarker = !!data.label;

    return (
      <div className="bg-white/10 backdrop-blur-xl p-4 border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] min-w-[200px] text-white">
        <p className="text-[10px] font-black uppercase tracking-[2px] opacity-60 mb-2">
          {format(parseISO(data.date), 'MMMM dd, yyyy')}
        </p>
        
        {isMarker ? (
          <div className="space-y-1">
            <p className="text-sm font-medium text-blue-200">{data.label}</p>
            <p className="text-2xl font-black">{data.value}</p>
            <p className="text-[10px] opacity-70 italic">Climate Memory Marker</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-xs opacity-60 font-bold uppercase">Temp</span>
              <span className="text-2xl font-black leading-none">{formatTemp(data.temperature, unit)}°</span>
            </div>
            {data.precip !== null && data.precip > 0 && (
              <div className="flex justify-between items-end border-t border-white/10 pt-2">
                <span className="text-xs opacity-60 font-bold uppercase">Rainfall</span>
                <span className="text-base font-bold">{data.precip.toFixed(1)}mm</span>
              </div>
            )}
            <div className="pt-1">
               <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                data.type === 'historical' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
              }`}>
                {data.type === 'historical' ? '• Memory' : '• Prediction'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function PastFutureTimeline({ data, loading }) {
  const { unit } = usePreferences();
  const timelineData = data?.timeline || [];
  const markers = data?.markers || [];
  const interpretation = data?.interpretation || "";

  const { chartData, todayIndex, hasPredictions } = useMemo(() => {
    const todayIdx = timelineData.findIndex(d => d.type === 'predicted');
    const hasPred = todayIdx !== -1;
    return {
      chartData: timelineData,
      todayIndex: todayIdx,
      hasPredictions: hasPred
    };
  }, [timelineData]);

  if (loading) return <ChartContainer title="Climate Timeline" className="h-[500px] animate-pulse" />;

  if (!timelineData.length) return (
    <ChartContainer title="Climate Timeline">
      <div className="h-[400px] flex items-center justify-center text-on-surface-variant opacity-50 font-medium">
        Establishing climate grounding...
      </div>
    </ChartContainer>
  );

  const todayDate = todayIndex > 0 ? timelineData[todayIndex].date : null;

  return (
    <ChartContainer 
      title="Timeline Experience" 
      subtitle={interpretation}
      className="overflow-hidden group"
    >
      {/* Interpretation Layer */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-2 px-4 py-2 bg-primary/5 border border-primary/10 rounded-full">
          <div className={`w-2 h-2 rounded-full ${hasPredictions ? 'bg-primary animate-pulse' : 'bg-on-surface-variant/30'}`} />
          <span className="text-[10px] font-black text-primary uppercase tracking-[1px]">
            {hasPredictions ? interpretation : "Prediction Engine Unavailable"}
          </span>
      </div>

      {!hasPredictions && !loading && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="px-6 py-4 bg-background/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
            <p className="text-xs font-bold text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500">warning</span>
              Limited historical grounding available for this region
            </p>
          </div>
        </div>
      )}

      <div className="h-[450px] w-full mt-4 -ml-4 sm:ml-0 overflow-x-auto no-scrollbar">
        <div className="min-w-[800px] h-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <defs>
                <linearGradient id="dividerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FFC107" stopOpacity={0} />
                  <stop offset="50%" stopColor="#FFC107" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#FFC107" stopOpacity={0} />
                </linearGradient>
                <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>
              
              <CartesianGrid strokeDasharray="10 10" vertical={false} stroke="rgba(255,255,255,0.05)" />
              
              <XAxis 
                dataKey="date" 
                tickFormatter={(str) => format(parseISO(str), 'MMM d')}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
                minTickGap={60}
                padding={{ left: 20, right: 20 }}
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 700 }}
                unit="°"
                domain={['auto', 'auto']}
              />
              
              <Tooltip 
                content={<CustomTooltip unit={unit} />} 
                cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1 }}
                wrapperStyle={{ outline: 'none' }}
              />

              {/* Confidence Interval */}
              <Area
                type="monotone"
                dataKey={(d) => d.type === 'predicted' ? [d.temp_lower, d.temp_upper] : null}
                stroke="none"
                fill="#FFC107"
                fillOpacity={0.05}
                name="Confidence Range"
              />

              {/* Historical Path (Memory) */}
              <Line
                type="monotone"
                dataKey={(d) => d.type === 'historical' ? d.temperature : null}
                stroke="#03A9F4"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 4, fill: '#03A9F4', stroke: '#fff', strokeWidth: 2 }}
                animationDuration={2500}
              />

              {/* Predicted Path (Vision) */}
              <Line
                type="monotone"
                dataKey={(d) => d.type === 'predicted' ? d.temperature : null}
                stroke="#FFC107"
                strokeWidth={3}
                strokeDasharray="6 4"
                dot={false}
                activeDot={{ r: 4, fill: '#FFC107', stroke: '#fff', strokeWidth: 2 }}
                style={{ filter: 'drop-shadow(0 0 8px rgba(255, 193, 7, 0.4))' }}
                animationDuration={2500}
              />

              {/* Memory Markers */}
              <Scatter data={markers} name="Markers">
                {markers.map((entry, index) => (
                  <Cell 
                    key={`marker-${index}`} 
                    r={6}
                    fill={entry.type === 'hot' ? '#FF5252' : entry.type === 'cold' ? '#03A9F4' : '#4CAF50'} 
                    className="animate-pulse cursor-pointer"
                    style={{ filter: 'drop-shadow(0 0 10px currentColor)' }}
                  />
                ))}
              </Scatter>

              {/* Cinematic Divider */}
              {todayDate && (
                <ReferenceLine 
                  x={todayDate} 
                  stroke="url(#dividerGradient)" 
                  strokeWidth={2}
                  strokeOpacity={0.8}
                >
                  <label 
                    content={({ viewBox }) => {
                      const { x, y } = viewBox;
                      return (
                        <g transform={`translate(${x}, 20)`}>
                          <rect x="-40" y="0" width="80" height="24" rx="12" fill="rgba(255, 193, 7, 0.15)" className="backdrop-blur-sm" />
                          <text x="0" y="16" textAnchor="middle" className="text-[10px] font-black fill-amber-400 tracking-[2px]">
                            TODAY
                          </text>
                          <text x="-15" y="45" textAnchor="end" className="text-[9px] font-black fill-white/20 tracking-[1.5px] uppercase">
                            Memory
                          </text>
                          <text x="15" y="45" textAnchor="start" className="text-[9px] font-black fill-amber-400/30 tracking-[1.5px] uppercase">
                            Prediction
                          </text>
                        </g>
                      );
                    }}
                  />
                </ReferenceLine>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-center gap-8 mt-4 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-1 bg-blue-500 rounded-full" />
          <span className="text-[10px] font-black text-on-surface-variant/60 uppercase tracking-widest">Atmospheric Memory</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-6 h-1 border-t-2 border-dashed border-amber-500" />
          <span className="text-[10px] font-black text-amber-500/80 uppercase tracking-widest">Future Trajectory</span>
        </div>
      </div>
    </ChartContainer>
  );
}
