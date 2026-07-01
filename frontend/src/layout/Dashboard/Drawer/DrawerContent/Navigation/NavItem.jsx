import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
function DotIcon({ style }) { return <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor', ...style }} />; }

export default function NavItem({ item, level, matchDownLg, navigate, location, matchPath, drawerOpen }) {
  const theme = useTheme();
  const isSelected = location.pathname === item.url;

  const Icon = item.icon;
  const itemIcon = item.icon ? (
    <Icon style={{ fontSize: '1.15rem' }} />
  ) : (
    <DotIcon style={{ fontSize: level === 1 ? '0.5rem' : '0.375rem', width: level === 1 ? 6 : 4, height: level === 1 ? 6 : 4 }} />
  );

  const itemHandler = () => {
    if (item?.url) navigate(item.url);
  };

  const textColor = theme.palette.mode === 'dark' ? 'grey.500' : 'text.primary';
  const iconSelectedColor = theme.palette.mode === 'dark' ? 'warning.light' : 'primary.main';

  return (
    <ListItemButton
      disabled={item.disabled}
      selected={isSelected}
      onClick={itemHandler}
      sx={{
        zIndex: 1201,
        pl: level === 1 ? 2.5 : level === 2 ? 4.5 : 6.5,
        py: 1,
        mb: 0.5,
        justifyContent: drawerOpen ? 'flex-start' : 'center',
        '&.Mui-selected': {
          bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.lighter',
          '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'primary.dark' : 'primary.lighter' }
        },
        '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'primary.lighter' }
      }}
    >
      <ListItemIcon sx={{ color: isSelected ? iconSelectedColor : textColor, minWidth: drawerOpen ? 28 : 0, justifyContent: 'center' }}>
        {itemIcon}
      </ListItemIcon>
      {drawerOpen && (
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor, fontWeight: isSelected ? 600 : 400 }}>
              {item.title}
            </Typography>
          }
        />
      )}
    </ListItemButton>
  );
}
