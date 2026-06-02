import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields'); return; }
    setLoading(true); setError('');
    try {
      const role = await login(form.email, form.password);
      toast(`Welcome back!`, 'success');
      navigate(role === 'admin' ? '/admin/dashboard' : '/my-tickets', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (email, password) => setForm({ email, password });

  return (
    <div className="auth-shell">
      <div className="auth-card">

        {/* Brand */}
        <div className="auth-logo">
          <div className="auth-logo-icon">🎧</div>
          <div>
            <h1>Support<em>CRM</em></h1>
            <span>Datastraw <strong>Technologies</strong></span>
          </div>
        </div>

        {/* Heading */}
        <h2 className="auth-title">
          Welcome <em>back</em>
        </h2>
        <p className="auth-subtitle">
          Sign in to your <strong>account</strong> to continue
        </p>

        {/* Demo accounts */}
        <div className="demo-box">
          <div className="demo-box-title">🔑 Demo Accounts — <em>click to fill</em></div>
          <div
            className="demo-item"
            style={{ cursor: 'pointer' }}
            onClick={() => fillDemo('admin@datastraw.in', 'Admin@123')}
          >
            <span className="label"><strong>admin@datastraw.in</strong></span>
            <span className="role-badge role-admin">Admin</span>
          </div>
          <div
            className="demo-item"
            style={{ cursor: 'pointer', marginTop: 6 }}
            onClick={() => fillDemo('demo@customer.com', 'Demo@123')}
          >
            <span className="label"><strong>demo@customer.com</strong></span>
            <span className="role-badge role-customer">Customer</span>
          </div>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => set('password', e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading
              ? <><div className="spinner" style={{ width: 14, height: 14 }} /> Signing in…</>
              : <><strong>Sign In</strong> →</>
            }
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <Link to="/register"><strong>Create one</strong></Link>
        </div>
      </div>
    </div>
  );
}
