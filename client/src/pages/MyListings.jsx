import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building, PlusCircle, MapPin } from 'lucide-react';

const MyListings = ({ user }) => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMyVenues = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get('/api/venues/my-venues', config);
        setVenues(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch listings');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMyVenues();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="app-container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Please log in to view your listings.</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>My Listings</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage your function halls and venues</p>
      </header>

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading your listings...</p>
      ) : error ? (
        <p style={{ color: '#ff4d4d', textAlign: 'center', marginTop: '20px' }}>{error}</p>
      ) : venues.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>You haven't created any listings yet.</p>
          <button 
            className="glass-button primary" 
            onClick={() => navigate('/create-listing')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
          >
            <PlusCircle size={20} /> Create Your First Listing
          </button>
        </div>
      ) : (
        <div className="venue-grid">
          {venues.map((venue) => (
            <div 
              key={venue._id} 
              className="glass-panel venue-card"
              onClick={() => navigate(`/venue/${venue._id}`)}
            >
              <img src={venue.images[0] || 'https://via.placeholder.com/400x300'} alt={venue.title} className="venue-image" />
              <div className="venue-content">
                <h3 className="venue-title">{venue.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#cbd5e1', fontSize: '0.85rem', marginBottom: '5px' }}>
                  <MapPin size={14} style={{ color: 'var(--primary)' }} />
                  <span className="text-truncate">
                    {venue.location?.address ? venue.location.address.split(',').slice(0, 2).join(',') : 'Location N/A'}
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{venue.category}</p>
                <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="venue-price">₹{venue.price.toLocaleString()}</span>
                  <button 
                    className="glass-button" 
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/edit-listing/${venue._id}`);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
