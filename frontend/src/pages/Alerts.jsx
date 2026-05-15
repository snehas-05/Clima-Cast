import { useEffect, useState } from 'react';
import TopBar from '../components/layout/TopBar';
import Button from '../components/ui/Button';
import AlertCard from '../components/cards/AlertCard';
import { useWeather } from '../hooks/useWeather';
import api from '../services/api';
import LoadingSkeleton, { CardSkeleton } from '../components/ui/LoadingSkeleton';

export default function Alerts() {
  const { data: weatherData } = useWeather();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!weatherData?.city) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/alerts/active?city=${weatherData.city}`);
        setAlerts(response.data.alerts);
        setError(null);
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError('Failed to load real-time alerts. Showing fallback intelligence.');
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, [weatherData?.city]);

  const stats = [
    { label: 'Active Alerts', value: alerts.length.toString().padStart(2, '0'), severity: alerts.length > 0 ? 'Action Needed' : 'Safe', border: alerts.length > 0 ? 'border-error' : 'border-primary', badge: alerts.length > 0 ? 'bg-error/5 text-error' : 'bg-primary/5 text-primary', iconBg: alerts.length > 0 ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary', icon: alerts.length > 0 ? 'emergency_home' : 'verified_user' },
    { label: 'Watch Notifications', value: '04', severity: 'Advisory', border: 'border-tertiary', badge: 'bg-tertiary/5 text-tertiary', iconBg: 'bg-tertiary/10 text-tertiary', icon: 'warning' },
    { label: 'Global Stability Score', value: '92%', severity: 'Safe', border: 'border-primary', badge: 'bg-primary/5 text-primary', iconBg: 'bg-primary/10 text-primary', icon: 'verified_user' },
  ];

  return (
    <>
      <TopBar title="Alerts Intelligence" subtitle={weatherData?.city || "Global Feed"} />
      <div className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-8 max-w-[1440px] mx-auto w-full space-y-[var(--spacing-card-gap)] animate-fade-in">
        
        {/* Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-card-gap)]">
          {loading && alerts.length === 0 ? (
            [1, 2, 3].map(i => <CardSkeleton key={i} />)
          ) : (
            stats.map((s) => (
              <div key={s.label} className={`glass-card p-6 rounded-3xl border-l-4 ${s.border}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`p-2 rounded-lg ${s.iconBg}`}>
                    <span className="material-symbols-outlined">{s.icon}</span>
                  </span>
                  <span className={`text-xs text-label-caps px-2 py-1 rounded ${s.badge}`}>
                    {s.severity}
                  </span>
                </div>
                <h3 className="text-4xl font-bold text-on-surface mb-1">{s.value}</h3>
                <p className="text-on-surface-variant font-medium">{s.label}</p>
              </div>
            ))
          )}
        </section>

        {/* Main Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-card-gap)]">
          
          <div className="lg:col-span-8 flex flex-col gap-[var(--spacing-card-gap)]">
            {/* Risk Map (Static Demo) */}
            <div className="glass-card rounded-3xl overflow-hidden flex flex-col h-[500px]">
              <div className="p-6 flex justify-between items-center border-b border-outline-variant/20">
                <div>
                  <h3 className="text-h3-card-title text-on-surface">Interactive Risk Mapping</h3>
                  <p className="text-sm text-on-surface-variant">Real-time threat visualization for {weatherData?.city || 'Selected Region'}</p>
                </div>
                <div className="flex bg-surface-container rounded-lg p-1">
                  <button className="px-3 py-1.5 rounded-md bg-white shadow-sm text-xs font-bold text-primary">Flood</button>
                  <button className="px-3 py-1.5 rounded-md text-xs font-medium text-on-surface-variant hover:text-primary">Storm</button>
                  <button className="px-3 py-1.5 rounded-md text-xs font-medium text-on-surface-variant hover:text-primary">Fire</button>
                </div>
              </div>
              <div className="flex-1 relative bg-slate-200">
                <img
                  className="w-full h-full object-cover grayscale-[0.2]"
                  alt="Risk Map"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAboWsxqKNgCjj0CkG2SPLULu9Ntl-vDNoCHUjfV81CdyMLDw7tDy8WqfafOBUkSJEsRu9B8ieZldPF9SLwJ5UzPKNEPuNyiSFTvU0DGbbFYxZD9z1dTxroE11DtyPNtgCk96kZX1XmFOEOyFxEdJtddQkpCR9DRymMws0kYbYQwY0RxXO9Y7Q-_iOU8VpqJvH6wwQP_c5TuBjqQc37ugKWNwH9RMv-xIRhUZsEzb1r8MnU_HQtG3GsYaE8k9OmaYNx3O3kuoYYdQje"
                />
                <div className="absolute bottom-6 right-6 flex flex-col gap-2">
                  <div className="glass-card p-3 rounded-xl flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-error animate-pulse" />
                    <span className="text-xs font-bold uppercase tracking-widest text-on-surface">Live Feed: {weatherData?.city || 'Tracking Atmosphere'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Storm Tracking Updates */}
            <div className="glass-card p-6 rounded-3xl">
              <h3 className="text-h3-card-title mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">cyclone</span>
                Storm Tracking Updates
              </h3>
              <div className="space-y-6">
                {loading ? (
                  [1, 2].map(i => (
                    <div key={i} className="flex items-start gap-4 pb-6">
                      <LoadingSkeleton height="0.75rem" width="0.75rem" borderRadius="100%" />
                      <div className="flex-1 space-y-2">
                        <LoadingSkeleton height="1rem" width="30%" />
                        <LoadingSkeleton height="0.75rem" width="100%" />
                      </div>
                    </div>
                  ))
                ) : alerts.length > 0 ? (
                  alerts.map((alert, idx) => (
                    <div key={idx} className="flex items-start gap-4 pb-6 border-b border-outline-variant/20 last:border-0 last:pb-0">
                      <div className={`mt-1 w-2 h-2 rounded-full ${alert.severity === 'extreme' ? 'bg-error ring-4 ring-error/10' : 'bg-primary ring-4 ring-primary/10'}`} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-on-surface">{alert.label}</span>
                          <span className="text-xs font-medium text-on-surface-variant">Live</span>
                        </div>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{alert.explanation}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="mt-1 w-2 h-2 rounded-full bg-outline" />
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-on-surface">No immediate storm threats detected</span>
                        <span className="text-xs font-medium text-on-surface-variant">Now</span>
                      </div>
                      <p className="text-sm text-on-surface-variant leading-relaxed">Atmospheric conditions are currently stable for {weatherData?.city || 'your region'}. ML models continue to monitor for rapid changes.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Active Warnings Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-[var(--spacing-card-gap)]">
            <div className="flex items-center justify-between">
              <h3 className="text-h3-card-title text-on-surface">Live ML Alerts</h3>
              <span className="text-xs text-label-caps text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                {loading ? 'Analyzing...' : `${alerts.length} Active`}
              </span>
            </div>
            <div className="space-y-4">
              {loading && alerts.length === 0 ? (
                [1, 2].map(i => <CardSkeleton key={i} />)
              ) : alerts.length > 0 ? (
                alerts.map((alert, i) => <AlertCard key={i} {...alert} />)
              ) : (
                <div className="glass-card p-8 rounded-3xl text-center space-y-4">
                  <span className="material-symbols-outlined text-4xl text-primary opacity-50">verified</span>
                  <h4 className="font-bold text-on-surface">Atmosphere is Clear</h4>
                  <p className="text-xs text-on-surface-variant">No dangerous thresholds exceeded. AI monitoring is active for temperature, wind, and humidity spikes.</p>
                </div>
              )}
              {error && <p className="text-xs text-error font-bold text-center">{error}</p>}
              <button className="w-full py-4 text-primary font-bold text-sm bg-primary/5 rounded-2xl border border-primary/10 hover:bg-primary/10 transition-colors">
                View Alert History
              </button>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="glass-card p-8 rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <h2 className="text-h2-dashboard text-on-surface leading-tight">Clima-Cast Predictive Safety</h2>
            <p className="text-body-lg text-on-surface-variant">Our proprietary AI engines analyze over 4.2 petabytes of environmental data hourly to provide alert lead times 35% faster than traditional meteorological models. Stay ahead of the atmosphere with precision-engineered foresight.</p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button variant="solid" size="sm">Setup Proactive Alerts</Button>
              <Button variant="ghost" size="sm">Data Ethics Policy</Button>
            </div>
          </div>
          <div className="relative rounded-2xl overflow-hidden aspect-video">
            <img className="w-full h-full object-cover" alt="Data Center" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC8rwdW0sJncrksA8A0xhdsY2t6qy330brdYA6Ii7J-StQ6yEJmC-V7usX-o3FQ5Zd8V-P8eOHVyuAkYpZ-IkJIYkqBrpFcZBTWMDV7ggLIJiTXHrISQTwt2W5Cv1zuiPINT-qADypplXUmQoY3A0GxJwyPmQhyfNALmtGG3TyYUkZJgN-QCQ9OGj8bco795ukEiT4Excq185v5zGa7eO9IlGO9eoQk9i1sGTA6LW3lnD63WAagUOoFhK14S5DTEMggKvpODlRPBbRf" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <p className="text-[10px] text-label-caps opacity-80 uppercase tracking-widest">System Status</p>
              <p className="font-bold text-lg">Hyper-Core AI Operational</p>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
