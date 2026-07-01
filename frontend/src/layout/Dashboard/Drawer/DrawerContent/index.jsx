import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import SunOutlined from '@ant-design/icons/SunOutlined';
import MoonOutlined from '@ant-design/icons/MoonOutlined';
import SimpleBarScroll from '../../../../components/third-party/SimpleBar';
import Navigation from './Navigation';
import { useMenu } from '../../../../api/menu';
import { useThemeMode } from '../../../../themes';

export default function DrawerContent() {
  const { drawerOpen } = useMenu();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <SimpleBarScroll sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column', minHeight: '100%' } }}>
      <Box sx={{ p: '16px', flexGrow: 1 }}>
        <Navigation />
      </Box>
      {drawerOpen && (
        <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Stack direction="row" sx={{ justifyContent: 'center' }}>
            <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.secondary' }}>
              {mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
            </IconButton>
          </Stack>
        </Box>
      )}
    </SimpleBarScroll>
  );
}
