import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import { useAuth } from '../../../context/AuthContext';
import { useThemeMode } from '../../../themes';

export default function Header({ open }) {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();

  const iconBackColorOpen = theme.palette.mode === 'dark' ? 'grey.200' : 'grey.300';
  const iconBackColor = theme.palette.mode === 'dark' ? 'background.default' : 'grey.100';

  const mainHeader = (
    <Toolbar sx={{ minHeight: 60 }}>
      <HeaderContent />
    </Toolbar>
  );

  return matchDownMD ? (
    <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: '1px solid', borderBottomColor: 'divider', zIndex: 1200 }}>
      {mainHeader}
    </AppBar>
  ) : (
    <AppBarStyled open={open} position="fixed" color="inherit" elevation={0}>
      {mainHeader}
    </AppBarStyled>
  );
}
