import React from 'react';
import { Home, MessageSquare, PlusCircle, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const BottomNav = ({ user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-panel bottom-nav">
      <button 
        className={`nav-item ${isActive('/') ? 'active' : ''}`}
        onClick={() => navigate('/')}
      >
        <Home size={24} />
        <span>Explore</span>
      </button>

      {user ? (
        <>
          <button 
            className={`nav-item ${isActive('/chat') ? 'active' : ''}`}
            onClick={() => navigate('/chat')}
          >
            <MessageSquare size={24} />
            <span>Chat</span>
          </button>
          
          {user.role === 'vendor' && (
            <button className="nav-item">
              <PlusCircle size={24} />
              <span>Add Venue</span>
            </button>
          )}

          <button className="nav-item" onClick={onLogout}>
            <LogOut size={24} />
            <span>Logout</span>
          </button>
        </>
      ) : (
        <button 
          className={`nav-item ${isActive('/login') ? 'active' : ''}`}
          onClick={() => navigate('/login')}
        >
          <LogIn size={24} />
          <span>Login</span>
        </button>
      )}
    </nav>
  );
};

export default BottomNav;
