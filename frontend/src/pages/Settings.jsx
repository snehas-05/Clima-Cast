import { useState } from 'react';
import ToggleSwitch from '../components/ui/ToggleSwitch';

export default function Settings() {
  const [hyperLocal, setHyperLocal] = useState(true);
  const [anomaly, setAnomaly] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [tempUnit, setTempUnit] = useState('Celsius (°C)');
  const [windUnit, setWindUnit] = useState('m/s');

  return (
    <>
      {/* Specific header for Settings */}
      <header className="sticky top-0 right-0 h-20 px-6 lg:px-[var(--spacing-container-padding)] z-40 glass-topbar flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h2 className="text-h2-dashboard text-primary tracking-tight">Settings</h2>
          <div className="hidden md:flex gap-6">
            <span className="text-label-caps text-on-surface-variant hover:text-primary transition-colors cursor-pointer">General</span>
            <span className="text-label-caps text-primary border-b-2 border-primary pb-1 cursor-pointer">Preferences</span>
            <span className="text-label-caps text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Security</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center overflow-hidden">
            <span className="material-symbols-outlined text-white">person</span>
          </div>
        </div>
      </header>

      <div className="flex-1 py-12 px-6 lg:px-[var(--spacing-container-padding)] max-w-[1440px] mx-auto w-full">
        <div className="grid grid-cols-12 gap-[var(--spacing-card-gap)]">
          {/* Left Column */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-[var(--spacing-card-gap)]">
            
            {/* Appearance */}
            <section className="glass-panel p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-secondary-container/20 rounded-2xl">
                  <span className="material-symbols-outlined text-primary">palette</span>
                </div>
                <div>
                  <h3 className="text-h3-card-title text-on-surface">Appearance</h3>
                  <p className="text-on-surface-variant text-sm">Customize the interface visual properties.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-primary p-4 rounded-2xl bg-white/50 flex flex-col gap-4 cursor-default">
                  <div className="w-full h-24 bg-surface-container rounded-lg flex items-center justify-center overflow-hidden">
                    <div className="w-3/4 h-2/3 bg-white shadow-sm rounded-md p-2 flex flex-col gap-1">
                      <div className="w-1/2 h-2 bg-primary/20 rounded" />
                      <div className="w-full h-2 bg-outline-variant/30 rounded" />
                      <div className="w-3/4 h-2 bg-outline-variant/30 rounded" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-main font-semibold">Light Mode</span>
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  </div>
                </div>
                <div className="border border-outline-variant/30 p-4 rounded-2xl bg-surface-dim/20 opacity-60 flex flex-col gap-4 cursor-not-allowed grayscale">
                  <div className="w-full h-24 bg-inverse-surface rounded-lg flex items-center justify-center overflow-hidden">
                    <div className="w-3/4 h-2/3 bg-slate-800 shadow-sm rounded-md p-2 flex flex-col gap-1">
                      <div className="w-1/2 h-2 bg-primary-fixed-dim/20 rounded" />
                      <div className="w-full h-2 bg-white/10 rounded" />
                      <div className="w-3/4 h-2 bg-white/10 rounded" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-body-main">Atmospheric Dark</span>
                    <span className="text-[10px] text-label-caps bg-outline-variant/20 px-2 py-1 rounded">Coming Soon</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Unit Preferences */}
            <section className="glass-panel p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-secondary-container/20 rounded-2xl">
                  <span className="material-symbols-outlined text-primary">thermostat</span>
                </div>
                <div>
                  <h3 className="text-h3-card-title text-on-surface">Unit Preferences</h3>
                  <p className="text-on-surface-variant text-sm">Select global measurement standards for climate data.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-outline-variant/10">
                  <div>
                    <p className="text-body-main font-medium">Temperature Scale</p>
                    <p className="text-sm text-on-surface-variant">Default measurement for all forecast views.</p>
                  </div>
                  <div className="flex bg-surface-container p-1 rounded-xl">
                    {['Celsius (°C)', 'Fahrenheit (°F)'].map(u => (
                      <button key={u} onClick={() => setTempUnit(u)} className={`px-6 py-2 rounded-lg transition-all ${tempUnit === u ? 'bg-white shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between py-4 border-b border-outline-variant/10">
                  <div>
                    <p className="text-body-main font-medium">Wind Speed</p>
                    <p className="text-sm text-on-surface-variant">Used in predictive analysis and wind maps.</p>
                  </div>
                  <div className="flex bg-surface-container p-1 rounded-xl">
                    {['km/h', 'm/s', 'mph'].map(u => (
                      <button key={u} onClick={() => setWindUnit(u)} className={`px-6 py-2 rounded-lg transition-all ${windUnit === u ? 'bg-white shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}>
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* AI Engine Controls */}
            <section className="glass-panel p-8 rounded-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-secondary-container/20 rounded-2xl">
                  <span className="material-symbols-outlined text-primary">auto_awesome</span>
                </div>
                <div>
                  <h3 className="text-h3-card-title text-on-surface">AI Engine Controls</h3>
                  <p className="text-on-surface-variant text-sm">Manage Clima-Cast's intelligence models.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="p-6 bg-surface-container/30 rounded-2xl flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary mt-1">model_training</span>
                    <div>
                      <p className="text-body-main font-semibold">Hyper-Local Refinement</p>
                      <p className="text-sm text-on-surface-variant max-w-md">Enable real-time data ingestion from local IoT stations for ultra-precise precipitation forecasts within 2km.</p>
                    </div>
                  </div>
                  <ToggleSwitch id="hyper-local" checked={hyperLocal} onChange={(e) => setHyperLocal(e.target.checked)} />
                </div>
                <div className="p-6 bg-surface-container/30 rounded-2xl flex items-center justify-between">
                  <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-primary mt-1">hub</span>
                    <div>
                      <p className="text-body-main font-semibold">Anomaly Detection</p>
                      <p className="text-sm text-on-surface-variant max-w-md">Use neural networks to identify rare atmospheric patterns that standard models might miss.</p>
                    </div>
                  </div>
                  <ToggleSwitch id="anomaly" checked={anomaly} onChange={(e) => setAnomaly(e.target.checked)} />
                </div>
              </div>
            </section>

          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-[var(--spacing-card-gap)]">
            
            {/* Alert Channels */}
            <section className="glass-panel p-6 rounded-3xl">
              <h3 className="text-h3-card-title mb-6">Alert Channels</h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant">mail</span>
                    <span className="text-body-main">Email Digests</span>
                  </div>
                  <input type="checkbox" checked={emailDigest} onChange={e => setEmailDigest(e.target.checked)} className="rounded text-primary focus:ring-primary h-5 w-5 border-outline-variant" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant">notifications_active</span>
                    <span className="text-body-main">Push Alerts</span>
                  </div>
                  <input type="checkbox" checked={pushAlerts} onChange={e => setPushAlerts(e.target.checked)} className="rounded text-primary focus:ring-primary h-5 w-5 border-outline-variant" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant">sms</span>
                    <span className="text-body-main">Critical SMS</span>
                  </div>
                  <input type="checkbox" checked={smsAlerts} onChange={e => setSmsAlerts(e.target.checked)} className="rounded text-primary focus:ring-primary h-5 w-5 border-outline-variant" />
                </div>
              </div>
              <button className="w-full mt-8 py-3 px-4 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Update Preferences
              </button>
            </section>

            {/* Security */}
            <section className="glass-panel p-6 rounded-3xl">
              <h3 className="text-h3-card-title mb-6">Security & Privacy</h3>
              <div className="space-y-3">
                {[
                  { icon: 'lock', label: 'Change Password' },
                  { icon: 'shield', label: 'Privacy Policy' },
                  { icon: 'history', label: 'Data Export' }
                ].map(s => (
                  <button key={s.label} className="w-full flex items-center justify-between p-4 hover:bg-surface-container rounded-2xl transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant">{s.icon}</span>
                      <span className="text-body-main">{s.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-outline">chevron_right</span>
                  </button>
                ))}
              </div>
            </section>

            {/* Enterprise Plan */}
            <div className="p-6 bg-gradient-to-br from-primary to-primary-container rounded-3xl text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="text-h3-card-title mb-2">Enterprise Plan</h4>
                <p className="text-sm text-primary-fixed opacity-90 mb-4">You have full access to high-fidelity global satellite data and AI predictive analytics.</p>
                <button className="text-sm text-label-caps border-b border-white">Manage Subscription</button>
              </div>
              <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
