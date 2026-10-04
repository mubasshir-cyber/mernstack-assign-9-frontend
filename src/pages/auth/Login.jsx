import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to click and auto fill demo credentials
  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="login-container">
      {/* Header */}
      <div className="login-header">
        <div className="login-icon-box">
          <Shield size={28} />
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
          Visitor Pass System
        </h2>
        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
          Sign in to manage visitors, passes, and check-ins
        </p>
      </div>

      {/* Main Login Card */}
      <div className="login-card">
        {error && (
          <div
            style={{
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem',
              borderRadius: '0.75rem',
              backgroundColor: '#fff1f2',
              color: '#be123c',
              fontSize: '0.8rem',
              fontWeight: 500,
              border: '1px solid #ffe4e6',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#334155',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.35rem',
              }}
            >
              Email Address
            </label>
            <div className="input-group">
              <Mail className="input-icon" size={16} />
              <input
                type="email"
                className="input-field"
                placeholder="admin@taskmaster.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#334155',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '0.35rem',
              }}
            >
              Password
            </label>
            <div className="input-group">
              <Lock className="input-icon" size={16} />
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '0.85rem',
              gap: '0.5rem',
              marginTop: '0.25rem',
            }}
          >
            <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* 1-Click Quick Demo Accounts */}
        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            <Sparkles size={13} color="#f59e0b" />
            <span>Quick Demo Accounts:</span>
          </div>

          <div className="quick-demo-box">
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@taskmaster.com', 'admin123')}
              className="demo-chip"
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>Admin</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>admin123</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('security@taskmaster.com', 'security123')}
              className="demo-chip"
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>Security</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>security123</div>
            </button>

            <button
              type="button"
              onClick={() => handleQuickLogin('john@taskmaster.com', 'employee123')}
              className="demo-chip"
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e293b' }}>Employee</div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>employee123</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
