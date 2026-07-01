import { useLocation, matchPath, useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import NavGroup from './NavGroup';
import NavItem from './NavItem';
import menuItems from '../../../../../menu-items';
import { useAuth } from '../../../../../context/AuthContext';

export default function Navigation() {
  const theme = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = !!user;
  const matchDownLg = useMediaQuery(theme.breakpoints.down('lg'));

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
          item.title && (
            <Typography variant="caption" display="block" sx={{ textTransform: 'uppercase', mt: 1.5 }}>
              {item.title}
            </Typography>
          )
        }>
          {filteredChildren.map((child) => {
            if (child.type === 'group' && child.children) {
              return child.children.map((subChild) => (
                subChild.type === 'item' ? <NavItem key={subChild.id} item={subChild} level={1} matchDownLg={matchDownLg} navigate={navigate} location={location} matchPath={matchPath} /> : null
              ));
            }
            if (child.type === 'item') {
              return <NavItem key={child.id} item={child} level={1} matchDownLg={matchDownLg} navigate={navigate} location={location} matchPath={matchPath} />;
            }
            if (child.type === 'collapse') {
              return <NavGroup key={child.id} item={child} level={1} matchDownLg={matchDownLg} navigate={navigate} location={location} matchPath={matchPath} />;
            }
            return null;
          })}
        </List>
      );
    });

  return navGroups;
}
