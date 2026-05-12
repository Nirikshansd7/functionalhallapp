import React, { useState, useEffect } from 'react';
import { User, LogIn, Menu, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TopNav = ({ user, onOpenSidebar }) => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('Detecting...');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          // Prioritize neighbourhood or suburb for more specific location
          const locName = data.address.neighbourhood || data.address.suburb || data.address.city || data.address.town || data.address.village || 'Location Found';
          setLocation(locName);
        } catch (err) {
          setLocation('Location Error');
        }
      }, () => {
        setLocation('Location Denied');
      });
    } else {
      setLocation('Not Supported');
    }
  }, []);

  return (
    <nav className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button className="icon-btn" onClick={onOpenSidebar} style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', display: 'flex' }}>
          <Menu size={28} />
        </button>
        <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
          <h2 style={{ fontSize: '1.5rem', background: 'linear-gradient(to right, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>FHM</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '-2px' }}>
            <MapPin size={10} className="primary-text" />
            <span>{location}</span>
          </div>
        </div>
      </div>
      <div className="profile-section">
        {user ? (
          <div className="profile-avatar glass-panel" title={user.name || 'User Profile'} onClick={() => navigate('/profile')}>
            {user.profilePicture ? (
              <img src={user.profilePicture} alt="Profile" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              user.name ? user.name.charAt(0).toUpperCase() : <User size={20} />
            )}
          </div>
        ) : (
          <button className="glass-button secondary-btn" onClick={() => navigate('/login')}>
            <LogIn size={18} />
            <span style={{ marginLeft: '8px' }}>Login</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default TopNav;
