import React, { useState, useEffect, useContext, useMemo } from 'react';
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
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useTheme, alpha } from '@mui/material/styles';
import { LineChart, BarChart } from '@mui/x-charts';
import { chartsGridClasses } from '@mui/x-charts';

import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import BoxPlotOutlined from '@ant-design/icons/BoxPlotOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import WarningOutlined from '@ant-design/icons/WarningOutlined';

import StatCard from '../components/StatCard';
import MainCard from '../components/MainCard';

function OrdersTable({ orders }) {
  const theme = useTheme();
  return (
    <TableContainer sx={{ width: '100%', overflowX: 'auto', display: 'block', maxWidth: '100%', '& td, & th': { whiteSpace: 'nowrap' } }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Items</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Profit</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.length === 0 ? (
            <TableRow><TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>No orders yet</TableCell></TableRow>
          ) : orders.map((row) => (
            <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell><Link color="secondary" underline="hover">{row.receipt_number}</Link></TableCell>
              <TableCell>{row.items_count} items</TableCell>
              <TableCell align="right">${parseFloat(row.total_amount).toFixed(2)}</TableCell>
              <TableCell align="right" sx={{ color: row.total_profit >= 0 ? 'success.main' : 'error.main' }}>
                ${parseFloat(row.total_profit).toFixed(2)}
              </TableCell>
              <TableCell>{new Date(row.sale_date).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function IncomeAreaChart({ monthlyData, weeklyData }) {
  const theme = useTheme();
  const [view, setView] = useState('monthly');
  const [visibility, setVisibility] = useState({ Income: true, Profit: true });

  const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const labels = view === 'monthly' ? monthlyLabels : weeklyLabels;
  const data = view === 'monthly' ? monthlyData : weeklyData;
  const incomeData = data?.series?.[0]?.data || [];
  const profitData = data?.series?.[1]?.data || [];

  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };
  const line = theme.palette.divider;

  const visibleSeries = [
    { data: incomeData, label: 'Income', showMark: false, area: true, id: 'Income', color: theme.palette.primary.main, visible: visibility.Income },
    { data: profitData, label: 'Profit', showMark: false, area: true, id: 'Profit', color: theme.palette.success.main, visible: visibility.Profit },
  ];

  return (
    <MainCard contentSX={{ p: 0 }}>
      <Box sx={{ px: 2.5, pt: 2.5 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="subtitle1">Unique Visitor</Typography></Grid>
          <Grid>
            <Stack direction="row" spacing={1}>
              <Button size="small" onClick={() => setView('monthly')} color={view === 'monthly' ? 'primary' : 'secondary'} variant={view === 'monthly' ? 'outlined' : 'text'} sx={{ minWidth: 60 }}>Month</Button>
              <Button size="small" onClick={() => setView('weekly')} color={view === 'weekly' ? 'primary' : 'secondary'} variant={view === 'weekly' ? 'outlined' : 'text'} sx={{ minWidth: 60 }}>Week</Button>
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ pt: 1, pr: 2 }}>
        <LineChart
          grid={{ horizontal: true }}
          xAxis={[{ scaleType: 'point', data: labels, disableLine: true, tickLabelStyle: axisFonstyle }]}
          yAxis={[{ disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
          height={450}
          margin={{ top: 40, bottom: 20, right: 20 }}
          series={visibleSeries.filter(s => s.visible).map(s => ({
            type: 'line', data: s.data, label: s.label, showMark: s.showMark, area: s.area, id: s.id,
            color: s.color, stroke: s.color, strokeWidth: 2,
          }))}
          slotProps={{ legend: { hidden: true } }}
          sx={{
            '& .MuiAreaElement-series-Income': { fill: `url('#gradInc')`, strokeWidth: 2, opacity: 0.8 },
            '& .MuiAreaElement-series-Profit': { fill: `url('#gradProf')`, strokeWidth: 2, opacity: 0.8 },
            '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: line },
          }}
        >
          <defs>
            <linearGradient id="gradInc" gradientTransform="rotate(90)">
              <stop offset="10%" stopColor={alpha(theme.palette.primary.main, 0.4)} />
              <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
            </linearGradient>
            <linearGradient id="gradProf" gradientTransform="rotate(90)">
              <stop offset="10%" stopColor={alpha(theme.palette.success.main, 0.4)} />
              <stop offset="90%" stopColor={alpha(theme.palette.background.default, 0.4)} />
            </linearGradient>
          </defs>
        </LineChart>
      </Box>
      <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'center', pb: 2 }}>
        {visibleSeries.map(item => (
          <Stack key={item.label} direction="row" sx={{ gap: 1.25, alignItems: 'center', cursor: 'pointer' }}
            onClick={() => setVisibility(v => ({ ...v, [item.label]: !v[item.label] }))}>
            <Box sx={{ width: 12, height: 12, bgcolor: item.visible ? item.color : 'grey.500', borderRadius: '50%' }} />
            <Typography variant="body2" color="text.primary">{item.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </MainCard>
  );
}

function MonthlyBarChart() {
  const theme = useTheme();
  const data = [80, 95, 70, 42, 65, 55, 78];
  const xLabels = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  return (
    <BarChart
      height={380}
      series={[{ data, label: 'Series-1' }]}
      xAxis={[{ data: xLabels, scaleType: 'band', disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
      leftAxis={null}
      slotProps={{ legend: { hidden: true }, bar: { rx: 5, ry: 5 } }}
      axisHighlight={{ x: 'none' }}
      margin={{ left: 20, right: 20 }}
      colors={[theme.palette.info.light]}
      sx={{ '& .MuiBarElement-root:hover': { opacity: 0.6 } }}
    />
  );
}

function ReportAreaChart({ data: chartData }) {
  const theme = useTheme();
  const data = chartData?.series?.[1]?.data?.slice(0, 7) || [58, 115, 28, 83, 63, 75, 35];
  const labels = chartData?.labels?.slice(0, 7) || ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const axisFonstyle = { fill: theme.palette.text.secondary };

  return (
    <LineChart
      grid={{ horizontal: true }}
      xAxis={[{ data: labels, scaleType: 'point', disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
      yAxis={[{ tickMaxStep: 10 }]}
      leftAxis={null}
      series={[{ data, showMark: false, id: 'ReportAreaChart', color: theme.palette.warning.main }]}
      slotProps={{ legend: { hidden: true } }}
      height={340}
      margin={{ top: 30, bottom: 50, left: 20, right: 20 }}
      sx={{ '& .MuiLineElement-root': { strokeWidth: 1 }, [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3' } }}
    />
  );
}

function SalesChart({ monthlyData }) {
  const theme = useTheme();
  const [showIncome, setShowIncome] = useState(true);
  const [showCost, setShowCost] = useState(true);

  const labels = monthlyData?.labels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const incomeData = monthlyData?.series?.[0]?.data || [];
  const profitData = monthlyData?.series?.[1]?.data || [];
  const primaryColor = theme.palette.primary.main;
  const warningColor = theme.palette.warning.main;
  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  const totalIncome = incomeData.reduce((a, b) => a + b, 0);
  const totalProfit = profitData.reduce((a, b) => a + b, 0);

  const chartSeries = [
    { data: incomeData, label: 'Income', color: warningColor, visible: showIncome },
    { data: profitData, label: 'Profit', color: primaryColor, visible: showCost },
  ];

  return (
    <Box sx={{ p: 2.5, pb: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Box>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Net Profit</Typography>
          <Typography variant="h4">${totalProfit.toFixed(2)}</Typography>
        </Box>
        <Stack direction="row">
          <FormControlLabel control={<Checkbox checked={showIncome} onChange={() => setShowIncome(!showIncome)} sx={{ '&.Mui-checked': { color: warningColor } }} />} label="Income" />
          <FormControlLabel control={<Checkbox checked={showCost} onChange={() => setShowCost(!showCost)} sx={{ '&.Mui-checked': { color: primaryColor } }} />} label="Profit" />
        </Stack>
      </Stack>
      <BarChart
        height={380}
        grid={{ horizontal: true }}
        xAxis={[{ data: labels, scaleType: 'band', tickLabelStyle: { ...axisFonstyle, fontSize: 12 } }]}
        yAxis={[{ disableLine: true, disableTicks: true, tickMaxStep: 20, tickLabelStyle: axisFonstyle }]}
        series={chartSeries.filter(s => s.visible).map(s => ({ data: s.data, label: s.label, color: s.color, type: 'bar' }))}
        slotProps={{ legend: { hidden: true }, bar: { rx: 5, ry: 5 } }}
        axisHighlight={{ x: 'none' }}
        margin={{ top: 30, left: 40, right: 10 }}
        tooltip={{ trigger: 'item' }}
        sx={{ '& .MuiBarElement-root:hover': { opacity: 0.6 }, '& .MuiChartsAxis-directionX .MuiChartsAxis-tick, & .MuiChartsAxis-root line': { stroke: theme.palette.divider } }}
      />
    </Box>
  );
}

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
        <StatCard title="Total Revenue" count={`$${Number(totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          percentage={totalRevenue > 0 ? 59.3 : 0} extra={`$${Number(totalProfit).toFixed(2)} total profit`} icon={<DollarOutlined />} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <StatCard title="Products" count={String(totalProducts)} percentage={70.5} extra={`${productsSold} items sold total`} icon={<BoxPlotOutlined />} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <StatCard title="Total Orders" count={String(totalSales)} percentage={27.4} isLoss color="warning" extra={`${productsSold} products ordered`} icon={<ShoppingCartOutlined />} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <StatCard title="Low Stock Items" count={String(lowStockCount)}
          percentage={lowStockCount > 0 ? 12.6 : 0} isLoss={lowStockCount > 0} color={lowStockCount > 0 ? 'error' : 'success'}
          extra={lowStockCount > 0 ? 'Needs restocking' : 'Stock looks good'} icon={<WarningOutlined />} />
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
              <Typography variant="h3">${Number(totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart />
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
                      <Typography variant="subtitle2" noWrap>+ ${s.income.toFixed(2)}</Typography>
                      <Typography variant="caption" color="text.secondary" noWrap>${s.profit.toFixed(2)} profit</Typography>
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
