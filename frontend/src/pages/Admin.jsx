import React, { useState, useEffect, useContext } from 'react';
import { StoreContext } from '../context/StoreContext';
import { dashboardAPI, stockAPI, adminAPI } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import './Admin.css';

const Admin = () => {
  const { products, sales } = useContext(StoreContext);
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [movements, setMovements] = useState([]);
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (userId) => {
    await adminAPI.toggleUserStatus(userId);
    loadData();
  };

  if (loading) {
    return <div className="page-container"><p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading dashboard...</p></div>;
  }

  const localStats = {
    totalRevenue: sales.reduce((s, sl) => s + sl.income, 0),
    totalProfit: sales.reduce((s, sl) => s + sl.profit, 0),
    productsSold: sales.reduce((s, sl) => s + sl.qty, 0),
    lowStockCount: products.filter(p => p.qty <= 3).length,
    totalProducts: products.length,
    totalSales: sales.length,
  };

  const displayStats = stats || localStats;

  return (
    <div className="animate-fade-in page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">🛡️ Admin Dashboard</h1>
          <p className="page-subtitle">Full business analytics, stock overview & user management</p>
        </div>
        <div className="admin-role-badge">
          {user?.role?.replace('_', ' ') || 'Admin'}
        </div>
      </div>

      <div className="admin-tabs">
        {['overview', 'stock', 'users', 'audit'].map(tab => (
          <button
            key={tab}
            className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'overview' && '📊'} {tab === 'stock' && '📦'}
            {tab === 'users' && '👥'} {tab === 'audit' && '📋'}
            {' '}{tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="stats-grid">
            <div className="stat-card glass-panel">
              <h3>Total Revenue</h3>
              <h2>TSh {(displayStats.total_revenue ?? displayStats.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}</h2>
              <span className="trend positive">Profit: TSh {(displayStats.total_profit ?? displayStats.totalProfit).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="stat-card glass-panel">
              <h3>Products</h3>
              <h2>{displayStats.total_products ?? displayStats.totalProducts}</h2>
              <span className="trend positive">Active in inventory</span>
            </div>
            <div className="stat-card glass-panel">
              <h3>Sales Completed</h3>
              <h2>{displayStats.total_sales ?? displayStats.totalSales}</h2>
              <span className="trend positive">{displayStats.products_sold ?? displayStats.productsSold} items sold</span>
            </div>
            <div className="stat-card glass-panel">
              <h3>Low Stock Items</h3>
              <h2>{displayStats.low_stock_count ?? displayStats.lowStockCount}</h2>
              {displayStats.low_stock_count > 0 || displayStats.lowStockCount > 0 ? (
                <span className="trend negative">Needs restocking</span>
              ) : (
                <span className="trend positive">Fully stocked</span>
              )}
            </div>
          </div>

          {stats && (
            <div className="glass-panel" style={{ padding: '20px', marginTop: '24px' }}>
              <h3 style={{ marginBottom: '12px' }}>📈 Quick Insights</h3>
              <div className="insights-grid">
                <div className="insight-item">
                  <span className="insight-label">Active Categories</span>
                  <span className="insight-value">{stats.active_categories}</span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Avg Revenue per Sale</span>
                  <span className="insight-value">
                    TSh {stats.total_sales > 0 ? (stats.total_revenue / stats.total_sales).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="insight-item">
                  <span className="insight-label">Profit Margin</span>
                  <span className="insight-value">
                    {stats.total_revenue > 0 ? ((stats.total_profit / stats.total_revenue) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'stock' && (
        <div className="stock-section">
          <h3 style={{ marginBottom: '16px' }}>📦 Recent Stock Movements</h3>
          {movements.length === 0 ? (
            <div className="empty-cat">No stock movements recorded yet.</div>
          ) : (
            <div className="movements-list">
              {movements.map(m => (
                <div key={m.id} className="movement-item glass-panel">
                  <div className="movement-info">
                    <strong>{m.product_name || `Product #${m.product_id}`}</strong>
                    <span className={`movement-type ${m.movement_type}`}>{m.movement_type}</span>
                  </div>
                  <div className="movement-details">
                    <span>Qty: {m.quantity}</span>
                    <span>Stock: {m.previous_stock} → {m.new_stock}</span>
                    <span className="movement-date">{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="users-section">
          <h3 style={{ marginBottom: '16px' }}>👥 Team Members</h3>
          {users.length === 0 ? (
            <div className="empty-cat">No users found.</div>
          ) : (
            <div className="users-table glass-panel">
              {users.map(u => (
                <div key={u.id} className="user-row">
                  <div className="user-row-info">
                    <strong>{u.full_name}</strong>
                    <span className="user-username">@{u.username}</span>
                    <span className="user-role">{u.role.replace('_', ' ')}</span>
                  </div>
                  <div className="user-row-actions">
                    <span className={`status-badge ${u.status}`}>{u.status}</span>
                    {user?.role === 'super_admin' && u.id !== user?.id && (
                      <button
                        className="btn-sm"
                        onClick={() => handleToggleStatus(u.id)}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="audit-section">
          <h3 style={{ marginBottom: '16px' }}>📋 Audit Logs</h3>
          {auditLogs.length === 0 ? (
            <div className="empty-cat">No audit logs available.</div>
          ) : (
            <div className="audit-list">
              {auditLogs.map(log => (
                <div key={log.id} className="audit-item glass-panel">
                  <div className="audit-header">
                    <span className="audit-action">{log.action}</span>
                    <span className="audit-module">{log.module}</span>
                  </div>
                  <div className="audit-desc">{log.description}</div>
                  <div className="audit-meta">
                    {log.user_id && <span>User #{log.user_id}</span>}
                    {log.ip_address && <span>IP: {log.ip_address}</span>}
                    <span>{new Date(log.created_at).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
