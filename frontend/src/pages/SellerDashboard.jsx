import { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { dashboardAPI } from '../services/api';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import { useTheme, alpha } from '@mui/material/styles';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import RiseOutlined from '@ant-design/icons/RiseOutlined';
import AnalyticEcommerce from '../components/cards/statistics/AnalyticEcommerce';
import MainCard from '../components/MainCard';

export default function SellerDashboard() {
  const { products, sales } = useContext(StoreContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const todaySales = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return sales.filter(s => new Date(s.timestamp) >= today);
  }, [sales]);

  const todayRevenue = todaySales.reduce((sum, s) => sum + s.income, 0);
  const todayProfit = todaySales.reduce((sum, s) => sum + s.profit, 0);
  const todayCount = todaySales.length;
  const lowStockProducts = products.filter(p => p.qty <= 3);
  const recentSales = useMemo(() => [...sales].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8), [sales]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}>
        <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5">Seller Dashboard</Typography>
          <Button variant="contained" size="large" startIcon={<ShoppingCartOutlined />}
            onClick={() => navigate('/sales')} sx={{ borderRadius: 30, px: 3 }}>
            New Sale
          </Button>
        </Stack>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <AnalyticEcommerce title="Today's Revenue"
          count={`TSh ${todayRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          percentage={todayRevenue > 0 ? 100 : 0}
          extra={`${todayCount} sale${todayCount !== 1 ? 's' : ''} today`} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <AnalyticEcommerce title="Today's Profit"
          count={`TSh ${todayProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          percentage={todayRevenue > 0 ? Math.round((todayProfit / todayRevenue) * 100) : 0}
          extra="Profit margin" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <AnalyticEcommerce title="Total Products"
          count={String(products.length)} percentage={70.5}
          extra={`${products.reduce((s, p) => s + p.qty, 0)} units in stock`} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <AnalyticEcommerce title="Low Stock Items"
          count={String(lowStockProducts.length)}
          percentage={lowStockProducts.length > 0 ? 12.6 : 0}
          isLoss={lowStockProducts.length > 0}
          color={lowStockProducts.length > 0 ? 'error' : 'success'}
          extra={lowStockProducts.length > 0 ? 'Needs restocking' : 'Stock looks good'} />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <MainCard title="Quick Actions">
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button fullWidth variant="contained" size="large"
                onClick={() => navigate('/sales')}
                sx={{ py: 3, borderRadius: 4, fontSize: '1rem' }}>
                <Stack sx={{ alignItems: 'center', gap: 1 }}>
                  <ShoppingCartOutlined style={{ fontSize: '1.5rem' }} />
                  <span>Point of Sale</span>
                </Stack>
              </Button>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Button fullWidth variant="outlined" size="large"
                onClick={() => navigate('/products/list')}
                sx={{ py: 3, borderRadius: 4, fontSize: '1rem' }}>
                <Stack sx={{ alignItems: 'center', gap: 1 }}>
                  <WarningOutlined style={{ fontSize: '1.5rem' }} />
                  <span>Check Inventory</span>
                </Stack>
              </Button>
            </Grid>
          </Grid>
        </MainCard>

        {lowStockProducts.length > 0 && (
          <MainCard sx={{ mt: 2, borderColor: 'error.main' }}>
            <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 1.5 }}>
              <WarningOutlined style={{ color: theme.palette.error.main }} />
              <Typography variant="subtitle1" color="error.main">Low Stock Alert</Typography>
            </Stack>
            {lowStockProducts.slice(0, 5).map(p => (
              <Stack key={p.name} direction="row" sx={{ justifyContent: 'space-between', py: 0.75, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="body2">{p.name}</Typography>
                <Chip label={`${p.qty} left`} color="error" size="small" />
              </Stack>
            ))}
          </MainCard>
        )}
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <MainCard title="Recent Transactions">
          {recentSales.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              No sales yet. Start selling!
            </Typography>
          ) : (
            <List sx={{ p: 0 }}>
              {recentSales.map((s, i) => (
                <ListItem key={i} divider={i < recentSales.length - 1} sx={{ px: 0 }}>
                  <ListItemText
                    primary={<Typography variant="body2"><b>{s.name}</b> x{s.qty}</Typography>}
                    secondary={new Date(s.timestamp).toLocaleString()}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <Stack sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle2" color="success.main">+TSh {s.income.toFixed(2)}</Typography>
                    <Typography variant="caption" color="text.secondary">TSh {s.profit.toFixed(2)} profit</Typography>
                  </Stack>
                </ListItem>
              ))}
            </List>
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
}
