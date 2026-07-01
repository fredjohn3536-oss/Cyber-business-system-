import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';

const features = [
  { icon: '\uD83D\uDCE6', title: 'Inventory Management', desc: 'Add products with categories, track stock levels, and get low-stock alerts before you run out.' },
  { icon: '\uD83D\uDCB8', title: 'Point of Sale', desc: 'Quick and easy sales processing with category filtering, search, and real-time profit calculation.' },
  { icon: '\uD83D\uDCCA', title: 'Dashboard Analytics', desc: 'View total revenue, profit margins, sales history, and stock insights at a glance.' },
  { icon: '\uD83E\uDDFE', title: 'Transaction Receipts', desc: 'Automatic receipt generation for every sale with item details, pricing, and profit breakdown.' },
  { icon: '\uD83D\uDC65', title: 'Multi-User Support', desc: 'Role-based access for owners, managers, and sellers with full audit trail logging.' },
  { icon: '\uD83D\uDD10', title: 'Secure & Reliable', desc: 'JWT authentication, encrypted passwords, and a robust database schema for data integrity.' },
];

export default function Landing() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
      <Container maxWidth="lg">
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', py: 2.5 }}>
          <Typography variant="h5" sx={{
            fontWeight: 700,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, #e8e8f0, #8a8aa0)'
              : 'linear-gradient(135deg, #1a1a2e, #6b7280)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            Cyber Business System
          </Typography>
          <Stack direction="row" sx={{ gap: 1.5 }}>
            <Button variant="outlined" sx={{ borderRadius: 30 }} onClick={() => navigate('/login')}>Sign In</Button>
            <Button variant="contained" sx={{ borderRadius: 30, px: 3 }} onClick={() => navigate('/login')}>Get Started</Button>
          </Stack>
        </Stack>
      </Container>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Grid container alignItems="center" spacing={6}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Chip label="Point of Sale & Inventory Management" color="primary" size="small" sx={{ mb: 3, borderRadius: 30 }} />
            <Typography variant="h2" sx={{ fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', mb: 2.5, fontSize: { xs: '2.2rem', md: '3.2rem' } }}>
              Run Your Business{' '}
              <Box component="span" sx={{
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>Smarter</Box>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.15rem', lineHeight: 1.7, mb: 4 }}>
              A lightweight, intuitive POS and inventory management system designed for small businesses and independent sellers. Track sales, manage stock, and grow your revenue.
            </Typography>
            <Stack direction="row" sx={{ gap: 2, alignItems: 'center' }}>
              <Button variant="contained" size="large" sx={{ borderRadius: 30, px: 4 }} onClick={() => navigate('/login')}>
                Start Selling Now →
              </Button>
              <Button variant="outlined" size="large" sx={{ borderRadius: 30, px: 4 }} onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Learn More
              </Button>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            <Box sx={{
              bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
              borderRadius: 6, p: 3.5, width: 320, boxShadow: theme.shadows[8],
            }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2.5 }}>Today's Sales</Typography>
              <Stack sx={{ gap: 2 }}>
                {[{ label: 'Revenue', value: 'TSh 1,247', color: 'success.main' },
                  { label: 'Profit', value: 'TSh 342', color: 'success.main' },
                  { label: 'Items Sold', value: '23', color: 'success.main' },
                ].map(s => (
                  <Stack key={s.label} direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', bgcolor: 'action.hover', borderRadius: 2, px: 2, py: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">{s.label}</Typography>
                    <Typography variant="subtitle2" color={s.color}>{s.value}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Container maxWidth="lg" id="features" sx={{ mt: 12, mb: 12, textAlign: 'center' }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 1.5 }}>Everything You Need</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, fontSize: '1.1rem' }}>
          Powerful features to manage your business efficiently
        </Typography>
        <Grid container spacing={3}>
          {features.map(f => (
            <Grid key={f.title} size={{ xs: 12, sm: 6, md: 4 }}>
              <Box sx={{
                bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider',
                borderRadius: 4, p: 3, textAlign: 'left', height: '100%',
                transition: 'transform 0.2s, border-color 0.2s',
                '&:hover': { transform: 'translateY(-4px)', borderColor: 'primary.main' },
              }}>
                <Typography variant="h4" sx={{ mb: 2 }}>{f.icon}</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{f.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>{f.desc}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Box sx={{ textAlign: 'center', py: 10, bgcolor: 'background.paper', borderTop: '1px solid', borderBottom: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="sm">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1.5 }}>Ready to Transform Your Business?</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>Get started in minutes. No credit card required.</Typography>
          <Button variant="contained" size="large" sx={{ borderRadius: 30, px: 5 }} onClick={() => navigate('/login')}>
            Launch Cyber Business System →
          </Button>
        </Container>
      </Box>

      <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
        <Typography variant="caption">© 2026 Cyber Business System. Built for small businesses.</Typography>
      </Box>
    </Box>
  );
}
