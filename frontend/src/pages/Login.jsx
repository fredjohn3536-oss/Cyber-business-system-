import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userData = await login(form.username, form.password);
      const role = userData?.role || 'seller';
      navigate(role === 'seller' || role === 'manager' ? '/seller-dashboard' : '/admin');
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', bgcolor: 'background.default', p: 2.5 }}>
      <Card sx={{ maxWidth: 420, width: '100%', p: 4 }}>
        <Stack sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" sx={{ mb: 0.5 }}>Cyber Business System</Typography>
          <Typography variant="body2" color="text.secondary">Sign in to your account</Typography>
        </Stack>

        <Box component="form" onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2.5 }}>{error}</Alert>}

          <TextField fullWidth size="small" label="Username" value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required autoFocus sx={{ mb: 2 }} />

          <TextField fullWidth size="small" type="password" label="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required sx={{ mb: 3 }} />

          <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'inherit', fontWeight: 600 }}>Sign up</Link>
        </Typography>
      </Card>
    </Box>
  );
}
