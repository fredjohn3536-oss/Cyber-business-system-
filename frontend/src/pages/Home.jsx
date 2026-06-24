import React from 'react';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page animate-fade-in page-container">
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening with your store today.</p>
        </div>
        <button className="btn-primary" onClick={() => window.location.href='/sales'}>+ New Sale</button>
      </header>
      
      <div className="stats-grid" style={{ marginBottom: '40px' }}>
        <div className="stat-card glass-panel">
          <h3>Total Revenue</h3>
          <h2>$24,500.00</h2>
          <span className="trend positive">+14% vs last week</span>
        </div>
        <div className="stat-card glass-panel">
          <h3>Products Sold</h3>
          <h2>1,245</h2>
          <span className="trend positive">+5% vs last week</span>
        </div>
        <div className="stat-card glass-panel">
          <h3>Low Stock Items</h3>
          <h2>8</h2>
          <span className="trend negative">Needs attention</span>
        </div>
      </div>

      <h2 style={{ fontSize: '1.6rem', fontWeight: 600, marginBottom: '16px' }}>🔥 Hot Weekly Ads</h2>
      
      <div className="glass-panel" style={{ padding: '18px', marginBottom: '14px', borderLeft: '4px solid #3b82f6' }}>
        🚀 50% OFF - Latest Smartphones & Accessories
      </div>
      <div className="glass-panel" style={{ padding: '18px', marginBottom: '14px', borderLeft: '4px solid #3b82f6' }}>
        🛋️ Furniture Blowout: Up to 40% OFF
      </div>
      <div className="glass-panel" style={{ padding: '18px', marginBottom: '14px', borderLeft: '4px solid #3b82f6' }}>
        💻 Laptop Fest: Discounts + Free Mouse
      </div>
      
      <div className="glass-panel" style={{ padding: '18px', marginTop: '24px', background: 'linear-gradient(95deg, rgba(15,23,42,0.8), rgba(30,41,59,0.8))', textAlign: 'center' }}>
        <span style={{ marginRight: '12px' }}>🔐 Full business analytics & stock overview → </span>
        <button className="btn-primary" onClick={() => window.open('/admin', '_blank')}>📊 Launch Admin Dashboard</button>
      </div>
    </div>
  );
};

export default Home;
