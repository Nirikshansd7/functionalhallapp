import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { Building, DollarSign, FileText, ImageIcon, Check, MapPin, X } from 'lucide-react';
import LocationPicker from '../components/LocationPicker';
import ImageCropper from '../components/ImageCropper';

const CreateListing = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Function Hall');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [location, setLocation] = useState(null);
  const [fetching, setFetching] = useState(isEdit);

  // Cropping states
  const [selectedImage, setSelectedImage] = useState(null);
  const [pendingImages, setPendingImages] = useState([]);

  useEffect(() => {
    if (isEdit) {
      const fetchVenue = async () => {
        try {
          const { data } = await axios.get(`/api/venues/${id}`);
          setTitle(data.title);
          setDescription(data.description);
          setPrice(data.price);
          setCategory(data.category);
          setImages(data.images);
          setLocation(data.location);
        } catch (err) {
          setError('Failed to fetch venue details');
        } finally {
          setFetching(false);
        }
      };
      fetchVenue();
    }
  }, [id, isEdit]);

  if (!user) {
    return (
      <div className="app-container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Please log in to create a listing.</h2>
        <button className="glass-button primary" onClick={() => navigate('/login')} style={{ marginTop: '20px' }}>
          Go to Login
        </button>
      </div>
    );
  }

  if (fetching) return <div className="app-container" style={{ textAlign: 'center', padding: '50px' }}><h2>Loading venue details...</h2></div>;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const fileReaders = files.map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(fileReaders).then(results => {
        setPendingImages(results);
        setSelectedImage(results[0]);
      });
    }
    e.target.value = null;
  };

  const handleCropComplete = (croppedImageBase64) => {
    setImages(prev => [...prev, croppedImageBase64]);
    const nextPending = pendingImages.slice(1);
    setPendingImages(nextPending);
    setSelectedImage(nextPending.length > 0 ? nextPending[0] : null);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const method = isEdit ? 'put' : 'post';
      const url = isEdit ? `/api/venues/${id}` : '/api/venues';

      await axios[method](url, {
        title,
        description,
        price: Number(price),
        category,
        images,
        location
      }, config);

      setSuccess(isEdit ? 'Listing updated successfully!' : 'Listing created successfully!');
      setTimeout(() => navigate('/my-listings'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} listing`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container" style={{ paddingTop: '2rem' }}>
      <div className="glass-panel" style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', background: 'linear-gradient(to right, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          {isEdit ? 'Edit Your Listing' : 'Create a New Listing'}
        </h2>

        {error && <p style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '1rem' }}>{error}</p>}
        {success && <p style={{ color: '#4ade80', textAlign: 'center', marginBottom: '1rem' }}>{success}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="detail-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Building size={16} /> Venue Title
            </label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="glass-input"
              placeholder="e.g. Grand Royal Function Hall"
              required
            />
          </div>

          <div className="detail-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Building size={16} /> Category
            </label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="glass-input"
              style={{ backgroundColor: 'var(--bg-dark)' }}
              required
            >
              <option value="Function Hall">Function Hall</option>
              <option value="Banquet Hall">Banquet Hall</option>
              <option value="Convention Center">Convention Center</option>
              <option value="Outdoor Lawns">Outdoor Lawns</option>
            </select>
          </div>

          <div className="detail-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <DollarSign size={16} /> Price (per day/event)
            </label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              className="glass-input"
              placeholder="e.g. 50000"
              required
            />
          </div>

          <div className="detail-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <FileText size={16} /> Description
            </label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="glass-input"
              placeholder="Describe the venue, capacity, amenities..."
              rows={4}
              required
            />
          </div>

          <div className="detail-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <ImageIcon size={16} /> Photos (16:9 widescreen recommended)
            </label>
            <input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleImageUpload} 
              className="glass-input"
              style={{ padding: '0.5rem' }}
            />
            
            {images.length > 0 && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
                {images.map((img, index) => (
                  <div key={index} style={{ position: 'relative', width: '100px', height: '56px' }}>
                    <img src={img} alt={`Preview ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
                    <button 
                      type="button" 
                      onClick={() => removeImage(index)}
                      style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '12px' }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="detail-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
              <MapPin size={16} /> Location (Pin your venue on map)
            </label>
            <LocationPicker onLocationSelect={(loc) => setLocation(loc)} initialLocation={location} />
          </div>

          <button type="submit" className="glass-button primary" disabled={loading} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '1rem' }}>
            {loading ? (isEdit ? 'Updating...' : 'Creating...') : <><Check size={18} /> {isEdit ? 'Update Listing' : 'Create Listing'}</>}
          </button>
        </form>
      </div>

      {selectedImage && (
        <ImageCropper 
          imageSrc={selectedImage} 
          aspect={16/9} 
          cropShape="rect" 
          onCropComplete={handleCropComplete} 
          onCancel={() => {
            setSelectedImage(null);
            setPendingImages([]);
          }} 
        />
      )}
    </div>
  );
};

export default CreateListing;
