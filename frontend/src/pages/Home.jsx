import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../context/StoreContext';
import { AuthContext } from '../context/AuthContext';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
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

const iconSX = { fontSize: '0.75rem', color: 'inherit', marginLeft: 0, marginRight: 0 };

function StatCard({ color = 'primary', title, count, percentage, isLoss, extra, icon }) {
  const theme = useTheme();
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: theme.palette.divider, borderRadius: 1 }}>
      <CardContent sx={{ p: 2.25, '&:last-child': { pb: 2.25 } }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="body2" color="text.secondary">{title}</Typography>
          <Grid container alignItems="center">
            <Grid size="grow">
              <Stack direction="row" alignItems="center" spacing={1}>
                {icon && <Box sx={{ color: `${color}.main`, display: 'flex' }}>{icon}</Box>}
                <Typography variant="h4" color="inherit">{count}</Typography>
              </Stack>
            </Grid>
            {percentage && (
              <Grid>
                <Chip
                  variant="filled"
                  color={color}
                  icon={isLoss ? <FallOutlined style={iconSX} /> : <RiseOutlined style={iconSX} />}
                  label={`${percentage}%`}
                  sx={{ ml: 1.25, pl: 1, bgcolor: alpha(theme.palette[color].main, 0.15), color: `${color}.main`, fontWeight: 600 }}
                  size="small"
                />
              </Grid>
            )}
          </Grid>
        </Stack>
        {extra && (
          <Box sx={{ pt: 2.25 }}>
            <Typography variant="caption" color="text.secondary">
              {extra}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}

function OrdersTable({ sales }) {
  const [order] = useState('asc');
  const [orderBy] = useState('timestamp');

  const rows = useMemo(() => {
    return [...sales].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10).map((s, i) => ({
      id: `ORD-${String(i + 1).padStart(6, '0')}`,
      product: s.name,
      qty: s.qty,
      amount: s.income,
      profit: s.profit,
      time: new Date(s.timestamp).toLocaleDateString(),
    }));
  }, [sales]);

  const theme = useTheme();

  return (
    <TableContainer sx={{ width: '100%', overflowX: 'auto', display: 'block', maxWidth: '100%', '& td, & th': { whiteSpace: 'nowrap' } }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Product</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Profit</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No orders yet</TableCell></TableRow>
          ) : rows.map((row) => (
            <TableRow key={row.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell><Link color="secondary" underline="hover">{row.id}</Link></TableCell>
              <TableCell>{row.product}</TableCell>
              <TableCell align="right">{row.qty}</TableCell>
              <TableCell align="right">${row.amount.toFixed(2)}</TableCell>
              <TableCell align="right" sx={{ color: row.profit >= 0 ? 'success.main' : 'error.main' }}>${row.profit.toFixed(2)}</TableCell>
              <TableCell>{row.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function IncomeAreaChart() {
  const theme = useTheme();
  const [view, setView] = useState('monthly');
  const [visibility, setVisibility] = useState({ Revenue: true, Profit: true });

  const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weeklyLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const labels = view === 'monthly' ? monthlyLabels : weeklyLabels;
  const revenueData = view === 'monthly' ? [1200, 1900, 1600, 2100, 1800, 2400, 2200, 2800, 2500, 3000, 2700, 3200] : [400, 600, 500, 750, 650, 800, 700];
  const profitData = view === 'monthly' ? [300, 500, 400, 600, 450, 700, 650, 800, 700, 900, 750, 950] : [100, 150, 120, 200, 180, 220, 190];

  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };
  const line = theme.palette.divider;

  const visibleSeries = [
    { data: revenueData, label: 'Revenue', showMark: false, area: true, id: 'Revenue', color: theme.palette.primary.main, visible: visibility.Revenue },
    { data: profitData, label: 'Profit', showMark: false, area: true, id: 'Profit', color: theme.palette.success.main, visible: visibility.Profit },
  ];

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: theme.palette.divider, borderRadius: 1, mt: 1.5 }}>{/* header */}
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
          series={visibleSeries.filter(s => s.visible).map(s => ({ type: 'line', data: s.data, label: s.label, showMark: s.showMark, area: s.area, id: s.id, color: s.color, stroke: s.color, strokeWidth: 2 }))}
          slotProps={{ legend: { hidden: true } }}
          sx={{
            '& .MuiAreaElement-series-Revenue': { fill: `url('#gradRev')`, strokeWidth: 2, opacity: 0.8 },
            '& .MuiAreaElement-series-Profit': { fill: `url('#gradProf')`, strokeWidth: 2, opacity: 0.8 },
            '& .MuiChartsAxis-directionX .MuiChartsAxis-tick': { stroke: line }
          }}
        >
          <defs>
            <linearGradient id="gradRev" gradientTransform="rotate(90)">
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
          <Stack key={item.label} direction="row" sx={{ gap: 1.25, alignItems: 'center', cursor: 'pointer' }} onClick={() => setVisibility(v => ({ ...v, [item.label]: !v[item.label] }))}>
            <Box sx={{ width: 12, height: 12, bgcolor: item.visible ? item.color : 'grey.500', borderRadius: '50%' }} />
            <Typography variant="body2" color="text.primary">{item.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Card>
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

function ReportAreaChart() {
  const theme = useTheme();
  const data = [58, 115, 28, 83, 63, 75, 35];
  const labels = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const axisFonstyle = { fill: theme.palette.text.secondary };

  return (
    <LineChart
      grid={{ horizontal: true }}
      xAxis={[{ data: labels, scaleType: 'point', disableLine: true, disableTicks: true, tickLabelStyle: axisFonstyle }]}
      yAxis={[{ tickMaxStep: 10 }]}
      leftAxis={null}
      series={[{ data, showMark: false, id: 'ReportAreaChart', color: theme.palette.warning.main, label: 'Series 1' }]}
      slotProps={{ legend: { hidden: true } }}
      height={340}
      margin={{ top: 30, bottom: 50, left: 20, right: 20 }}
      sx={{ '& .MuiLineElement-root': { strokeWidth: 1 }, [`& .${chartsGridClasses.line}`]: { strokeDasharray: '5 3' } }}
    />
  );
}

function SalesChart() {
  const theme = useTheme();
  const [showIncome, setShowIncome] = useState(true);
  const [showCost, setShowCost] = useState(true);

  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const primaryColor = theme.palette.primary.main;
  const warningColor = theme.palette.warning.main;
  const axisFonstyle = { fontSize: 10, fill: theme.palette.text.secondary };

  const data = [
    { data: [180, 90, 135, 114, 120, 145, 170, 200, 170, 230, 210, 180], label: 'Income', color: warningColor },
    { data: [120, 45, 78, 150, 168, 99, 180, 220, 180, 210, 220, 200], label: 'Cost of Sales', color: primaryColor },
  ];

  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: theme.palette.divider, borderRadius: 1, mt: 1 }}>
      <Box sx={{ p: 2.5, pb: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>Net Profit</Typography>
            <Typography variant="h4">$1560</Typography>
          </Box>
          <Stack direction="row">
            <FormControlLabel control={<Checkbox checked={showIncome} onChange={() => setShowIncome(!showIncome)} sx={{ '&.Mui-checked': { color: warningColor } }} />} label="Income" />
            <FormControlLabel control={<Checkbox checked={showCost} onChange={() => setShowCost(!showCost)} sx={{ '&.Mui-checked': { color: primaryColor } }} />} label="Cost of Sales" />
          </Stack>
        </Stack>
        <BarChart
          height={380}
          grid={{ horizontal: true }}
          xAxis={[{ data: labels, scaleType: 'band', tickLabelStyle: { ...axisFonstyle, fontSize: 12 } }]}
          yAxis={[{ disableLine: true, disableTicks: true, tickMaxStep: 20, tickLabelStyle: axisFonstyle }]}
          series={data.filter(s => (s.label === 'Income' && showIncome) || (s.label === 'Cost of Sales' && showCost)).map(s => ({ ...s, type: 'bar' }))}
          slotProps={{ legend: { hidden: true }, bar: { rx: 5, ry: 5 } }}
          axisHighlight={{ x: 'none' }}
          margin={{ top: 30, left: 40, right: 10 }}
          tooltip={{ trigger: 'item' }}
          sx={{ '& .MuiBarElement-root:hover': { opacity: 0.6 }, '& .MuiChartsAxis-directionX .MuiChartsAxis-tick, & .MuiChartsAxis-root line': { stroke: theme.palette.divider } }}
        />
      </Box>
    </Card>
  );
}

function SaleReportCard() {
  const [period, setPeriod] = useState('today');
  const status = [
    { value: 'today', label: 'Today' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  return (
    <>
      <Grid container alignItems="center" justifyContent="space-between">
        <Grid><Typography variant="subtitle1">Sales Report</Typography></Grid>
        <Grid>
          <TextField select size="small" value={period} onChange={(e) => setPeriod(e.target.value)} sx={{ '& .MuiInputBase-input': { py: 0.75, fontSize: '0.875rem' } }}>
            {status.map(o => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </TextField>
        </Grid>
      </Grid>
      <SalesChart />
    </>
  );
}

const avatarSX = { width: 36, height: 36, fontSize: '1rem' };
const actionSX = { mt: 0.75, ml: 1, top: 'auto', right: 'auto', alignSelf: 'flex-start', transform: 'none' };

function CardBox({ children, sx, contentSx, ...props }) {
  const theme = useTheme();
  return (
    <Card elevation={0} sx={{ border: '1px solid', borderColor: theme.palette.divider, borderRadius: 1, ...sx }} {...props}>
      {children}
    </Card>
  );
}

export default function Home() {
  const { products, sales } = useContext(StoreContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const stats = useMemo(() => {
    let totalRevenue = 0, totalProfit = 0, productsSold = 0;
    sales.forEach(s => { totalRevenue += s.income; totalProfit += s.profit; productsSold += s.qty; });
    return {
      totalRevenue: totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      totalProfit: totalProfit.toFixed(2),
      totalSales: sales.length,
      productsSold,
      totalProducts: products.length,
      lowStockCount: products.filter(p => p.qty <= 3).length,
    };
  }, [products, sales]);

  const recentSales = useMemo(() => [...sales].sort((a, b) => b.timestamp - a.timestamp).slice(0, 3), [sales]);

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid sx={{ mb: -2.25 }} size={12}>
        <Typography variant="h5">Dashboard</Typography>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <StatCard title="Total Revenue" count={`$${stats.totalRevenue}`} percentage={59.3} extra={`$${stats.totalProfit} total profit`} icon={<DollarOutlined />} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <StatCard title="Products" count={String(stats.totalProducts)} percentage={70.5} extra={`${stats.productsSold} items sold total`} icon={<BoxPlotOutlined />} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <StatCard title="Total Orders" count={String(stats.totalSales)} percentage={27.4} isLoss color="warning" extra={`${stats.productsSold} products ordered`} icon={<ShoppingCartOutlined />} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
        <StatCard title="Low Stock Items" count={String(stats.lowStockCount)} percentage={stats.lowStockCount > 0 ? 12.6 : 0} isLoss={stats.lowStockCount > 0} color={stats.lowStockCount > 0 ? 'error' : 'success'} extra={stats.lowStockCount > 0 ? 'Needs restocking' : 'Stock looks good'} icon={<WarningOutlined />} />
      </Grid>

      <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <IncomeAreaChart />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="subtitle1">Income Overview</Typography></Grid>
        </Grid>
        <CardBox sx={{ mt: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack sx={{ gap: 2 }}>
              <Typography variant="body2" color="text.secondary">This Week Statistics</Typography>
              <Typography variant="h3">${stats.totalRevenue}</Typography>
            </Stack>
          </Box>
          <MonthlyBarChart />
        </CardBox>
      </Grid>

      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="subtitle1">Recent Orders</Typography></Grid>
          <Grid><Button size="small" variant="text" color="primary" onClick={() => navigate('/sales')}>View All</Button></Grid>
        </Grid>
        <CardBox sx={{ mt: 2, overflow: 'hidden' }} content={false}>
          <OrdersTable sales={sales} />
        </CardBox>
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="subtitle1">Analytics Report</Typography></Grid>
        </Grid>
        <CardBox sx={{ mt: 2 }}>
          <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
            <ListItemButton divider>
              <ListItemText primary="Total Revenue Growth" primaryTypographyProps={{ variant: 'body2' }} />
              <Typography variant="h6" color="success.main">+{((parseFloat(stats.totalRevenue.replace(/,/g, '')) || 0) / 100).toFixed(2)}%</Typography>
            </ListItemButton>
            <ListItemButton divider>
              <ListItemText primary="Profit Margin" primaryTypographyProps={{ variant: 'body2' }} />
              <Typography variant="h6">{((parseFloat(stats.totalProfit) / (parseFloat(stats.totalRevenue.replace(/,/g, '')) || 1)) * 100).toFixed(2)}%</Typography>
            </ListItemButton>
            <ListItemButton>
              <ListItemText primary="Stock Health" primaryTypographyProps={{ variant: 'body2' }} />
              <Typography variant="h6" color={stats.lowStockCount > 0 ? 'warning.main' : 'success.main'}>{stats.lowStockCount > 0 ? 'Needs Attention' : 'Good'}</Typography>
            </ListItemButton>
          </List>
          <ReportAreaChart />
        </CardBox>
      </Grid>

      <Grid size={{ xs: 12, md: 7, lg: 8 }}>
        <SaleReportCard />
      </Grid>
      <Grid size={{ xs: 12, md: 5, lg: 4 }}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid><Typography variant="subtitle1">Transaction History</Typography></Grid>
        </Grid>
        <CardBox sx={{ mt: 2 }}>
          <List component="nav" sx={{ px: 0, py: 0, '& .MuiListItemButton-root': { py: 1.5, px: 2, '& .MuiAvatar-root': avatarSX, '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' } } }}>
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
                    <Avatar sx={{ color: `${colors[i]}.main`, bgcolor: alpha(useTheme().palette[colors[i]].main, 0.15) }}>
                      {icons[i]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={<Typography variant="subtitle2">{s.name}</Typography>} secondary={`${new Date(s.timestamp).toLocaleString()}`} />
                </ListItem>
              );
            })}
          </List>
        </CardBox>
        <CardBox sx={{ mt: 2 }}>
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
                    <Avatar key={i} alt={`Support ${i}`} src={`https://ui-avatars.com/api/?name=Support+${i}&background=1e293b&color=3b82f6`} />
                  ))}
                </AvatarGroup>
              </Grid>
            </Grid>
            <Button size="small" variant="contained" sx={{ textTransform: 'capitalize' }}>Need Help?</Button>
          </Stack>
        </CardBox>
      </Grid>
    </Grid>
  );
}
