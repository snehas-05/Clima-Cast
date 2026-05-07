import { useState } from 'react';
import { Link } from 'react-router-dom';
import FormField from '../components/ui/FormField';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); };

  return (
    <div className="glass-panel max-w-[500px] w-full p-10 rounded-xl shadow-[0_40px_60px_-15px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-white text-[32px]">cloud_sync</span>
        </div>
        <h1 className="text-h2-dashboard text-primary tracking-tight">Clima-Cast</h1>
        <p className="text-on-surface-variant text-body-main mt-1">Join the Atmospheric Intelligence Hub</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Full Name" icon="person" placeholder="Enter your full name" id="name" value={form.name} onChange={update('name')} />
        <FormField label="Email Address" icon="mail" type="email" placeholder="name@company.com" id="email" value={form.email} onChange={update('email')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Password" icon="lock" type="password" placeholder="••••••••" id="password" value={form.password} onChange={update('password')} />
          <FormField label="Confirm Password" icon="verified_user" type="password" placeholder="••••••••" id="confirm" value={form.confirm} onChange={update('confirm')} />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-label-caps text-on-surface-variant">Password Strength</span>
            <span className="text-label-caps text-primary">Strong</span>
          </div>
          <div className="flex gap-1 h-1.5 w-full">
            <div className="w-1/3 bg-primary rounded-full" />
            <div className="w-1/3 bg-primary rounded-full" />
            <div className="w-1/3 bg-primary/30 rounded-full" />
          </div>
        </div>

        <div className="flex items-start gap-3 py-2">
          <input type="checkbox" id="terms" className="w-5 h-5 text-primary border-outline-variant/50 rounded focus:ring-primary/20 bg-white/50 mt-0.5" />
          <label htmlFor="terms" className="text-body-main text-on-surface-variant text-sm">
            I accept the <Link to="#" className="text-primary font-semibold hover:underline">Terms of Service</Link> and <Link to="#" className="text-primary font-semibold hover:underline">Privacy Policy</Link>
          </label>
        </div>

        <button type="submit" className="w-full py-4 px-6 bg-gradient-to-r from-primary to-primary-container text-white text-h3-card-title rounded-lg shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all">
          Create Account
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-outline-variant/30 text-center">
        <p className="text-on-surface-variant mb-6">Or continue with</p>
        <div className="flex justify-center gap-4 mb-8">
          {['Google', 'Apple'].map((p) => (
            <button key={p} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/60 border border-outline-variant/30 rounded-lg hover:bg-white/80 transition-all">
              <span className="material-symbols-outlined text-[20px]">{p === 'Google' ? 'g_translate' : 'phone_iphone'}</span>
              <span className="text-label-caps">{p}</span>
            </button>
          ))}
        </div>
        <p className="text-on-surface-variant">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
}
