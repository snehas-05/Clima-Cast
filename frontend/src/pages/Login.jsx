import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import FormField from '../components/ui/FormField';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    
    try {
      const res = await login({ email, password });
      if (res.success) {
        navigate('/dashboard');
      } else {
        setError(res.message || 'Login failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-[480px] glass-panel rounded-xl shadow-[0_40px_60px_-15px_rgba(15,23,42,0.08)] p-10 flex flex-col gap-8">
      <div className="text-center">
        <h1 className="text-h2-dashboard text-primary mb-2">Welcome Back</h1>
        <p className="text-body-main text-on-surface-variant">Access your intelligence dashboard</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {['Google', 'Apple'].map((p) => (
          <button key={p} type="button" className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg border border-outline-variant/30 bg-white/40 hover:bg-white/60 transition-all">
            <span className="material-symbols-outlined text-[20px]">{p === 'Google' ? 'g_translate' : 'phone_iphone'}</span>
            <span className="text-label-caps text-on-surface">{p}</span>
          </button>
        ))}
      </div>

      <div className="relative flex items-center">
        <div className="flex-grow border-t border-outline-variant/30" />
        <span className="flex-shrink mx-4 text-label-caps text-on-surface-variant/60">OR CONTINUE WITH EMAIL</span>
        <div className="flex-grow border-t border-outline-variant/30" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && <div className="text-red-500 text-sm font-medium bg-red-100 p-3 rounded">{error}</div>}
        <FormField label="EMAIL ADDRESS" icon="mail" type="email" placeholder="name@example.com" id="login-email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <FormField label="PASSWORD" icon="lock" type="password" placeholder="••••••••" id="login-password" value={password} onChange={(e) => setPassword(e.target.value)} required rightElement={<Link to="#" className="text-label-caps text-primary hover:underline">FORGOT?</Link>} />

        <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-gradient-to-r from-[#7dd3fc] to-[#22d3ee] text-[#22005d] font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 inner-glow disabled:opacity-70 disabled:cursor-not-allowed">
          {isSubmitting ? 'Signing In...' : <>Sign In <span className="material-symbols-outlined">arrow_forward</span></>}
        </button>
      </form>

      <p className="text-center text-body-main text-on-surface-variant">
        Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Create account</Link>
      </p>
    </div>
  );
}
