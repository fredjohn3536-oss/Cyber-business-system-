import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import useMediaQuery from '@mui/material/useMediaQuery';
import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';

export default function Header({ open }) {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));

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
