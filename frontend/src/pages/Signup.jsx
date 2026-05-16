import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../components/ui/FormField';
import { useAuth } from '../hooks/useAuth';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', home_city: '' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  
  const validatePassword = (pass) => {
    if (pass.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(pass)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(pass)) return "Password must contain a lowercase letter";
    if (!/\d/.test(pass)) return "Password must contain a number";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (form.password !== form.confirm) {
      return setError('Passwords do not match');
    }
    
    const passError = validatePassword(form.password);
    if (passError) {
      return setError(passError);
    }
    
    setIsSubmitting(true);
    try {
      const res = await signup({
        name: form.name,
        email: form.email,
        password: form.password,
        home_city: form.home_city || null
      });
      
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.error || res.message || 'Signup failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || err.response?.data?.detail?.[0]?.msg || 'An error occurred during signup');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel max-w-[500px] w-full mx-auto p-10 rounded-xl shadow-[0_40px_60px_-15px_rgba(15,23,42,0.08)]">
      <div className="flex flex-col items-center mb-10">
        <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
          <span className="material-symbols-outlined text-white text-[32px]">cloud_sync</span>
        </div>
        <h1 className="text-h2-dashboard text-primary tracking-tight">Clima-Cast</h1>
        <p className="text-on-surface text-body-main mt-1">Join the Atmospheric Intelligence Hub</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="text-red-500 text-sm font-medium bg-red-100 p-3 rounded">{error}</div>}
        
        <FormField label="Full Name" icon="person" placeholder="Enter your full name" id="name" value={form.name} onChange={update('name')} required />
        <FormField label="Email Address" icon="mail" type="email" placeholder="name@company.com" id="email" value={form.email} onChange={update('email')} required />
        <FormField label="Home City (Optional)" icon="location_city" placeholder="e.g. San Francisco" id="home_city" value={form.home_city} onChange={update('home_city')} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Password" icon="lock" type="password" placeholder="••••••••" id="password" value={form.password} onChange={update('password')} required />
          <FormField label="Confirm Password" icon="verified_user" type="password" placeholder="••••••••" id="confirm" value={form.confirm} onChange={update('confirm')} required />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-label-caps text-on-surface">Password Strength</span>
            <span className="text-label-caps text-primary">Strong</span>
          </div>
          <div className="flex gap-1 h-1.5 w-full">
            <div className="w-1/3 bg-primary rounded-full" />
            <div className="w-1/3 bg-primary rounded-full" />
            <div className="w-1/3 bg-primary/30 rounded-full" />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className="w-full py-4 px-6 bg-gradient-to-r from-primary to-primary-container text-white text-h3-card-title rounded-lg shadow-lg shadow-primary/25 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed">
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div className="mt-8 pt-8 border-t border-outline-variant/30 text-center">
        <p className="text-on-surface">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline ml-1">Login</Link>
        </p>
      </div>
    </div>
  );
}
