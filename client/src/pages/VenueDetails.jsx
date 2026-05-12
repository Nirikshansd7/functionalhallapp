import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Users, Calendar, ArrowLeft } from 'lucide-react';

const VenueDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapRef = useRef(null);
  
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({ date: '', guests: '' });

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const { data } = await axios.get(`/api/venues/${id}`);
        setVenue(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load venue details');
      } finally {
        setLoading(false);
      }
    };

    fetchVenue();
  }, [id]);

  useEffect(() => {
    // Initialize map if venue has location
    if (venue?.location?.lat && venue?.location?.lng && window.L && !mapRef.current) {
      const map = window.L.map('venue-map').setView([venue.location.lat, venue.location.lng], 15);
      mapRef.current = map;

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      window.L.marker([venue.location.lat, venue.location.lng]).addTo(map)
        .bindPopup(venue.title)
        .openPopup();
    }
  }, [venue]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    alert('Simulating Razorpay Checkout for ₹' + venue.price);
  };

  if (loading) return <div className="app-container" style={{ textAlign: 'center', padding: '50px' }}><h2>Loading venue...</h2></div>;
  if (error) return <div className="app-container" style={{ textAlign: 'center', padding: '50px' }}><h2 style={{ color: '#ff4d4d' }}>{error}</h2><button onClick={() => navigate('/')} className="glass-button">Go Home</button></div>;
  if (!venue) return null;

  return (
    <div className="app-container" style={{ padding: '2rem' }}>
      <button onClick={() => navigate(-1)} className="glass-button" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={18} /> Back
      </button>
      
      <div className="glass-panel" style={{ overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: '400px' }}>
          <img src={venue.images[0] || 'https://via.placeholder.com/1600x400'} alt={venue.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', bottom: '20px', left: '20px', background: 'rgba(0,0,0,0.6)', padding: '10px 20px', borderRadius: '30px', backdropFilter: 'blur(10px)', color: 'white' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>₹{venue.price.toLocaleString()}</span> / day
          </div>
        </div>
        
        <div style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{venue.title}</h1>
              <p style={{ color: 'var(--primary)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1.5rem' }}>
                Hosted by {venue.vendor?.name || 'Unknown Vendor'}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                <MapPin size={20} className="primary-text" />
                <span>{venue.location?.address || 'Location not specified'}</span>
              </div>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', fontSize: '1.1rem' }}>{venue.description}</p>
            </div>
            
            {venue.location?.lat && (
              <div>
                <h3 style={{ marginBottom: '1rem' }}>Location on Map</h3>
                <div id="venue-map" style={{ height: '300px', borderRadius: '15px', border: '1px solid var(--glass-border)', zIndex: 1 }}></div>
              </div>
            )}

            <div>
              <h3>Amenities</h3>
              <ul style={{ color: 'var(--text-muted)', marginLeft: '1.5rem', marginTop: '1rem', lineHeight: '2', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                <li>✨ Premium Sound System</li>
                <li>❄️ Full Air Conditioning</li>
                <li>🚗 Valet Parking</li>
                <li>🍽️ In-house Catering</li>
                <li>⚡ Power Backup</li>
                <li>🛡️ Security & CCTV</li>
              </ul>
            </div>
          </div>
          
          <div>
            <div className="glass-panel" style={{ padding: '2rem', position: 'sticky', top: '20px' }}>
              <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem', textAlign: 'center' }}>
                Book this Venue
              </h3>
              
              <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                    <Calendar size={16} /> Select Date
                  </label>
                  <input 
                    type="date" 
                    className="glass-input" 
                    required 
                    value={bookingData.date}
                    onChange={e => setBookingData({...bookingData, date: e.target.value})}
                  />
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
                    <Users size={16} /> Number of Guests
                  </label>
                  <input 
                    type="number" 
                    className="glass-input" 
                    required 
                    min="1"
                    placeholder="e.g. 500"
                    value={bookingData.guests}
                    onChange={e => setBookingData({...bookingData, guests: e.target.value})}
                  />
                </div>
                <button type="submit" className="glass-button primary" style={{ marginTop: '1rem', width: '100%', py: '15px', fontSize: '1.1rem' }}>
                  Proceed to Payment
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetails;
