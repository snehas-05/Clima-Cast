import TopBar from '../components/layout/TopBar';
import MetricCard from '../components/cards/MetricCard';
import HourCard from '../components/cards/HourCard';
import InsightCard from '../components/cards/InsightCard';
import ForecastRow from '../components/cards/ForecastRow';
import ChartContainer from '../components/charts/ChartContainer';

const metrics = [
  { icon: 'device_thermostat', label: 'TEMPERATURE', value: '22°C', trend: '+1.2°', trendDirection: 'up' },
  { icon: 'water_drop', label: 'HUMIDITY', value: '65%', trend: '-3%', trendDirection: 'down', iconBg: 'bg-secondary/10', iconColor: 'text-secondary' },
  { icon: 'air', label: 'WIND SPEED', value: '14 km/h', trend: 'Stable' },
  { icon: 'visibility', label: 'VISIBILITY', value: '12 km', trend: 'Clear', iconBg: 'bg-tertiary/10', iconColor: 'text-tertiary' },
];

const hours = [
  { time: '2 PM', icon: 'wb_sunny', temperature: '22°', isActive: true },
  { time: '3 PM', icon: 'wb_sunny', temperature: '23°' },
  { time: '4 PM', icon: 'partly_cloudy_day', temperature: '21°' },
  { time: '5 PM', icon: 'cloud', temperature: '19°' },
  { time: '6 PM', icon: 'rainy', temperature: '17°' },
  { time: '7 PM', icon: 'rainy', temperature: '16°' },
  { time: '8 PM', icon: 'cloud', temperature: '15°' },
];

const insights = [
  { icon: 'psychology', iconBg: 'bg-primary/10', title: 'Storm Approaching', description: 'AI predicts moderate rainfall starting 4 PM. 78% confidence.' },
  { icon: 'eco', iconBg: 'bg-tertiary/10', iconColor: 'text-tertiary', titleColor: 'text-tertiary', title: 'UV Index High', description: 'Peak UV expected between 11 AM – 2 PM. SPF 30+ recommended.' },
];

const forecast = [
  { day: 'Mon', icon: 'wb_sunny', high: '24°', low: '16°', barWidth: '85%' },
  { day: 'Tue', icon: 'partly_cloudy_day', high: '22°', low: '15°', barWidth: '75%' },
  { day: 'Wed', icon: 'rainy', high: '18°', low: '12°', barWidth: '55%' },
  { day: 'Thu', icon: 'thunderstorm', high: '16°', low: '11°', barWidth: '45%' },
  { day: 'Fri', icon: 'cloud', high: '19°', low: '13°', barWidth: '60%' },
  { day: 'Sat', icon: 'wb_sunny', high: '23°', low: '15°', barWidth: '80%' },
  { day: 'Sun', icon: 'wb_sunny', high: '25°', low: '17°', barWidth: '90%' },
];

const precipData = [
  { height: 30 }, { height: 45 }, { height: 60 }, { height: 85 },
  { height: 70 }, { height: 50 }, { height: 35 }, { height: 20 },
  { height: 40 }, { height: 55 }, { height: 25 }, { height: 15 },
];
const precipLabels = ['12', '2', '4', '6', '8', '10', '12', '2', '4', '6', '8', '10'];

export default function Dashboard() {
  return (
    <>
      <TopBar title="Dashboard" subtitle="Real-Time Overview" />
      <div className="flex-1 px-6 lg:px-[var(--spacing-container-padding)] py-8 max-w-[1440px] mx-auto w-full space-y-[var(--spacing-card-gap)]">
        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--spacing-card-gap)]">
          {metrics.map((m) => <MetricCard key={m.label} {...m} />)}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--spacing-card-gap)]">
          {/* Main Weather Card */}
          <div className="lg:col-span-8 glass-card rounded-3xl p-8 flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
              <div>
                <p className="text-label-caps text-on-surface-variant mb-1">CURRENT CONDITIONS</p>
                <h3 className="text-h1-hero text-on-surface leading-none">22°C</h3>
                <p className="text-body-lg text-on-surface-variant mt-2">Partly Cloudy • San Francisco, CA</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="material-symbols-outlined text-6xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>partly_cloudy_day</span>
                <span className="text-label-caps text-primary">AI CONFIDENCE: 94%</span>
              </div>
            </div>
            {/* Hourly Timeline */}
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {hours.map((h) => <HourCard key={h.time} {...h} />)}
            </div>
          </div>

          {/* AI Quick Insights */}
          <div className="lg:col-span-4 glass-card rounded-3xl p-8 flex flex-col">
            <h4 className="text-h3-card-title text-on-surface mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              AI Quick Insights
            </h4>
            <div className="space-y-6 flex-1">
              {insights.map((ins) => <InsightCard key={ins.title} {...ins} />)}
            </div>
          </div>

          {/* Precipitation Chart */}
          <div className="lg:col-span-6">
            <ChartContainer title="Precipitation Probability" subtitle="Next 24 hours">
              <div className="h-48 flex items-end justify-between gap-1.5">
                {precipData.map((d, i) => (
                  <div key={i} className="flex-1 bg-primary/15 rounded-t-lg hover:bg-primary/30 transition-colors" style={{ height: `${d.height}%` }} />
                ))}
              </div>
              <div className="flex justify-between mt-3 text-label-caps text-on-surface-variant text-[10px]">
                {precipLabels.map((l, i) => <span key={i}>{l}</span>)}
              </div>
            </ChartContainer>
          </div>

          {/* 7-Day Forecast */}
          <div className="lg:col-span-6 glass-card rounded-3xl p-8">
            <h4 className="text-h3-card-title text-on-surface mb-6">7-Day Forecast</h4>
            <div className="space-y-1">
              {forecast.map((f) => <ForecastRow key={f.day} {...f} />)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
