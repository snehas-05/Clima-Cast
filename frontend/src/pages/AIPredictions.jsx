import TopBar from '../components/layout/TopBar';
import ChartContainer from '../components/charts/ChartContainer';

const heroStats = [
  { label: 'CONFIDENCE', value: '94.2%', sub: 'Neural Mesh Active' },
  { label: 'DATA POINTS', value: '4.2PB', sub: 'Processed Hourly' },
  { label: 'LATENCY', value: '98ms', sub: 'Inference Speed' },
];

const anomaly = {
  icon: 'warning',
  title: 'Climate Anomaly: Pacific SST',
  desc: 'Sea surface temperatures in the Eastern Pacific are 2.1°C above historical average. AI models suggest a 68% probability of early El Niño formation.',
};

const systemCards = [
  { icon: 'dns', label: 'Node Cluster', value: '12/12 Active', statusColor: 'bg-green-500' },
  { icon: 'memory', label: 'AI Processor', value: 'GPU v4 Active', statusColor: 'bg-primary' },
  { icon: 'sync', label: 'Data Sync', value: '< 200ms', statusColor: 'bg-green-500' },
];

export default function AIPredictions() {
  return (
    <>
      <TopBar title="AI Predictions" subtitle="Neural Forecasting Engine" />
      <div className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-8 max-w-[1440px] mx-auto w-full space-y-[var(--spacing-card-gap)]">
        {/* Hero Card */}
        <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <span className="material-symbols-outlined text-primary text-3xl">psychology</span>
              </div>
              <div>
                <h3 className="text-h2-dashboard text-on-surface">Neural Forecast Engine</h3>
                <p className="text-label-caps text-primary">CLIMA-CAST AI v3.2 — OPERATIONAL</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {heroStats.map((s) => (
                <div key={s.label} className="bg-surface-container-low rounded-2xl p-6 border border-white/50">
                  <p className="text-label-caps text-on-surface-variant mb-2">{s.label}</p>
                  <p className="text-h2-dashboard text-primary">{s.value}</p>
                  <p className="text-sm text-on-surface-variant mt-1">{s.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-card-gap)]">
          {/* Anomaly Alert */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-8 border-l-4 border-tertiary">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-tertiary/10 rounded-xl">
                <span className="material-symbols-outlined text-tertiary">{anomaly.icon}</span>
              </div>
              <h4 className="text-h3-card-title text-on-surface">Anomaly Alert</h4>
            </div>
            <h5 className="font-semibold text-on-surface mb-3">{anomaly.title}</h5>
            <p className="text-body-main text-on-surface-variant leading-relaxed">{anomaly.desc}</p>
            <div className="mt-6 pt-4 border-t border-outline-variant/30">
              <p className="text-label-caps text-on-surface-variant mb-2">ANOMALY SEVERITY</p>
              <div className="h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full w-[68%] bg-gradient-to-r from-tertiary to-error rounded-full" />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-on-surface-variant">
                <span>Low</span><span>68% — Moderate-High</span><span>Critical</span>
              </div>
            </div>
          </div>

          {/* Precipitation Heatmap */}
          <div className="lg:col-span-8">
            <ChartContainer title="Precipitation Probability Matrix" subtitle="AI-predicted 30-day precipitation likelihood by region">
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }, (_, i) => {
                  const opacity = Math.random() * 0.8 + 0.1;
                  return (
                    <div key={i} className="aspect-square rounded-lg bg-primary transition-all hover:scale-110 cursor-crosshair" style={{ opacity }} title={`Day ${i + 1}: ${Math.round(opacity * 100)}%`} />
                  );
                })}
              </div>
              <div className="flex justify-between mt-4 text-label-caps text-on-surface-variant">
                <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
              </div>
            </ChartContainer>
          </div>

          {/* Temperature Projection */}
          <div className="lg:col-span-8">
            <ChartContainer title="30-Day Temperature Projection" subtitle="Neural mesh predicted trend with confidence intervals">
              <div className="h-64 relative">
                <svg className="w-full h-full" viewBox="0 0 800 250" preserveAspectRatio="none">
                  <path d="M0,200 C100,180 200,160 300,140 C400,120 500,100 600,130 C700,160 800,120 800,120" fill="rgba(207, 188, 255, 0.15)" stroke="none" />
                  <path d="M0,200 L0,250 L800,250 L800,120" fill="rgba(207, 188, 255, 0.08)" stroke="none" />
                  <path d="M0,200 C100,180 200,160 300,140 C400,120 500,100 600,130 C700,160 800,120" fill="none" stroke="#4f378a" strokeWidth="3" strokeLinecap="round" />
                  <path d="M0,220 C100,210 200,190 300,170 C400,150 500,130 600,160 C700,190 800,150" fill="none" stroke="#cbc4d2" strokeWidth="1" strokeDasharray="4" />
                </svg>
              </div>
              <div className="flex gap-8 mt-4">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary" /><span className="text-label-caps text-on-surface-variant">AI Prediction</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-0.5 bg-outline-variant" /><span className="text-label-caps text-on-surface-variant">Historical Avg</span></div>
              </div>
            </ChartContainer>
          </div>

          {/* System Status */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-8">
            <h4 className="text-h3-card-title text-on-surface mb-6">System Status</h4>
            <div className="space-y-4">
              {systemCards.map((s) => (
                <div key={s.label} className="flex items-center gap-4 p-4 bg-surface-container-low rounded-2xl border border-white/50">
                  <span className="material-symbols-outlined text-primary">{s.icon}</span>
                  <div className="flex-1">
                    <p className="text-body-main font-semibold text-on-surface">{s.label}</p>
                    <p className="text-sm text-on-surface-variant">{s.value}</p>
                  </div>
                  <div className={`w-3 h-3 ${s.statusColor} rounded-full`} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
