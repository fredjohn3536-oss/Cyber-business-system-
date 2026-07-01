import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <nav className="landing-nav">
        <div className="landing-logo">⚡ Cyber Business System</div>
        <div className="landing-nav-buttons">
          <button className="landing-btn-ghost" onClick={() => navigate('/login')}>Sign In</button>
          <button className="landing-btn-primary" onClick={() => navigate('/login')}>Get Started</button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-content">
          <span className="hero-badge">🚀 Point of Sale & Inventory Management</span>
          <h1 className="hero-title">Run Your Business <span className="hero-highlight">Smarter</span></h1>
          <p className="hero-subtitle">
            A lightweight, intuitive POS and inventory management system designed for small businesses
            and independent sellers. Track sales, manage stock, and grow your revenue.
          </p>
          <div className="hero-actions">
            <button className="landing-btn-primary hero-cta" onClick={() => navigate('/login')}>
              Start Selling Now →
            </button>
            <button className="landing-btn-ghost hero-ghost" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-header">💰 Today's Sales</div>
            <div className="hero-card-body">
              <div className="hero-stat"><span className="hero-stat-value">TSh 1,247</span><span className="hero-stat-label">Revenue</span></div>
              <div className="hero-stat"><span className="hero-stat-value">TSh 342</span><span className="hero-stat-label">Profit</span></div>
              <div className="hero-stat"><span className="hero-stat-value">23</span><span className="hero-stat-label">Items Sold</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="landing-features">
        <h2 className="section-title">Everything You Need</h2>
        <p className="section-subtitle">Powerful features to manage your business efficiently</p>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>Inventory Management</h3>
            <p>Add products with categories, track stock levels, and get low-stock alerts before you run out.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💸</div>
            <h3>Point of Sale</h3>
            <p>Quick and easy sales processing with category filtering, search, and real-time profit calculation.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Dashboard Analytics</h3>
            <p>View total revenue, profit margins, sales history, and stock insights at a glance.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🧾</div>
            <h3>Transaction Receipts</h3>
            <p>Automatic receipt generation for every sale with item details, pricing, and profit breakdown.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Multi-User Support</h3>
            <p>Role-based access for owners, managers, and sellers with full audit trail logging.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Secure & Reliable</h3>
            <p>JWT authentication, encrypted passwords, and a robust database schema for data integrity.</p>
          </div>
        </div>
      </section>

      <section className="landing-cta">
        <h2>Ready to Transform Your Business?</h2>
        <p>Get started in minutes. No credit card required.</p>
        <button className="landing-btn-primary hero-cta" onClick={() => navigate('/login')}>
          Launch Cyber Business System →
        </button>
      </section>

      <footer className="landing-footer">
        <p>© 2026 Cyber Business System. Built for small businesses.</p>
      </footer>
    </div>
  );
};

export default Landing;
