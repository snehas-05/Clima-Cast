import { useState } from 'react';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import { usePreferences } from '../context/PreferencesContext';
import Button from '../components/ui/Button';

export default function Settings() {
  const { 
    theme, 
    unit, 
    showConfidence, 
    updateTheme, 
    updateUnit, 
    updateConfidence,
    loading 
  } = usePreferences();

  // Local UI states for sections not yet fully synced with backend
  const [hyperLocal, setHyperLocal] = useState(true);
  const [anomaly, setAnomaly] = useState(true);
  const [emailDigest, setEmailDigest] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  return (
    <>
      <header className="sticky top-0 right-0 h-24 px-6 lg:px-[var(--spacing-container-padding)] z-40 glass-topbar flex justify-between items-center border-b border-white/5">
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
            <section className="glass-card p-10 rounded-[2rem] border border-white/10 shadow-2xl">
              <div className="flex items-center gap-5 mb-10">
                <div className="p-4 bg-primary/20 rounded-2xl">
                  <span className="material-symbols-outlined text-primary text-2xl">palette</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-on-surface tracking-tight">Appearance</h3>
                  <p className="text-on-surface-variant/60 text-sm font-medium">Customize the interface visual properties.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div 
                  onClick={() => updateTheme('light')}
                  className={`border-2 p-5 rounded-[1.5rem] bg-white flex flex-col gap-5 cursor-pointer transition-all duration-500 hover:scale-[1.02] ${theme === 'light' ? 'border-primary shadow-[0_0_30px_rgba(192,132,252,0.2)]' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                >
                  <div className="w-full h-32 bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden border border-slate-100">
                    <div className="w-3/4 h-2/3 bg-white shadow-xl rounded-lg p-3 flex flex-col gap-2">
                      <div className="w-1/2 h-2.5 bg-primary/20 rounded-full" />
                      <div className="w-full h-2.5 bg-slate-100 rounded-full" />
                      <div className="w-2/3 h-2.5 bg-slate-100 rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-900">Light Reflection</span>
                    {theme === 'light' && <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                  </div>
                </div>
                <div 
                  onClick={() => updateTheme('dark')}
                  className={`border-2 p-5 rounded-[1.5rem] bg-[#030712] flex flex-col gap-5 cursor-pointer transition-all duration-500 hover:scale-[1.02] ${theme === 'dark' ? 'border-primary shadow-[0_0_30px_rgba(192,132,252,0.3)]' : 'border-white/10 opacity-40 hover:opacity-100'}`}
                >
                  <div className="w-full h-32 bg-[#0a0a14] rounded-xl flex items-center justify-center overflow-hidden border border-white/5">
                    <div className="w-3/4 h-2/3 bg-[#111322] shadow-2xl rounded-lg p-3 flex flex-col gap-2 border border-white/5">
                      <div className="w-1/2 h-2.5 bg-primary/40 rounded-full" />
                      <div className="w-full h-2.5 bg-white/5 rounded-full" />
                      <div className="w-2/3 h-2.5 bg-white/5 rounded-full" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white tracking-tight">Midnight Premium</span>
                    {theme === 'dark' && <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>}
                  </div>
                </div>
              </div>
            </section>

            {/* Unit Preferences */}
            <section className="glass-card p-10 rounded-[2rem] border border-white/10">
              <div className="flex items-center gap-5 mb-10">
                <div className="p-4 bg-primary/20 rounded-2xl">
                  <span className="material-symbols-outlined text-primary text-2xl">thermostat</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-on-surface tracking-tight">Unit Preferences</h3>
                  <p className="text-on-surface-variant/60 text-sm font-medium">Global measurement standards.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-outline-variant/10">
                  <div>
                    <p className="text-body-main font-medium text-on-surface">Temperature Scale</p>
                    <p className="text-sm text-on-surface-variant">Default measurement for all forecast views.</p>
                  </div>
                  <div className="flex bg-surface-container p-1 rounded-xl">
                    {[
                      { label: 'Celsius (°C)', value: 'celsius' },
                      { label: 'Fahrenheit (°F)', value: 'fahrenheit' }
                    ].map(u => (
                      <button 
                        key={u.value} 
                        onClick={() => updateUnit(u.value)} 
                        className={`px-6 py-2 rounded-lg transition-all ${unit === u.value ? 'bg-surface shadow-sm text-primary font-bold' : 'text-on-surface-variant hover:text-primary'}`}
                      >
                        {u.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* AI Engine Controls */}
            <section className="glass-card p-10 rounded-[2rem] border border-white/10">
              <div className="flex items-center gap-5 mb-10">
                <div className="p-4 bg-primary/20 rounded-2xl">
                  <span className="material-symbols-outlined text-primary text-2xl">auto_awesome</span>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-on-surface tracking-tight">AI Engine Controls</h3>
                  <p className="text-on-surface-variant/60 text-sm font-medium">Manage Clima-Cast's intelligence models.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-7 bg-white/5 rounded-[1.5rem] border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors group">
                  <div className="flex items-start gap-5">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-primary">psychology</span>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-on-surface">Confidence Visualization</p>
                      <p className="text-sm text-on-surface-variant/60 max-w-md font-medium">Display probability percentages and model confidence levels.</p>
                    </div>
                  </div>
                  <ToggleSwitch id="show-confidence" checked={showConfidence} onChange={(e) => updateConfidence(e.target.checked)} />
                </div>
                <div className="p-7 bg-white/5 rounded-[1.5rem] border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors group">
                  <div className="flex items-start gap-5">
                    <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                      <span className="material-symbols-outlined text-primary">model_training</span>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-on-surface">Hyper-Local Refinement</p>
                      <p className="text-sm text-on-surface-variant/60 max-w-md font-medium">Enable real-time data ingestion from local IoT stations.</p>
                    </div>
                  </div>
                  <ToggleSwitch id="hyper-local" checked={hyperLocal} onChange={(e) => setHyperLocal(e.target.checked)} />
                </div>
              </div>
            </section>

          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-[var(--spacing-card-gap)]">
            
            {/* Alert Channels */}
            <section className="glass-panel p-6 rounded-3xl">
              <h3 className="text-h3-card-title mb-6 text-on-surface">Alert Channels</h3>
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant">mail</span>
                    <span className="text-body-main text-on-surface">Email Digests</span>
                  </div>
                  <input type="checkbox" checked={emailDigest} onChange={e => setEmailDigest(e.target.checked)} className="rounded text-primary focus:ring-primary h-5 w-5 border-outline-variant" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-on-surface-variant">notifications_active</span>
                    <span className="text-body-main text-on-surface">Push Alerts</span>
                  </div>
                  <input type="checkbox" checked={pushAlerts} onChange={e => setPushAlerts(e.target.checked)} className="rounded text-primary focus:ring-primary h-5 w-5 border-outline-variant" />
                </div>
              </div>
              <Button 
                variant="solid" 
                className="w-full mt-8" 
                loading={loading}
                onClick={() => alert('Preferences Saved Globally')}
              >
                Sync with Cloud
              </Button>
            </section>

            {/* Security */}
            <section className="glass-panel p-6 rounded-3xl">
              <h3 className="text-h3-card-title mb-6 text-on-surface">Security & Privacy</h3>
              <div className="space-y-3">
                {[
                  { icon: 'lock', label: 'Change Password' },
                  { icon: 'shield', label: 'Privacy Policy' }
                ].map(s => (
                  <button key={s.label} className="w-full flex items-center justify-between p-4 hover:bg-surface-container rounded-2xl transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-on-surface-variant">{s.icon}</span>
                      <span className="text-body-main text-on-surface">{s.label}</span>
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
                <p className="text-sm opacity-90 mb-4">You have full access to high-fidelity global satellite data and AI predictive analytics.</p>
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
