import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import FormField from '../components/ui/FormField';
import authService from '../services/auth.service';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState({ loading: false, message: '', type: '' });

  useEffect(() => {
    if (!token) {
      setStatus({ loading: false, message: 'Invalid or missing reset token.', type: 'error' });
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      return setStatus({ loading: false, message: 'Passwords do not match.', type: 'error' });
    }
    if (password.length < 8) {
      return setStatus({ loading: false, message: 'Password must be at least 8 characters.', type: 'error' });
    }

    setStatus({ loading: true, message: '', type: '' });
    try {
      const res = await authService.resetPassword(token, password);
      if (res.data.success) {
        setStatus({ loading: false, message: res.data.message, type: 'success' });
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setStatus({ loading: false, message: res.data.error || res.data.message, type: 'error' });
      }
    } catch (err) {
      setStatus({ loading: false, message: 'An error occurred. The link may have expired.', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen mesh-gradient flex items-center justify-center p-6">
      <div className="glass-panel w-full max-w-[480px] p-10 rounded-xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-h2-dashboard text-primary mb-2">Reset Password</h1>
          <p className="text-body-main text-on-surface">Secure your atmospheric intelligence access</p>
        </div>

        {status.message && (
          <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${
            status.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {status.message}
          </div>
        )}

        {!token || status.type === 'success' ? (
          <Link to="/login" className="w-full py-4 bg-primary text-white rounded-lg font-bold flex items-center justify-center gap-2">
            Back to Login
          </Link>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <FormField 
              label="NEW PASSWORD" 
              icon="lock" 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FormField 
              label="CONFIRM NEW PASSWORD" 
              icon="verified_user" 
              type="password" 
              placeholder="••••••••" 
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            
            <button 
              type="submit" 
              disabled={status.loading}
              className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-lg font-bold shadow-lg hover:opacity-90 transition-all disabled:opacity-50"
            >
              {status.loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
