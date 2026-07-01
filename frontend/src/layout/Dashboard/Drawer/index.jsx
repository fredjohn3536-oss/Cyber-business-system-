import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import MiniDrawerStyled from './MiniDrawerStyled';
import DrawerHeader from './DrawerHeader';
import DrawerContent from './DrawerContent';
import { useMenu } from '../../../api/menu';

function TemporaryDrawer({ container, drawerOpen, drawerToggle }) {
  return (
    <MuiDrawer
      container={container}
      variant="temporary"
      open={drawerOpen}
      onClose={drawerToggle}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 260, borderRight: '1px solid', borderRightColor: 'divider' } }}
    >
      <DrawerHeader open />
      <DrawerContent />
    </MuiDrawer>
  );
}

export default function MainDrawer({ window }) {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down('lg'));
  const { drawerOpen, drawerToggle } = useMenu();

  const container = window ? () => window().document.body : undefined;

  return (
    <Box component="nav" sx={{ flexShrink: { md: 0 }, width: matchDownMD ? 'auto' : { md: drawerOpen ? 260 : 60 } }}>
      {matchDownMD ? (
        <TemporaryDrawer container={container} drawerOpen={drawerOpen} drawerToggle={drawerToggle} />
      ) : (
        <MiniDrawerStyled variant="permanent" open={drawerOpen}>
          <DrawerHeader open={drawerOpen} />
          <DrawerContent />
        </MiniDrawerStyled>
      )}
    </Box>
  );
}
