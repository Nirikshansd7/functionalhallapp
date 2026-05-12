import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search, Loader2 } from 'lucide-react';

const LocationPicker = ({ onLocationSelect, initialLocation }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [address, setAddress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    // Initialize map
    if (!window.L) return;

    const startPos = initialLocation?.lat && initialLocation?.lng 
      ? [initialLocation.lat, initialLocation.lng] 
      : [17.3850, 78.4867];

    const map = window.L.map('map-picker').setView(startPos, 13);
    mapRef.current = map;

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const marker = window.L.marker(startPos, { draggable: true }).addTo(map);
    markerRef.current = marker;

    if (initialLocation?.address) {
      setAddress(initialLocation.address);
      setSearchQuery(initialLocation.address);
    }

    marker.on('dragend', (e) => {
      const { lat, lng } = e.target.getLatLng();
      reverseGeocode(lat, lng);
    });

    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      reverseGeocode(lat, lng);
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  // Debounced search for suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length > 2 && !address.includes(searchQuery)) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await res.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      console.error('Fetch suggestions failed', err);
    } finally {
      setLoading(false);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      const addr = data.display_name;
      setAddress(addr);
      onLocationSelect({ address: addr, lat, lng });
    } catch (err) {
      console.error('Reverse geocoding failed', err);
    }
  };

  const handleSelectSuggestion = (sug) => {
    const lat = parseFloat(sug.lat);
    const lng = parseFloat(sug.lon);
    if (mapRef.current) mapRef.current.setView([lat, lng], 15);
    if (markerRef.current) markerRef.current.setLatLng([lat, lng]);
    setAddress(sug.display_name);
    setSearchQuery(sug.display_name);
    setShowSuggestions(false);
    onLocationSelect({ address: sug.display_name, lat, lng });
  };

  return (
    <div className="location-picker" style={{ position: 'relative' }}>
      <div className="search-box" style={{ position: 'relative', marginBottom: '10px' }}>
        <div style={{ position: 'relative' }}>
          <input 
            type="text" 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            className="glass-input" 
            placeholder="Type your venue location..." 
            style={{ width: '100%', paddingRight: '40px' }}
          />
          {loading && (
            <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
              <Loader2 size={18} className="spin" style={{ color: 'var(--primary)' }} />
            </div>
          )}
          
          {showSuggestions && suggestions.length > 0 && (
            <div className="glass-panel" style={{ 
              position: 'absolute', 
              top: '100%', 
              left: 0, 
              right: 0, 
              zIndex: 1000, 
              marginTop: '5px',
              padding: '5px',
              maxHeight: '200px',
              overflowY: 'auto',
              background: 'rgba(15, 23, 42, 0.95)',
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
            }}>
              {suggestions.map((sug, idx) => (
                <div 
                  key={idx} 
                  onClick={() => handleSelectSuggestion(sug)}
                  style={{ 
                    padding: '12px 15px', 
                    cursor: 'pointer', 
                    fontSize: '0.9rem',
                    borderBottom: idx === suggestions.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.background = 'rgba(139, 92, 246, 0.2)'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <MapPin size={14} style={{ marginRight: '8px', display: 'inline', verticalAlign: 'middle', color: 'var(--primary)' }} />
                  {sug.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div id="map-picker" style={{ height: '300px', borderRadius: '12px', border: '1px solid var(--glass-border)', zIndex: 1 }}></div>
      
      {address && (
        <div style={{ marginTop: '10px', fontSize: '0.9rem', color: 'var(--text-muted)', display: 'flex', gap: '5px' }}>
          <MapPin size={16} /> {address}
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
