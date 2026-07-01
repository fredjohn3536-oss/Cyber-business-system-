import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import MenuFoldOutlined from '@ant-design/icons/MenuFoldOutlined';
import MenuUnfoldOutlined from '@ant-design/icons/MenuUnfoldOutlined';
import SunOutlined from '@ant-design/icons/SunOutlined';
import MoonOutlined from '@ant-design/icons/MoonOutlined';
import { useMenu } from '../../../../api/menu';
import { useThemeMode } from '../../../../themes';

export default function HeaderContent() {
  const theme = useTheme();
  const { drawerOpen, drawerToggle } = useMenu();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
        <IconButton onClick={drawerToggle} size="small" sx={{ color: 'text.primary' }}>
          {drawerOpen ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />}
        </IconButton>
      </Stack>
      <Stack direction="row" sx={{ alignItems: 'center', gap: 1 }}>
        <IconButton onClick={toggleTheme} size="small" sx={{ color: 'text.primary' }}>
          {mode === 'dark' ? <SunOutlined /> : <MoonOutlined />}
        </IconButton>
      </Stack>
    </Stack>
  );
}
