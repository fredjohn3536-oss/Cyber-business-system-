import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
function DotIcon({ style }) { return <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: 'currentColor', ...style }} />; }
import { useState } from 'react';
import NavItem from './NavItem';

export default function NavGroup({ item, level, matchDownLg, navigate, location, matchPath, drawerOpen }) {
  const theme = useTheme();
  const [open, setOpen] = useState(() => item.children?.some((child) => location.pathname === child?.url));
  const Icon = item.icon;

  const handleClick = () => { if (drawerOpen) setOpen(!open); };

  const menus = item.children?.map((child) => {
    if (child.type === 'item') {
      return <NavItem key={child.id} item={child} level={level + 1} matchDownLg={matchDownLg} navigate={navigate} location={location} matchPath={matchPath} drawerOpen={drawerOpen} />;
    }
    return null;
  });

  const textColor = theme.palette.mode === 'dark' ? 'grey.400' : 'text.primary';

  return (
    <>
      <ListItemButton
        selected={open}
        onClick={handleClick}
        sx={{
          pl: level === 1 ? 2.5 : level === 2 ? 4.5 : 6.5,
          py: 1,
          mb: 0.5,
          justifyContent: drawerOpen ? 'flex-start' : 'center',
          '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'primary.lighter' },
          '&.Mui-selected': { bgcolor: 'transparent', '&:hover': { bgcolor: theme.palette.mode === 'dark' ? 'divider' : 'primary.lighter' } }
        }}
      >
        {Icon && (
          <ListItemIcon sx={{ color: textColor, minWidth: drawerOpen ? 28 : 0, justifyContent: 'center' }}>
            <Icon style={{ fontSize: '1.15rem' }} />
          </ListItemIcon>
        )}
        {!Icon && drawerOpen && <DotIcon style={{ marginLeft: level === 1 ? 28 : 12, color: textColor, width: 4, height: 4 }} />}
        {drawerOpen && (
          <ListItemText
            primary={<Typography variant="h6" sx={{ color: textColor }}>{item.title}</Typography>}
          />
        )}
        {drawerOpen && (open ? (
          <Box component="svg" width="12" height="12" viewBox="0 0 24 24" fill={textColor}>
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
          </Box>
        ) : (
          <Box component="svg" width="12" height="12" viewBox="0 0 24 24" fill={textColor} sx={{ transform: 'rotate(-90deg)' }}>
            <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
          </Box>
        ))}
      </ListItemButton>
      {drawerOpen && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>{menus}</List>
        </Collapse>
      )}
    </>
  );
}
