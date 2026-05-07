import TopBar from '../components/layout/TopBar';
import HourCard from '../components/cards/HourCard';
import InsightCard from '../components/cards/InsightCard';

const hourly = [
  { time: '12 PM', icon: 'wb_sunny', temperature: '28°', isActive: true, iconStyle: { fontVariationSettings: "'FILL' 1" } },
  { time: '1 PM', icon: 'wb_sunny', temperature: '29°', iconStyle: { fontVariationSettings: "'FILL' 1" } },
  { time: '2 PM', icon: 'partly_cloudy_day', temperature: '27°' },
  { time: '3 PM', icon: 'cloud', temperature: '25°' },
  { time: '4 PM', icon: 'rainy', temperature: '22°' },
  { time: '5 PM', icon: 'rainy', temperature: '20°' },
  { time: '6 PM', icon: 'cloud', temperature: '19°' },
  { time: '7 PM', icon: 'nights_stay', temperature: '18°' },
];

const dailyForecast = [
  { day: 'Tue', icon: 'wb_sunny', high: '30°', low: '18°', condition: 'Clear Skies', precip: '5%' },
  { day: 'Wed', icon: 'partly_cloudy_day', high: '28°', low: '17°', condition: 'Partly Cloudy', precip: '15%' },
  { day: 'Thu', icon: 'rainy', high: '22°', low: '14°', condition: 'Moderate Rain', precip: '75%' },
  { day: 'Fri', icon: 'thunderstorm', high: '19°', low: '13°', condition: 'Thunderstorms', precip: '90%' },
  { day: 'Sat', icon: 'cloud', high: '21°', low: '15°', condition: 'Overcast', precip: '30%' },
  { day: 'Sun', icon: 'wb_sunny', high: '26°', low: '16°', condition: 'Clearing Up', precip: '10%' },
  { day: 'Mon', icon: 'wb_sunny', high: '29°', low: '18°', condition: 'Sunny', precip: '3%' },
];

const insights = [
  { icon: 'cyclone', iconBg: 'bg-error/10', iconColor: 'text-error', title: 'Storm System Detected', titleColor: 'text-error', description: 'A frontal system is approaching from the west. Expected to bring 15-25mm rainfall between Thursday and Friday.' },
  { icon: 'thermostat', iconBg: 'bg-tertiary/10', iconColor: 'text-tertiary', title: 'Temperature Drop Ahead', titleColor: 'text-tertiary', description: 'Significant cooling trend beginning Wednesday. Lows may drop to 13°C by Friday morning.' },
];

export default function Forecast() {
  return (
    <>
      <TopBar title="Forecast" subtitle="7-Day Atmospheric Outlook" />
      <div className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-8 max-w-[1440px] mx-auto w-full space-y-[var(--spacing-card-gap)]">
        {/* Hero Forecast Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-card-gap)]">
          <div className="lg:col-span-8 glass-card rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <span className="text-label-caps text-primary">SAN FRANCISCO, CA</span>
                </div>
                <h2 className="text-[72px] font-bold text-on-surface tracking-tighter leading-none">28°C</h2>
                <p className="text-body-lg text-on-surface-variant mt-2">Mostly Sunny</p>
                <div className="flex gap-6 mt-6 text-label-caps text-on-surface-variant">
                  <span>Feels Like: 30°C</span>
                  <span>UV Index: 8</span>
                  <span>Dew Point: 16°C</span>
                </div>
              </div>
              <span className="material-symbols-outlined text-[96px] text-tertiary-container" style={{ fontVariationSettings: "'FILL' 1" }}>wb_sunny</span>
            </div>
          </div>

          <div className="lg:col-span-4 glass-card rounded-3xl p-8">
            <h4 className="text-h3-card-title text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              Local AI Insights
            </h4>
            <div className="space-y-6">
              {insights.map((ins) => <InsightCard key={ins.title} {...ins} />)}
            </div>
          </div>
        </div>

        {/* Hourly Progression */}
        <div className="glass-card rounded-3xl p-8">
          <h4 className="text-h3-card-title text-on-surface mb-6">Hourly Progression</h4>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {hourly.map((h) => <HourCard key={h.time} {...h} />)}
          </div>
        </div>

        {/* 7-Day Grid */}
        <div className="glass-card rounded-3xl p-8">
          <h4 className="text-h3-card-title text-on-surface mb-6">Extended 7-Day Forecast</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {dailyForecast.map((d) => (
              <div key={d.day} className="bg-surface-container-low rounded-2xl p-4 text-center border border-white/50 hover:-translate-y-1 transition-transform">
                <p className="text-label-caps text-on-surface-variant mb-3">{d.day}</p>
                <span className="material-symbols-outlined text-3xl text-primary mb-3" style={{ fontVariationSettings: "'FILL' 1" }}>{d.icon}</span>
                <div className="flex justify-center gap-3 text-sm mb-1">
                  <span className="font-bold text-on-surface">{d.high}</span>
                  <span className="text-on-surface-variant">{d.low}</span>
                </div>
                <p className="text-[10px] text-on-surface-variant">{d.condition}</p>
                <p className="text-[10px] text-primary mt-1">{d.precip} rain</p>
              </div>
            ))}
          </div>
        </div>

        {/* Precipitation Radar */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <div className="p-8 pb-4">
            <h4 className="text-h3-card-title text-on-surface">Precipitation Radar</h4>
            <p className="text-body-main text-on-surface-variant/60">Real-time satellite radar overlay</p>
          </div>
          <div className="h-64 bg-surface-container-low relative">
            <img className="w-full h-full object-cover opacity-70" alt="Radar map" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAboWsxqKNgCjj0CkG2SPLULu9Ntl-vDNoCHUjfV81CdyMLDw7tDy8WqfafOBUkSJEsRu9B8ieZldPF9SLwJ5UzPKNEPuNyiSFTvU0DGbbFYxZD9z1dTxroE11DtyPNtgCk96kZX1XmFOEOyFxEdJtddQkpCR9DRymMws0kYbYQwY0RxXO9Y7Q-_iOU8VpqJvH6wwQP_c5TuBjqQc37ugKWNwH9RMv-xIRhUZsEzb1r8MnU_HQtG3GsYaE8k9OmaYNx3O3kuoYYdQje" />
            <div className="absolute bottom-4 left-4 glass-card px-4 py-2 rounded-xl flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-label-caps text-on-surface">LIVE RADAR</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
