import { Link, useOutletContext } from 'react-router-dom';
import Button from '../components/ui/Button';
import FeatureItem from '../components/cards/FeatureItem';

const heroWidgets = [
  { icon: 'device_thermostat', value: '24°C', label: 'TEMPERATURE', iconColor: 'text-sky-400' },
  { icon: 'air', value: '12 km/h', label: 'WIND VELOCITY', isCenter: true, iconColor: 'text-blue-400' },
  { icon: 'water_drop', value: '64%', label: 'HUMIDITY', iconColor: 'text-cyan-400' },
];

const features = [
  { icon: 'history', iconBg: 'bg-slate-800/50', iconColor: 'text-sky-400', title: 'Atmospheric Memory', description: 'Grounded historical climate modeling drawing from decades of continuous environmental observation.' },
  { icon: 'model_training', iconBg: 'bg-slate-800/50', iconColor: 'text-blue-400', title: 'Adaptive Forecasting Engine', description: 'Intelligent real-time weather reasoning that dynamically adjusts to shifting micro-climate conditions.' },
];

export default function Home() {
  return (
    <div className="mesh-gradient">
      <main className="max-w-[1440px] mx-auto px-6 lg:px-[var(--spacing-container-padding)]">
        {/* Hero Section */}
        <section className="relative pt-16 pb-12 flex flex-col items-center text-center overflow-hidden">
          <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-40 pointer-events-none">
            <div className="w-[800px] h-[800px] rounded-full blur-[120px] bg-gradient-to-br from-blue-900/30 via-cyan-900/20 to-slate-950" />
          </div>

          <div className="space-y-4 max-w-3xl">
            <span className="text-label-caps text-cyan-400 tracking-[0.2em] flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
              LIVE CLIMATE STATE
            </span>
            <h1 className="text-h1-hero text-white leading-tight font-light">
              Atmospheric <span className="text-cyan-400 italic">Intelligence.</span>
            </h1>
            <p className="text-body-lg text-slate-400 max-w-2xl mx-auto font-light">
              Adaptive forecasting and environmental awareness. Experience clear atmospheric insights for a changing climate.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center pt-6">
              <Link to="/forecast">
                <Button variant="primary" size="lg" className="bg-slate-800 text-white hover:bg-slate-700 border border-slate-700/50 shadow-lg shadow-black/20">Explore Forecasts</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="glass" size="lg" className="text-slate-300 hover:text-white border-transparent bg-transparent hover:bg-white/5">Open Dashboard</Button>
              </Link>
            </div>
          </div>

          {/* Floating Widgets */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-card-gap)] w-full max-w-5xl mx-auto">
            {heroWidgets.map((widget, i) => (
              <div
                key={i}
                className={`glass-card p-8 rounded-xl flex flex-col items-center space-y-4
                  ${widget.isCenter ? 'shadow-2xl border-blue-500/20 md:scale-110 z-10 bg-slate-900/60' : 'bg-slate-900/40'}`}
              >
                <span className={`material-symbols-outlined ${widget.iconColor} text-5xl opacity-80`}>
                  {widget.icon}
                </span>
                <div className="text-center">
                  <div className="text-h2-dashboard text-white tracking-tight">{widget.value}</div>
                  <div className="text-label-caps text-slate-400 mt-1">{widget.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weather Intelligence Preview */}
        <section className="py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">
              Environmental Awareness.
            </h2>
            <div className="space-y-6">
              {features.map((feat) => (
                <FeatureItem key={feat.title} {...feat} />
              ))}
            </div>
          </div>
          <div className="glass-card rounded-2xl overflow-hidden aspect-video relative group">
            <img
              alt="Atmospheric Visualization"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDsnvwZ33ROCWEpsHOBFRkoHhS84fgDaRaLFjsw7W05HDNeIDIm4D43Z0qA8St4qAp2AF0JgHRJzO3EmCia1cGL0S7qwrb0Di3v4eaB7roKtWaKbGgrvPb-lKJKoflL5gTfsG7btylYGEorQwR1fZhZhNlB6lbAdxb4QBCdf7HKwX1K1asAUlMQSi5CjXIkIzVzBDgFLPqmm8ptimqa9D1NaF2h0il1Eg0XI_S6TlyQ2EDIKeJX1qRQoeJY28AdxWjo6n1_ZFBs7RV"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <span className="text-label-caps bg-primary text-on-primary px-3 py-1 rounded-full">
                REAL-TIME RENDER
              </span>
            </div>
          </div>
        </section>

        {/* Climate Timeline Experience Centerpiece */}
        <section className="py-32 relative">
          <div className="text-center mb-16 space-y-4 relative z-10">
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">Climate Timeline Experience</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-light">Seamlessly navigate from historical atmospheric memory to real-time present conditions, and explore glowing future projection paths.</p>
          </div>
          
          <div className="glass-card p-10 rounded-3xl border border-white/5 relative overflow-hidden bg-slate-950/40 shadow-2xl backdrop-blur-2xl">
            {/* Timeline Ambient Glow & Noise */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGZpbHRlciBpZD0ibiI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuOCIgbnVtT2N0YXZlcz0iNCIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==')] pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-48 bg-cyan-500/10 blur-[100px] pointer-events-none" />
            
            <div className="flex items-center justify-between relative z-10 pt-4">
              {/* Past */}
              <div className="flex-1 space-y-4 opacity-50 transition-opacity hover:opacity-80">
                <div className="text-label-caps text-slate-400 tracking-wider">Past Observations</div>
                <div className="h-0.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full w-full bg-gradient-to-r from-transparent to-slate-500" />
                </div>
                <div className="flex justify-between text-xs text-slate-500 tracking-wider">
                  <span>1990</span>
                  <span>2010</span>
                </div>
              </div>

              {/* Present Node */}
              <div className="px-8 flex flex-col items-center relative z-20 -mt-2">
                <div className="text-label-caps text-cyan-400 mb-4 tracking-widest drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">Live State</div>
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-cyan-400 animate-ping opacity-30" />
                  <div className="w-5 h-5 rounded-full bg-cyan-400 border-2 border-slate-900 shadow-[0_0_20px_rgba(34,211,238,0.6)] relative z-10" />
                </div>
                <div className="mt-4 text-sm font-medium text-white tracking-wide">Today</div>
              </div>

              {/* Future */}
              <div className="flex-1 space-y-4 relative">
                <div className="text-label-caps text-blue-400 text-right tracking-wider">Future Trajectory</div>
                <div className="h-0.5 w-full bg-slate-800 rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent w-full animate-pulse" />
                </div>
                <div className="flex justify-between text-xs text-slate-400 tracking-wider">
                  <span>+5 YRS</span>
                  <span>+20 YRS</span>
                </div>
              </div>
            </div>

            {/* Timeline Data Cards */}
            <div className="grid grid-cols-3 gap-6 mt-12 relative z-10">
              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 text-center">
                <div className="material-symbols-outlined text-slate-400 mb-2">history</div>
                <div className="text-sm text-slate-300">Historical Grounding</div>
              </div>
              <div className="bg-cyan-900/20 border border-cyan-800/50 rounded-xl p-5 text-center shadow-[0_0_15px_rgba(34,211,238,0.1)]">
                <div className="material-symbols-outlined text-cyan-400 mb-2">sensors</div>
                <div className="text-sm text-white">Live Environmental Sync</div>
              </div>
              <div className="bg-blue-900/20 border border-blue-800/50 rounded-xl p-5 text-center">
                <div className="material-symbols-outlined text-blue-400 mb-2">trending_up</div>
                <div className="text-sm text-slate-300">Adaptive Forecasting</div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Climate Preview */}
        <section className="py-24">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-light text-white tracking-tight">Live Climate Preview</h2>
            <p className="text-slate-400 max-w-2xl mx-auto font-light">Real-time atmospheric conditions reflecting the current environmental state.</p>
          </div>
          
          <div className="glass-card rounded-3xl overflow-hidden border border-slate-800/60 bg-slate-950/40 shadow-2xl backdrop-blur-xl">
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 h-[400px]">
              {/* Side Panel */}
              <div className="col-span-1 md:col-span-1 lg:col-span-2 bg-slate-950/80 p-8 flex flex-col justify-between border-r border-white/5 relative z-10">
                <div>
                  <div className="flex items-center gap-3 text-cyan-400 mb-6">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
                    <span className="text-label-caps tracking-widest">GLOBAL WATCH</span>
                  </div>
                  <div className="mb-8">
                    <div className="text-7xl font-light text-white tracking-tight mb-2">24°</div>
                    <h3 className="text-xl font-light text-slate-300 mb-1">Tokyo, JP</h3>
                    <p className="text-slate-500 text-sm">Atmospheric instability detected.</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Air Quality Index</span>
                      <span className="text-yellow-400 font-medium">Moderate (84)</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 w-[40%]" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Humidity</div>
                      <div className="text-xl text-white">72%</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-xs uppercase tracking-wider mb-1">Pressure</div>
                      <div className="text-xl text-white">1012 hPa</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Map/Visual Area */}
              <div className="col-span-1 md:col-span-3 lg:col-span-3 relative overflow-hidden bg-slate-900">
                 <img
                  className="absolute inset-0 w-full h-full object-cover mix-blend-screen opacity-60"
                  alt="Atmospheric simulation"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7om3JI9Nb6OWWkb34mQbKIQ5qj5YiartZZiMDIXw8A13xxk7yLwBVayMQRxh20vLri0c3BkOHTwPXXL88sjbphg_PbrTaSPA5pMsRsJxTLVwBffTlh5hqbgf3oDtVS0TV03ov8oyWJxnavXV0FvNGsPM_9ODXg_CxD-rekdnrjQ1JWMYSwkVpRXjnjVEdy7a0nAzmY0D7Ibh4GydHe6ikzIVfz3V3sEl7P1JPO5UHk4yMhrSc32ie_mVAU9ceDpPkzeNb2h3SII9-"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 to-transparent" />
                <div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay" />
                
                <div className="absolute bottom-8 right-8 bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-400">storm</span>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider">System Alert</div>
                    <div className="text-white font-medium">Approaching Front</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-32">
          <div className="max-w-4xl mx-auto text-center space-y-10 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <h2 className="text-4xl md:text-5xl font-light text-white tracking-tight relative z-10">
              Experience <span className="text-cyan-400">Atmospheric Intelligence.</span>
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
              <Link to="/dashboard">
                <Button variant="primary" size="lg" className="bg-white text-slate-900 hover:bg-slate-200 border-none min-w-[200px] shadow-lg shadow-white/10">Open Dashboard</Button>
              </Link>
              <Link to="/forecast">
                <Button variant="glass" size="lg" className="min-w-[200px] border-slate-700/50 hover:bg-slate-800 hover:border-slate-600 text-slate-300">Explore Forecasts</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
