import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import NavGroup from './NavGroup';
import NavItem from './NavItem';
import menuItems from '../../../../../menu-items';
import { useAuth } from '../../../../../context/AuthContext';
import { useMenu } from '../../../../../api/menu';

export default function Navigation() {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { drawerOpen } = useMenu();

  const isLoggedIn = !!user;
  const matchDownLg = useMediaQuery(theme.breakpoints.down('lg'));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const textColor = theme.palette.mode === 'dark' ? 'grey.500' : 'text.primary';

  const navGroups = menuItems.items
    .filter((item) => item.type === 'group')
    .map((item) => {
      const filteredChildren = item.children?.map((child) => {
        if (child.children) {
          return {
            ...child,
            children: child.children.filter((sub) => {
              if (sub.id === 'admin' && !isLoggedIn) return false;
              if (sub.id === 'logout' && !isLoggedIn) return false;
              if (sub.id === 'login' && isLoggedIn) return false;
              if (sub.id === 'register' && isLoggedIn) return false;
              return true;
            })
          };
        }
        return child;
      }).filter((child) => {
        if (child.id === 'admin' && !isLoggedIn) return false;
        if (child.id === 'logout' && !isLoggedIn) return false;
        if (child.id === 'login' && isLoggedIn) return false;
        if (child.id === 'register' && isLoggedIn) return false;
        return true;
      });

      if (filteredChildren && filteredChildren.length === 0) return null;

      return (
        <List key={item.id} subheader={
          item.title && drawerOpen && (
            <Typography variant="caption" display="block" sx={{ textTransform: 'uppercase', mt: 1.5 }}>
              {item.title}
            </Typography>
          )
        }>
          {filteredChildren.map((child) => {
            if (child.type === 'group' && child.children) {
              return child.children.map((subChild) => {
                if (subChild.id === 'logout') {
                  return (
                    <ListItemButton key="logout" onClick={handleLogout} sx={{ pl: 2.5, py: 1, mb: 0.5, justifyContent: drawerOpen ? 'flex-start' : 'center' }}>
                      <ListItemIcon sx={{ color: textColor, minWidth: drawerOpen ? 28 : 0, justifyContent: 'center' }}>
                        <LogoutOutlined style={{ fontSize: '1.15rem' }} />
                      </ListItemIcon>
                      {drawerOpen && <ListItemText primary={<Typography variant="h6" sx={{ color: textColor }}>Logout</Typography>} />}
                    </ListItemButton>
                  );
                }
                return subChild.type === 'item' ? <NavItem key={subChild.id} item={subChild} level={1} matchDownLg={matchDownLg} navigate={navigate} location={location} matchPath={matchPath} drawerOpen={drawerOpen} /> : null;
              });
            }
            if (child.type === 'item') {
              return <NavItem key={child.id} item={child} level={1} matchDownLg={matchDownLg} navigate={navigate} location={location} matchPath={matchPath} drawerOpen={drawerOpen} />;
            }
            if (child.type === 'collapse') {
              return <NavGroup key={child.id} item={child} level={1} matchDownLg={matchDownLg} navigate={navigate} location={location} matchPath={matchPath} drawerOpen={drawerOpen} />;
            }
            return null;
          })}
        </List>
      );
    });

  return navGroups;
}
