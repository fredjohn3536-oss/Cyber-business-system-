import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    business_name: '', full_name: '', username: '', email: '',
    password: '', confirm_password: '',
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
        business_name: form.business_name, full_name: form.full_name,
        username: form.username, email: form.email, password: form.password, role: 'admin',
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
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'background.default', p: 2.5 }}>
      <Card sx={{ maxWidth: 480, width: '100%', p: 4 }}>
        <Stack sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>Create Account</Typography>
          <Typography variant="body2" color="text.secondary">Register your business to get started</Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

          <TextField fullWidth size="small" label="Business Name" name="business_name"
            value={form.business_name} onChange={handleChange} required autoFocus sx={{ mb: 2 }} />
          <TextField fullWidth size="small" label="Full Name" name="full_name"
            value={form.full_name} onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField fullWidth size="small" label="Username" name="username"
            value={form.username} onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField fullWidth size="small" type="email" label="Email" name="email"
            value={form.email} onChange={handleChange} required sx={{ mb: 2 }} />
          <TextField fullWidth size="small" type="password" label="Password" name="password"
            value={form.password} onChange={handleChange} required
            helperText="Min 6 characters" sx={{ mb: 2 }} />
          <TextField fullWidth size="small" type="password" label="Confirm Password" name="confirm_password"
            value={form.confirm_password} onChange={handleChange} required sx={{ mb: 3 }} />

          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>Sign in</Link>
        </Typography>
      </Card>
    </Box>
  );
}
