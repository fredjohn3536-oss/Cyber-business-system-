import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import Header from './Header';
import MainDrawer from './Drawer';
import Footer from './Footer';
import { useMenu } from '../../api/menu';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const theme = useTheme();
  const { isAuthenticated, loading } = useAuth();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
  const { drawerOpen } = useMenu();
  const location = useLocation();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;

  return (
    <Box sx={{ display: 'flex', width: '100%' }}>
      <MainDrawer />
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', width: matchDownMD ? '100%' : `calc(100% - ${drawerOpen ? 260 : 60}px)` }}>
        <Header open={drawerOpen} />
        <Toolbar sx={{ minHeight: 60 }} />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Outlet />
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
