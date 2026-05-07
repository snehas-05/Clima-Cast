import TopBar from '../components/layout/TopBar';
import MetricCard from '../components/cards/MetricCard';
import ChartContainer from '../components/charts/ChartContainer';
import ProgressBar from '../components/charts/ProgressBar';

const metrics = [
  { icon: 'device_thermostat', label: 'MEAN TEMP (30D)', value: '24.8°C', trend: '+2.4%', trendDirection: 'up' },
  { icon: 'water_drop', label: 'TOTAL PRECIPITATION', value: '42.5mm', trend: '-12.1%', trendDirection: 'down', iconBg: 'bg-secondary/10', iconColor: 'text-secondary' },
  { icon: 'verified', label: 'FORECAST ACCURACY', value: '96.8%', trend: 'High', trendDirection: 'up', iconBg: 'bg-tertiary/10', iconColor: 'text-tertiary' },
  { icon: 'air', label: 'AVG WIND SPEED', value: '14km/h', trend: 'Stable' },
];

const patterns = [
  { icon: 'cyclone', title: 'Atmospheric River Event', desc: '82% probability of increased humidity patterns over the Pacific corridor detected.', iconBg: 'bg-primary/10', iconColor: 'text-primary' },
  { icon: 'warning', title: 'Thermal Inversion Alert', desc: 'Historical comparison suggests a 4-day static cold-front pattern emerging.', iconBg: 'bg-tertiary/10', iconColor: 'text-tertiary' },
];

const models = [
  { label: 'Clima-Cast AI (Proprietary)', time: '98.2ms', percent: 100, color: 'bg-primary' },
  { label: 'ECMWF Dataset', time: '420.5ms', percent: 40, color: 'bg-on-surface-variant/40' },
  { label: 'GFS Model', time: '580.1ms', percent: 25, color: 'bg-on-surface-variant/40' },
];

export default function Analytics() {
  return (
    <>
      <TopBar title="Climate Intelligence" subtitle="Advanced Analytics Dashboard" />
      <div className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-8 max-w-[1440px] mx-auto w-full space-y-[var(--spacing-card-gap)]">
        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-[var(--spacing-card-gap)]">
          {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-card-gap)]">
          {/* Main Chart */}
          <div className="lg:col-span-8">
            <ChartContainer
              title="Historical Climate Correlation"
              subtitle="Comparative analysis of temperature vs precipitation over 12 months"
              className="h-full flex flex-col"
              actions={
                <div className="flex bg-surface-container-low p-1 rounded-full border border-outline-variant/30">
                  <button className="px-4 py-1.5 rounded-full bg-white text-primary shadow-sm text-label-caps">12 Months</button>
                  <button className="px-4 py-1.5 rounded-full text-on-surface-variant text-label-caps hover:text-primary transition-colors">YTD</button>
                  <button className="px-4 py-1.5 rounded-full text-on-surface-variant text-label-caps hover:text-primary transition-colors">Max</button>
                </div>
              }
            >
              <div className="flex-1 relative w-full group min-h-[300px]">
                <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 800 300">
                  <line stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="50" y2="50" />
                  <line stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="150" y2="150" />
                  <line stroke="#E2E8F0" strokeDasharray="4" strokeWidth="1" x1="0" x2="800" y1="250" y2="250" />
                  <path d="M0,300 L0,220 C100,240 200,100 300,150 C400,200 500,50 600,100 C700,150 800,200 L800,300 Z" fill="rgba(207, 188, 255, 0.15)" stroke="none" />
                  <path d="M0,220 C100,240 200,100 300,150 C400,200 500,50 600,100 C700,150 800,200" fill="none" stroke="#6750a4" strokeLinecap="round" strokeWidth="3" />
                  <path d="M0,150 C100,130 200,180 300,100 C400,80 500,120 600,60 C700,90 800,50" fill="none" stroke="#4f378a" strokeLinecap="round" strokeWidth="3" />
                  <g className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <line stroke="#4f378a" strokeDasharray="2" strokeWidth="1" x1="400" x2="400" y1="0" y2="300" />
                    <circle cx="400" cy="80" fill="#4f378a" r="6" stroke="white" strokeWidth="2" />
                    <rect fill="white" filter="drop-shadow(0 10px 15px rgba(0,0,0,0.1))" height="60" rx="12" width="120" x="410" y="50" />
                    <text className="fill-primary font-bold text-[12px] uppercase tracking-wider" x="425" y="75">SEP 12, 2024</text>
                    <text className="fill-on-surface-variant text-[11px]" x="425" y="95">Temp: 22.4°C</text>
                  </g>
                </svg>
              </div>
              <div className="flex gap-8 mt-6">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary" /><span className="text-label-caps text-on-surface-variant">Ambient Temperature (°C)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary-container" /><span className="text-label-caps text-on-surface-variant">Rainfall Intensity (mm)</span></div>
              </div>
            </ChartContainer>
          </div>

          {/* AI Pattern Insights */}
          <div className="lg:col-span-4 glass-card p-8 rounded-3xl flex flex-col">
            <h4 className="text-h3-card-title text-on-surface mb-6">AI Pattern Insights</h4>
            <div className="space-y-6">
              {patterns.map((p) => (
                <div key={p.title} className="flex gap-4 p-4 rounded-2xl bg-surface-container-low border border-white/50">
                  <div className={`w-12 h-12 rounded-xl ${p.iconBg} flex items-center justify-center shrink-0`}>
                    <span className={`material-symbols-outlined ${p.iconColor}`}>{p.icon}</span>
                  </div>
                  <div>
                    <h5 className="text-body-main font-semibold text-on-surface">{p.title}</h5>
                    <p className="text-sm text-on-surface-variant/70">{p.desc}</p>
                  </div>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-outline-variant/30">
                <p className="text-label-caps text-on-surface-variant mb-4">CONFIDENCE SCORE</p>
                <div className="relative w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="absolute left-0 top-0 h-full w-[94%] bg-gradient-to-r from-primary to-cyan-400" />
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-xs font-semibold text-primary">Extremely High</span>
                  <span className="text-xs font-bold text-on-surface">94%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Forecast Accuracy Radar */}
          <div className="lg:col-span-6 glass-card p-8 rounded-3xl">
            <div className="flex justify-between items-start mb-8">
              <h4 className="text-h3-card-title text-on-surface">Forecast Accuracy Radar</h4>
              <button className="text-primary hover:underline text-label-caps">Details</button>
            </div>
            <div className="flex items-center justify-center py-4">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" fill="none" r="45" stroke="#E2E8F0" strokeWidth="0.5" />
                  <circle cx="50" cy="50" fill="none" r="30" stroke="#E2E8F0" strokeWidth="0.5" />
                  <circle cx="50" cy="50" fill="none" r="15" stroke="#E2E8F0" strokeWidth="0.5" />
                  <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M82 18 L18 82" stroke="#E2E8F0" strokeWidth="0.5" />
                  <polygon fill="rgba(103, 80, 164, 0.2)" points="50,15 80,40 70,75 30,75 20,40" stroke="#6750a4" strokeWidth="2" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-primary">96.8%</span>
                  <span className="text-[10px] text-label-caps text-on-surface-variant">AVERAGE</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                <p className="text-[10px] text-label-caps text-on-surface-variant mb-1">TEMP PREDICTION</p>
                <p className="text-sm font-bold text-on-surface">±0.4°C Variance</p>
              </div>
              <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/10">
                <p className="text-[10px] text-label-caps text-on-surface-variant mb-1">STORM TIMING</p>
                <p className="text-sm font-bold text-on-surface">92% On-Target</p>
              </div>
            </div>
          </div>

          {/* Model Efficiency */}
          <div className="lg:col-span-6 glass-card p-8 rounded-3xl">
            <h4 className="text-h3-card-title text-on-surface mb-8">Model Efficiency</h4>
            <div className="space-y-6">
              {models.map((m) => (
                <ProgressBar key={m.label} label={m.label} value={m.percent} maxLabel={m.time} barColor={m.color} />
              ))}
            </div>
            <p className="mt-8 text-xs text-on-surface-variant leading-relaxed">
              Performance metrics based on real-time inference speed of atmospheric mesh rendering. Clima-Cast AI utilizes localized neural-grid processing for superior latency.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
