import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import FeatureItem from '../components/cards/FeatureItem';

const heroWidgets = [
  { icon: 'cloud_queue', value: '24°C', label: 'CURRENT CONDITIONS', iconColor: 'text-primary' },
  { icon: null, value: '92%', label: 'MODEL ACCURACY', isCenter: true },
  { icon: 'air', value: '12 km/h', label: 'WIND VELOCITY', iconColor: 'text-secondary' },
];

const features = [
  { icon: 'satellite_alt', iconBg: 'bg-primary-container/20', title: 'Satellite Fusion', description: 'Synthesizing data from over 40 global satellite constellations for real-time terrain mapping.' },
  { icon: 'psychology', iconBg: 'bg-secondary-container/20', iconColor: 'text-secondary', title: 'Neural Forecasting', description: 'Deep learning architectures that predict micro-climate shifts before they occur.' },
];

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const barHeights = ['50%', '75%', '66%', '100%', '80%', '60%', '50%'];

export default function Home() {
  return (
    <div className="mesh-gradient">
      <main className="max-w-[1440px] mx-auto px-6 lg:px-[var(--spacing-container-padding)]">
        {/* Hero Section */}
        <section className="relative py-24 flex flex-col items-center text-center overflow-hidden">
          <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-40">
            <div className="w-[800px] h-[800px] rounded-full blur-[100px] bg-gradient-to-br from-primary-fixed-dim via-secondary-container to-surface-bright" />
          </div>

          <div className="space-y-6 max-w-4xl">
            <span className="text-label-caps text-primary tracking-[0.2em]">
              Atmospheric Intelligence Engine
            </span>
            <h1 className="text-h1-hero text-on-surface leading-tight">
              The Future of <span className="text-primary italic">Weather Intelligence.</span>
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Hyper-accurate predictive modeling for high-stakes environmental decision-making. Experience clarity amidst complexity with 99.8% AI confidence.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center pt-8">
              <Link to="/forecast">
                <Button variant="primary" size="lg">Explore Forecasts</Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="glass" size="lg">Open Dashboard</Button>
              </Link>
            </div>
          </div>

          {/* Floating Widgets */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-card-gap)] w-full">
            {heroWidgets.map((widget, i) => (
              <div
                key={i}
                className={`glass-card p-8 rounded-xl flex flex-col items-center space-y-4
                  ${widget.isCenter ? 'shadow-xl border-primary/20 md:scale-110 z-10' : ''}`}
              >
                {widget.isCenter ? (
                  <div className="relative w-24 h-24 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle className="text-surface-container-highest" cx="48" cy="48" fill="transparent" r="44" stroke="currentColor" strokeWidth="8" />
                      <circle className="text-primary" cx="48" cy="48" fill="transparent" r="44" stroke="currentColor" strokeDasharray="276" strokeDashoffset="27" strokeWidth="8" />
                    </svg>
                    <span className="text-h3-card-title text-primary">{widget.value}</span>
                  </div>
                ) : (
                  <span className={`material-symbols-outlined ${widget.iconColor} text-5xl`}>
                    {widget.icon}
                  </span>
                )}
                <div>
                  {!widget.isCenter && (
                    <div className="text-h2-dashboard text-on-surface">{widget.value}</div>
                  )}
                  {widget.isCenter && (
                    <div className="text-h3-card-title text-on-surface">AI Confidence</div>
                  )}
                  <div className="text-label-caps text-on-surface-variant">{widget.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Weather Intelligence Preview */}
        <section className="py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-h2-dashboard text-on-surface">
              Unparalleled Precision in Environmental Data.
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

        {/* Predictive Insights Hub */}
        <section className="py-24">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-h2-dashboard text-on-surface">Predictive Insights Hub</h2>
            <p className="text-body-main text-on-surface-variant">Advanced analytics for climate-resilient operations.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--spacing-card-gap)]">
            <div className="md:col-span-2 glass-card p-8 rounded-2xl space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-h3-card-title text-on-surface">7-Day Probabilistic Trend</h3>
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary" />
                  <span className="w-3 h-3 rounded-full bg-secondary" />
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-4">
                {barHeights.map((h, i) => (
                  <div key={i} className="flex-1 bg-primary/10 rounded-t-lg relative group" style={{ height: h }}>
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg" />
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-label-caps text-on-surface-variant">
                {days.map((d) => <span key={d}>{d}</span>)}
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl flex flex-col space-y-6">
              <h3 className="text-h3-card-title text-on-surface">Global Heat Distribution</h3>
              <div className="flex-grow rounded-xl overflow-hidden relative border border-outline-variant/20">
                <img
                  className="w-full h-full object-cover"
                  alt="Global heat map"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7om3JI9Nb6OWWkb34mQbKIQ5qj5YiartZZiMDIXw8A13xxk7yLwBVayMQRxh20vLri0c3BkOHTwPXXL88sjbphg_PbrTaSPA5pMsRsJxTLVwBffTlh5hqbgf3oDtVS0TV03ov8oyWJxnavXV0FvNGsPM_9ODXg_CxD-rekdnrjQ1JWMYSwkVpRXjnjVEdy7a0nAzmY0D7Ibh4GydHe6ikzIVfz3V3sEl7P1JPO5UHk4yMhrSc32ie_mVAU9ceDpPkzeNb2h3SII9-"
                />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
              </div>
              <Link to="/map" className="text-primary text-label-caps flex items-center justify-center gap-2 hover:underline">
                EXPLORE MAP <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24">
          <div className="glass-card p-8 md:p-16 rounded-3xl text-center space-y-8 border-primary/20 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl" />
            <h2 className="text-h1-hero text-on-surface">Ready to secure your operations?</h2>
            <p className="text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Join the world's leading logistics, agriculture, and urban planning firms utilizing Clima-Cast intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button variant="solid" size="lg">Get Started Now</Button>
              </Link>
              <Button variant="ghost" size="lg">Contact Sales</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
