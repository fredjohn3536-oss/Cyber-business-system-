import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import HomeOutlined from '@ant-design/icons/HomeOutlined';
import navigation from '../../menu-items';

export default function Breadcrumbs({ card = false, custom = false, divider: showDivider = false, heading, icon, icons, links, maxItems, rightAlign, separator, title = true, titleBottom = true, sx, ...others }) {
  const theme = useTheme();
  const location = useLocation();
  const [main, setMain] = useState();
  const [item, setItem] = useState();

  const iconSX = { marginRight: theme.spacing(0.75), marginLeft: 0, width: '1rem', height: '1rem', color: theme.palette.secondary.main };

  useEffect(() => {
    navigation?.items?.map((menu) => {
      if (menu.type && menu.type === 'group') {
        if (menu?.url && menu.url === location.pathname) {
          setMain(menu); setItem(menu);
        } else if (menu.children) {
          menu.children.filter((collapse) => {
            if (collapse.type === 'item' && location.pathname === collapse.url) {
              setMain(menu); setItem(collapse);
            } else if (collapse.children) {
              collapse.children.filter((sub) => {
                if (sub.type === 'item' && location.pathname === sub.url) { setMain(collapse); setItem(sub); }
                return false;
              });
            }
            return false;
          });
        }
      }
      return false;
    });
  }, [location.pathname]);

  const SeparatorIcon = separator;
  const separatorIcon = separator ? <SeparatorIcon style={{ fontSize: '0.75rem', marginTop: 2 }} /> : '/';

  let mainContent, itemContent;
  let breadcrumbContent = <Typography />;
  let itemTitle = '';
  let CollapseIcon, ItemIcon;

  if (main && main.type === 'group') {
    CollapseIcon = main.icon || HomeOutlined;
    mainContent = (
      <Typography variant="h6" color="text.secondary" sx={{ textDecoration: 'none' }}>
        {main?.title}
      </Typography>
    );
  }

  if (item && item.type === 'item') {
    itemTitle = item?.title;
    ItemIcon = item?.icon || HomeOutlined;
    itemContent = (
      <Typography variant="subtitle1" color="text.primary">
        {itemTitle}
      </Typography>
    );

    let tempContent = (
      <MuiBreadcrumbs aria-label="breadcrumb" maxItems={maxItems || 8} separator={separatorIcon}>
        <Typography component={Link} to="/" color="text.secondary" variant="h6" sx={{ textDecoration: 'none' }}>
          <HomeOutlined style={{ ...iconSX, marginRight: 4 }} /> Home
        </Typography>
        {mainContent}
        {itemContent}
      </MuiBreadcrumbs>
    );

    if (item?.breadcrumbs !== false || custom) {
      breadcrumbContent = (
        <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" spacing={1} sx={{ mb: 3, ...sx }}>
          <Grid>{tempContent}</Grid>
          {title && titleBottom && (
            <Grid sx={{ mt: 0.25 }}>
              <Typography variant="h2">{custom ? heading : item?.title}</Typography>
            </Grid>
          )}
          {card === false && showDivider !== false && <Divider sx={{ mt: 2 }} />}
        </Grid>
      );
    }
  }

  return breadcrumbContent;
}
