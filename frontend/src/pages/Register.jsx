import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    business_name: '',
    full_name: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.business_name.trim()) return setError('Business name is required');
    if (!form.full_name.trim()) return setError('Full name is required');
    if (!form.username.trim()) return setError('Username is required');
    if (!form.email.trim()) return setError('Email is required');
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    if (form.password !== form.confirm_password) return setError('Passwords do not match');

    setLoading(true);
    try {
      const res = await authAPI.register({
        business_name: form.business_name,
        full_name: form.full_name,
        username: form.username,
        email: form.email,
        password: form.password,
        role: 'admin',
      });
      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card glass-panel">
        <div className="login-header">
          <div className="login-logo">⚡</div>
          <h1>Create Account</h1>
          <p>Register your business to get started</p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="input-group">
            <label>Business Name</label>
            <input name="business_name" placeholder="Your business name" value={form.business_name} onChange={handleChange} required autoFocus />
          </div>
          <div className="input-group">
            <label>Full Name</label>
            <input name="full_name" placeholder="John Doe" value={form.full_name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Username</label>
            <input name="username" placeholder="Choose a username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Confirm Password</label>
            <input type="password" name="confirm_password" placeholder="Repeat password" value={form.confirm_password} onChange={handleChange} required />
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
