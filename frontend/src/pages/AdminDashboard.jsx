import React, { useState, useEffect, useContext, useMemo } from 'react';
import { StoreContext } from '../context/StoreContext';
import { adminAPI, stockAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';
import { LineChart, BarChart } from '@mui/x-charts';
import { chartsGridClasses } from '@mui/x-charts';

import RiseOutlined from '@ant-design/icons/RiseOutlined';
import FallOutlined from '@ant-design/icons/FallOutlined';
import DollarOutlined from '@ant-design/icons/DollarOutlined';
import TeamOutlined from '@ant-design/icons/TeamOutlined';
import ShoppingCartOutlined from '@ant-design/icons/ShoppingCartOutlined';
import WarningOutlined from '@ant-design/icons/WarningOutlined';
import BoxPlotOutlined from '@ant-design/icons/BoxPlotOutlined';
import ReloadOutlined from '@ant-design/icons/ReloadOutlined';

import StatCard from '../components/StatCard';
import MainCard from '../components/MainCard';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  const [adminStats, setAdminStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [movements, setMovements] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, auditRes, movesRes] = await Promise.allSettled([
        adminAPI.dashboard(),
        adminAPI.listUsers(),
        adminAPI.auditLogs(),
        stockAPI.movements({}),
      ]);
      if (statsRes.status === 'fulfilled') setAdminStats(statsRes.value.data);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data);
      if (auditRes.status === 'fulfilled') setAuditLogs(auditRes.value.data);
      if (movesRes.status === 'fulfilled') setMovements(movesRes.value.data);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    await adminAPI.toggleUserStatus(userId);
    loadData();
  };

  const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const sampleRevenue = adminStats?.total_revenue
    ? Array(12).fill(0).map(() => Math.round(adminStats.total_revenue / 12 * (0.5 + Math.random())))
    : [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  if (loading) {
    return (
      <Grid container rowSpacing={4.5} columnSpacing={2.75}>
        <Grid size={12}><Typography variant="h5">Admin Dashboard</Typography></Grid>
        <Grid size={12} sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}><Typography>Loading...</Typography></Grid>
      </Grid>
    );
  }

  const stats = adminStats || {};

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12} container alignItems="center" justifyContent="space-between">
        <Grid>
          <Typography variant="h5">Admin Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Full business oversight & user management</Typography>
        </Grid>
        <Grid>
          <Chip label={user?.role?.replace('_', ' ') || 'Admin'} color="primary" size="small" sx={{ textTransform: 'capitalize' }} />
          <IconButton size="small" onClick={loadData} sx={{ ml: 1 }}><ReloadOutlined /></IconButton>
        </Grid>
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Total Revenue" count={`TSh ${Number(stats.total_revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          percentage={stats.total_revenue > 0 ? 15.2 : 0} extra={`TSh ${Number(stats.total_profit || 0).toFixed(2)} total profit`} icon={<DollarOutlined />} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Active Users" count={String(stats.active_users || 0)} percentage={stats.total_users > 0 ? Math.round((stats.active_users / stats.total_users) * 100) : 0}
          extra={`${stats.total_users || 0} total team members`} icon={<TeamOutlined />} color="info" />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Total Orders" count={String(stats.total_sales || 0)} percentage={27.4} isLoss color="warning"
          extra={`${stats.products_sold || 0} items sold`} icon={<ShoppingCartOutlined />} />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatCard title="Low Stock" count={String(stats.low_stock_count || 0)}
          percentage={stats.low_stock_count > 0 ? 8.3 : 0} isLoss={stats.low_stock_count > 0} color={stats.low_stock_count > 0 ? 'error' : 'success'}
          extra={`${stats.active_categories || 0} active categories`} icon={<WarningOutlined />} />
      </Grid>

      <Grid size={{ xs: 12, md: 8 }}>
        <MainCard title="Revenue Overview">
          <Box sx={{ height: 350 }}>
            <BarChart
              height={300}
              grid={{ horizontal: true }}
              xAxis={[{ data: monthlyLabels, scaleType: 'band', tickLabelStyle: { fontSize: 10, fill: theme.palette.text.secondary } }]}
              yAxis={[{ disableLine: true, disableTicks: true }]}
              series={[{ data: sampleRevenue, label: 'Revenue', color: theme.palette.primary.main }]}
              slotProps={{ legend: { hidden: true }, bar: { rx: 4, ry: 4 } }}
              axisHighlight={{ x: 'none' }}
              margin={{ top: 10, left: 40, right: 10 }}
            />
          </Box>
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <MainCard title="Quick Stats">
          <List sx={{ p: 0 }}>
            <ListItem divider sx={{ px: 0 }}>
              <ListItemText primary="Active Products" primaryTypographyProps={{ variant: 'body2' }} />
              <Typography variant="subtitle2">{stats.total_products || 0}</Typography>
            </ListItem>
            <ListItem divider sx={{ px: 0 }}>
              <ListItemText primary="Active Categories" primaryTypographyProps={{ variant: 'body2' }} />
              <Typography variant="subtitle2">{stats.active_categories || 0}</Typography>
            </ListItem>
            <ListItem divider sx={{ px: 0 }}>
              <ListItemText primary="Total Sales" primaryTypographyProps={{ variant: 'body2' }} />
              <Typography variant="subtitle2">{stats.total_sales || 0}</Typography>
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemText primary="Products Sold" primaryTypographyProps={{ variant: 'body2' }} />
              <Typography variant="subtitle2">{stats.products_sold || 0}</Typography>
            </ListItem>
          </List>
        </MainCard>
      </Grid>

      <Grid size={12}>
        <MainCard title="Team Members" secondary={
          <Chip label={`${users.filter(u => u.status === 'active').length} active`} color="success" size="small" />
        }>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow><TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No users found</TableCell></TableRow>
                ) : users.map(u => (
                  <TableRow key={u.id} hover>
                    <TableCell><Typography variant="subtitle2">{u.full_name}</Typography></TableCell>
                    <TableCell>@{u.username}</TableCell>
                    <TableCell>{u.email || '-'}</TableCell>
                    <TableCell><Chip label={u.role.replace('_', ' ')} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} /></TableCell>
                    <TableCell>
                      <Chip label={u.status} size="small" color={u.status === 'active' ? 'success' : 'default'} />
                    </TableCell>
                    <TableCell align="center">
                      {user?.role === 'super_admin' && u.id !== user?.id && (
                        <Button size="small" variant="outlined" color={u.status === 'active' ? 'error' : 'success'}
                          onClick={() => handleToggleStatus(u.id)}>
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Recent Stock Movements">
          {movements.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>No stock movements recorded yet.</Box>
          ) : (
            <List sx={{ p: 0 }}>
              {movements.slice(0, 10).map(m => (
                <ListItem key={m.id} divider sx={{ px: 0 }}>
                  <ListItemText
                    primary={<Typography variant="body2"><strong>{m.product_name || `Product #${m.product_id}`}</strong> — {m.movement_type}</Typography>}
                    secondary={`Qty: ${m.quantity} | Stock: ${m.previous_stock} → ${m.new_stock} | ${new Date(m.created_at).toLocaleDateString()}`}
                    primaryTypographyProps={{ variant: 'body2' }}
                    secondaryTypographyProps={{ variant: 'caption' }}
                  />
                  <Chip label={m.movement_type} size="small" color={m.movement_type === 'sale' ? 'info' : m.movement_type === 'purchase' ? 'success' : 'warning'} />
                </ListItem>
              ))}
            </List>
          )}
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard title="Audit Logs">
          {auditLogs.length === 0 ? (
            <Box sx={{ py: 4, textAlign: 'center', color: 'text.secondary' }}>No audit logs available.</Box>
          ) : (
            <List sx={{ p: 0 }}>
              {auditLogs.slice(0, 10).map(log => (
                <ListItem key={log.id} divider sx={{ px: 0 }}>
                  <ListItemText
                    primary={<Typography variant="body2"><strong>{log.action}</strong> <Chip label={log.module} size="small" variant="outlined" sx={{ ml: 1 }} /></Typography>}
                    secondary={
                      <>
                        {log.description && <span>{log.description}<br /></span>}
                        <Typography variant="caption" color="text.secondary">
                          {log.ip_address && `IP: ${log.ip_address} | `}{new Date(log.created_at).toLocaleString()}
                        </Typography>
                      </>
                    }
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </MainCard>
      </Grid>
    </Grid>
  );
}
