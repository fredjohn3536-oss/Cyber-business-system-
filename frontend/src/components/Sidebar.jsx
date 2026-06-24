import React, { useContext, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Package, DollarSign, Settings } from 'lucide-react';
import { StoreContext } from '../context/StoreContext';
import './Sidebar.css';

const Sidebar = () => {
  const { businessLogo, setBusinessLogo } = useContext(StoreContext);
  const fileInputRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setBusinessLogo(ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header" onClick={() => fileInputRef.current.click()} style={{cursor: 'pointer'}} title="Upload Business Logo">
        <div className="logo-icon">
          <img src={businessLogo} alt="Logo" style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px'}} />
        </div>
        <h2>Seller Hub</h2>
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{display: 'none'}} 
          accept="image/*" 
          onChange={handleLogoUpload} 
        />
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Home size={20} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/products" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Package size={20} />
          <span>Products</span>
        </NavLink>
        <NavLink to="/sales" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <DollarSign size={20} />
          <span>Sales</span>
        </NavLink>
        
        <div className="nav-divider"></div>
        
        <NavLink to="/admin" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Settings size={20} />
          <span>Admin</span>
        </NavLink>
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-profile">
          <img src="https://ui-avatars.com/api/?name=Admin&background=1e293b&color=3b82f6" alt="Profile" />
          <div className="user-info">
            <strong>Admin User</strong>
            <span>admin@cyber.com</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
