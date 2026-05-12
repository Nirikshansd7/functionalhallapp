import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin } from 'lucide-react';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      });
    }
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d.toFixed(1);
  };

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const { data } = await axios.get('/api/venues');
        setVenues(data);
      } catch (err) {
        setError('Failed to fetch venues. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  // Sort venues by distance whenever userLocation or venues changes
  useEffect(() => {
    if (userLocation && venues.length > 0) {
      const sortedVenues = [...venues].sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.location?.lat, a.location?.lng) || Infinity;
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.location?.lat, b.location?.lng) || Infinity;
        return parseFloat(distA) - parseFloat(distB);
      });
      
      // Only update if the order actually changed to avoid infinite loops
      const currentIds = venues.map(v => v._id).join(',');
      const sortedIds = sortedVenues.map(v => v._id).join(',');
      if (currentIds !== sortedIds) {
        setVenues(sortedVenues);
      }
    }
  }, [userLocation, venues]);

  return (
    <div>
      {/* <header className="header">
        <h1>Function Hall Marketplace</h1>
        <p style={{ color: 'var(--text-muted)' }}>Find the perfect venue for your next event</p>
      </header> */}

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '40px' }}>Loading venues...</p>
      ) : error ? (
        <p style={{ color: '#ff4d4d', textAlign: 'center', marginTop: '40px' }}>{error}</p>
      ) : venues.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: '40px', color: 'var(--text-muted)' }}>No venues found.</p>
      ) : (
        <div className="venue-grid">
          {venues.map((venue) => (
            <div 
              key={venue._id} 
              className="glass-panel venue-card"
              onClick={() => navigate(`/venue/${venue._id}`)}
            >
              {userLocation && venue.location?.lat && venue.location?.lng && (
                <div className="distance-badge">
                  {calculateDistance(userLocation.lat, userLocation.lng, venue.location.lat, venue.location.lng)} km
                </div>
              )}
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
                  <button className="glass-button" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'rgba(255,255,255,0.1)' }}>View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
