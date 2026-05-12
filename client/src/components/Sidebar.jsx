import React from 'react';
import { Home, User as UserIcon, LogOut, X, PlusSquare, List } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}
      <div className={`sidebar glass-panel ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="icon-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        <div className="sidebar-content">
          <button 
            className={`sidebar-item ${isActive('/') ? 'active' : ''}`}
            onClick={() => handleNavigation('/')}
          >
            <Home size={20} />
            <span>Home</span>
          </button>
          
          {user && (
            <button 
              className={`sidebar-item ${isActive('/profile') ? 'active' : ''}`}
              onClick={() => handleNavigation('/profile')}
            >
              <UserIcon size={20} />
              <span>Profile</span>
            </button>
          )}

          {user && (
            <button 
              className={`sidebar-item ${isActive('/create-listing') ? 'active' : ''}`}
              onClick={() => handleNavigation('/create-listing')}
            >
              <PlusSquare size={20} />
              <span>Create Listing</span>
            </button>
          )}

          {user && (
            <button 
              className={`sidebar-item ${isActive('/my-listings') ? 'active' : ''}`}
              onClick={() => handleNavigation('/my-listings')}
            >
              <List size={20} />
              <span>My Listings</span>
            </button>
          )}

          {user && (
            <button className="sidebar-item" onClick={() => { onClose(); onLogout(); }}>
              <LogOut size={20} color="#ff4d4d" />
              <span style={{ color: '#ff4d4d' }}>Logout</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;
