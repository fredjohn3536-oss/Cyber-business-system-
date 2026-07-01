import { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { dashboardAPI, stockAPI, adminAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import MainCard from '../components/MainCard';
import AnalyticEcommerce from '../components/cards/statistics/AnalyticEcommerce';

export default function Admin() {
  const { products, sales } = useContext(StoreContext);
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [movements, setMovements] = useState([]);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsRes, movesRes, usersRes, auditRes] = await Promise.allSettled([
        dashboardAPI.stats(),
        stockAPI.movements({}),
        adminAPI.listUsers(),
        adminAPI.auditLogs(),
      ]);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
      if (movesRes.status === 'fulfilled') setMovements(movesRes.value.data);
      if (usersRes.status === 'fulfilled') setUsers(usersRes.value.data);
      if (auditRes.status === 'fulfilled') setAuditLogs(auditRes.value.data);
    } finally { setLoading(false); }
  };

  const handleToggleStatus = async (userId) => {
    await adminAPI.toggleUserStatus(userId);
    loadData();
  };

  const localStats = {
    totalRevenue: sales.reduce((s, sl) => s + sl.income, 0),
    totalProfit: sales.reduce((s, sl) => s + sl.profit, 0),
    productsSold: sales.reduce((s, sl) => s + sl.qty, 0),
    lowStockCount: products.filter(p => p.qty <= 3).length,
    totalProducts: products.length,
    totalSales: sales.length,
  };

  const displayStats = stats || localStats;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={2.75}>
      <Grid size={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid>
            <Typography variant="h5">Admin Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">Full business analytics, stock overview & user management</Typography>
          </Grid>
          <Grid>
            <Chip label={user?.role?.replace('_', ' ') || 'Admin'} color="primary" variant="outlined" />
          </Grid>
        </Grid>
      </Grid>

      <Grid size={12}>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} sx={{ mb: 2 }}>
          <Tab label="Overview" value="overview" />
          <Tab label="Stock" value="stock" />
          <Tab label="Users" value="users" />
          <Tab label="Audit" value="audit" />
        </Tabs>
      </Grid>

      {activeTab === 'overview' && (
        <>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnalyticEcommerce title="Total Revenue" count={String((displayStats.total_revenue ?? displayStats.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 }))} extra={`Profit: TSh ${(displayStats.total_profit ?? displayStats.totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}`} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnalyticEcommerce title="Products" count={String(displayStats.total_products ?? displayStats.totalProducts)} extra="Active in inventory" />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnalyticEcommerce title="Sales Completed" count={String(displayStats.total_sales ?? displayStats.totalSales)} extra={`${displayStats.products_sold ?? displayStats.productsSold} items sold`} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <AnalyticEcommerce title="Low Stock Items" count={String(displayStats.low_stock_count ?? displayStats.lowStockCount)} extra={(displayStats.low_stock_count ?? displayStats.lowStockCount) > 0 ? 'Needs restocking' : 'Fully stocked'} isLoss={(displayStats.low_stock_count ?? displayStats.lowStockCount) > 0} />
          </Grid>
          {stats && (
            <Grid size={12}>
              <MainCard>
                <Typography variant="h6" sx={{ mb: 2 }}>Quick Insights</Typography>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="body2" color="text.secondary">Active Categories</Typography>
                    <Typography variant="h4">{stats.active_categories}</Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="body2" color="text.secondary">Avg Revenue per Sale</Typography>
                    <Typography variant="h4">TSh {stats.total_sales > 0 ? (stats.total_revenue / stats.total_sales).toFixed(2) : '0.00'}</Typography>
                  </Grid>
                  <Grid size={{ xs: 4 }}>
                    <Typography variant="body2" color="text.secondary">Profit Margin</Typography>
                    <Typography variant="h4">{stats.total_revenue > 0 ? ((stats.total_profit / stats.total_revenue) * 100).toFixed(1) : '0'}%</Typography>
                  </Grid>
                </Grid>
              </MainCard>
            </Grid>
          )}
        </>
      )}

      {activeTab === 'stock' && (
        <Grid size={12}>
          <MainCard>
            <Typography variant="h6" sx={{ mb: 2 }}>Recent Stock Movements</Typography>
            {movements.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No stock movements recorded yet.</Typography>
            ) : (
              movements.map(m => (
                <Stack key={m.id} direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Stack>
                    <Typography variant="body1">{m.product_name || `Product #${m.product_id}`}</Typography>
                    <Stack direction="row" sx={{ gap: 2 }}>
                      <Typography variant="body2" color="text.secondary">Qty: {m.quantity}</Typography>
                      <Typography variant="body2" color="text.secondary">Stock: {m.previous_stock} → {m.new_stock}</Typography>
                      <Typography variant="body2" color="text.secondary">{new Date(m.created_at).toLocaleDateString()}</Typography>
                    </Stack>
                  </Stack>
                  <Chip label={m.movement_type} color={m.movement_type === 'add' ? 'success' : m.movement_type === 'remove' ? 'error' : 'warning'} size="small" />
                </Stack>
              ))
            )}
          </MainCard>
        </Grid>
      )}

      {activeTab === 'users' && (
        <Grid size={12}>
          <MainCard>
            <Typography variant="h6" sx={{ mb: 2 }}>Team Members</Typography>
            {users.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No users found.</Typography>
            ) : (
              users.map(u => (
                <Stack key={u.id} direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', py: 1.5, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Stack>
                    <Typography variant="body1">{u.full_name}</Typography>
                    <Stack direction="row" sx={{ gap: 1 }}>
                      <Typography variant="body2" color="text.secondary">@{u.username}</Typography>
                      <Chip label={u.role.replace('_', ' ')} size="small" variant="outlined" />
                    </Stack>
                  </Stack>
                  <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                    <Chip label={u.status} color={u.status === 'active' ? 'success' : 'error'} size="small" />
                    {user?.role === 'super_admin' && u.id !== user?.id && (
                      <Button size="small" variant="outlined" color={u.status === 'active' ? 'error' : 'success'} onClick={() => handleToggleStatus(u.id)}>
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </Button>
                    )}
                  </Stack>
                </Stack>
              ))
            )}
          </MainCard>
        </Grid>
      )}

      {activeTab === 'audit' && (
        <Grid size={12}>
          <MainCard>
            <Typography variant="h6" sx={{ mb: 2 }}>Audit Logs</Typography>
            {auditLogs.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No audit logs available.</Typography>
            ) : (
              auditLogs.map(log => (
                <MainCard key={log.id} sx={{ mb: 1.5 }}>
                  <Stack direction="row" sx={{ gap: 1, mb: 0.5 }}>
                    <Chip label={log.action} color="primary" size="small" />
                    <Chip label={log.module} variant="outlined" size="small" />
                  </Stack>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>{log.description}</Typography>
                  <Stack direction="row" sx={{ gap: 2 }}>
                    {log.user_id && <Typography variant="caption" color="text.secondary">User #{log.user_id}</Typography>}
                    {log.ip_address && <Typography variant="caption" color="text.secondary">IP: {log.ip_address}</Typography>}
                    <Typography variant="caption" color="text.secondary">{new Date(log.created_at).toLocaleString()}</Typography>
                  </Stack>
                </MainCard>
              ))
            )}
          </MainCard>
        </Grid>
      )}
    </Grid>
  );
}
