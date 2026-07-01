import { useState, useEffect, useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { AuthContext } from '../context/AuthContext';
import { dashboardAPI } from '../services/api';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import { useTheme, alpha } from '@mui/material/styles';

import GiftOutlined from '@ant-design/icons/GiftOutlined';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';

import AnalyticEcommerce from '../components/cards/statistics/AnalyticEcommerce';
import MainCard from '../components/MainCard';

import IncomeAreaChart from '../sections/dashboard/default/IncomeAreaChart';
import MonthlyBarChart from '../sections/dashboard/default/MonthlyBarChart';
import ReportAreaChart from '../sections/dashboard/default/ReportAreaChart';
import SalesChart from '../sections/dashboard/default/SalesChart';
import OrdersTable from '../sections/dashboard/default/OrdersTable';

export default function Dashboard() {
  const { products, sales } = useContext(StoreContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();

  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sRes, mRes, wRes, oRes] = await Promise.allSettled([
          dashboardAPI.stats(),
          dashboardAPI.chartsMonthly(),
          dashboardAPI.chartsWeekly(),
          dashboardAPI.recentOrders(),
        ]);
        if (sRes.status === 'fulfilled') setStats(sRes.value.data);
        if (mRes.status === 'fulfilled') setMonthlyData(mRes.value.data);
        if (wRes.status === 'fulfilled') setWeeklyData(wRes.value.data);
        if (oRes.status === 'fulfilled') setOrders(oRes.value.data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const localStats = useMemo(() => ({
    totalRevenue: sales.reduce((s, sl) => s + sl.income, 0),
    totalProfit: sales.reduce((s, sl) => s + sl.profit, 0),
    productsSold: sales.reduce((s, sl) => s + sl.qty, 0),
    lowStockCount: products.filter(p => p.qty <= 3).length,
    totalProducts: products.length,
    totalSales: sales.length,
  }), [products, sales]);

  const displayStats = stats || localStats;
  const totalRevenue = displayStats.total_revenue ?? displayStats.totalRevenue ?? 0;
  const totalProfit = displayStats.total_profit ?? displayStats.totalProfit ?? 0;
  const totalProducts = displayStats.total_products ?? displayStats.totalProducts ?? 0;
  const totalSales = displayStats.total_sales ?? displayStats.totalSales ?? 0;
  const productsSold = displayStats.products_sold ?? displayStats.productsSold ?? 0;
  const lowStockCount = displayStats.low_stock_count ?? displayStats.lowStockCount ?? 0;

  const recentSales = useMemo(() => [...sales].sort((a, b) => b.timestamp - a.timestamp).slice(0, 3), [sales]);

  if (loading) {
    return (
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid size={12}><Typography variant="h5">Dashboard</Typography></Grid>
        <Grid size={12} sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}><Typography>Loading...</Typography></Grid>
      </Grid>
    );
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Total Revenue"
          count={`TSh ${Number(totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          percentage={totalRevenue > 0 ? 59.3 : 0}
          extra={`TSh ${Number(totalProfit).toFixed(2)} total profit`} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Products" count={String(totalProducts)}
          percentage={70.5} extra={`${productsSold} items sold total`} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Total Orders" count={String(totalSales)}
          percentage={27.4} isLoss color="warning" extra={`${productsSold} products ordered`} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <AnalyticEcommerce title="Low Stock Items" count={String(lowStockCount)}
          percentage={lowStockCount > 0 ? 12.6 : 0} isLoss={lowStockCount > 0}
          color={lowStockCount > 0 ? 'error' : 'success'}
          extra={lowStockCount > 0 ? 'Needs restocking' : 'Stock looks good'} />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <IncomeAreaChart monthlyData={monthlyData} weeklyData={weeklyData} />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="subtitle1">Income Overview</Typography></Grid>
        </Grid>
        <MainCard sx={{ mt: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="body2" color="text.secondary">This Week Statistics</Typography>
              <Typography variant="h3">TSh {Number(totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart weeklyData={weeklyData} />
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="subtitle1">Recent Orders</Typography></Grid>
          <Grid><Button size="small" variant="text" color="primary" onClick={() => navigate('/sales')}>View All</Button></Grid>
        </Grid>
        <MainCard sx={{ mt: 2, overflow: 'hidden' }}>
          <OrdersTable orders={orders} />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="subtitle1">Analytics Report</Typography></Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Total Revenue Growth" primaryTypographyProps={{ variant: 'body2' }} />
              <Typography variant="h6" color="success.main">+{totalRevenue > 0 ? ((totalRevenue / 100)).toFixed(2) : '0.00'}%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Profit Margin" primaryTypographyProps={{ variant: 'body2' }} />
              <Typography variant="h6">{totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(2) : '0.00'}%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Stock Health" primaryTypographyProps={{ variant: 'body2' }} />
              <Typography variant="h6" color={lowStockCount > 0 ? 'warning.main' : 'success.main'}>{lowStockCount > 0 ? 'Needs Attention' : 'Good'}</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart data={monthlyData} />
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="subtitle1">Sales Report</Typography></Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }}>
          <SalesChart monthlyData={monthlyData} />
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="subtitle1">Transaction History</Typography></Grid>
        </Grid>
        <MainCard sx={{ mt: 2 }}>
          <List component="nav" sx={{ px: 0, py: 0, '& .MuiListItemButton-root': { py: 1.5, px: 2, '& .MuiAvatar-root': { width: 36, height: 36, fontSize: '1rem' } } }}>
            {recentSales.length === 0 ? (
              <ListItem><ListItemText primary="No transactions yet" primaryTypographyProps={{ variant: 'body2', color: 'text.secondary' }} /></ListItem>
            ) : recentSales.map((s, i) => {
              const icons = [<GiftOutlined />, <ShoppingCartOutlined />, <DollarOutlined />];
              const colors = ['success', 'primary', 'warning'];
              return (
                <ListItem key={i} component={ListItemButton} divider={i < recentSales.length - 1}
                  secondaryAction={
                    <Stack alignItems="flex-end">
                      <Typography variant="subtitle2" noWrap>+ TSh {s.income.toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>TSh {s.profit.toLocaleString('en-US', { minimumFractionDigits: 2 })} profit</Typography>
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ color: `${colors[i]}.main`, bgcolor: alpha(theme.palette[colors[i]].main, 0.15) }}>
                      {icons[i]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle2">{s.name}</Typography>} secondary={`${new Date(s.timestamp).toLocaleString()}`} />
                </ListItem>
              );
            })}
          </List>
        </MainCard>
        <MainCard sx={{ mt: 2 }}>
          <Stack sx={{ gap: 3 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid>
                <Stack>
                  <Typography variant="subtitle2">Help & Support Chat</Typography>
                  <Typography variant="caption" color="text.secondary">Typical reply within 5 min</Typography>
                </Stack>
              </Grid>
              <Grid>
                <AvatarGroup sx={{ '& .MuiAvatar-root': { width: 32, height: 32 } }}>
                  {[1, 2, 3, 4].map(i => (
                    <Avatar key={i} alt={`Support ${i}`}
                      src={`https://ui-avatars.com/api/?name=Support+${i}&background=1e293b&color=3b82f6`} />
                  ))}
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>Need Help?</Button>
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
