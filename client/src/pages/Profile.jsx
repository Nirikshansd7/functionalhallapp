import React, { useState, useEffect } from 'react';
import { User, Phone, Camera, Save, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ImageCropper from '../components/ImageCropper';

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhoneNumber(user.phoneNumber || '');
      setProfilePicture(user.profilePicture || '');
    }
  }, [user]);

  if (!user) {
    return (
      <div className="app-container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Please log in to view your profile.</h2>
        <button className="glass-button primary" onClick={() => navigate('/login')} style={{ marginTop: '20px' }}>
          Go to Login
        </button>
      </div>
    );
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = null; // Reset input so same file can be selected again
  };

  const handleCropComplete = (croppedImageBase64) => {
    setProfilePicture(croppedImageBase64);
    setSelectedImage(null);
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.put(`/api/users/${user._id}`, {
        name,
        phoneNumber,
        profilePicture
      });
      const updatedUserData = { ...response.data, token: user.token || response.data.token };
      setUser(updatedUserData);
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (!confirmDelete) return;

    setLoading(true);
    try {
      await axios.delete(`/api/users/${user._id}`);
      setUser(null);
      localStorage.removeItem('user');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  return (
    <div className="profile-container">
      <div className="glass-panel profile-box">
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Your Profile</h2>
        
        {error && <p style={{ color: '#ff4d4d', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
        {success && <p style={{ color: '#4ade80', textAlign: 'center', marginBottom: '15px' }}>{success}</p>}

        <div className="profile-header">
          <div className="profile-picture-container">
            {profilePicture ? (
              <img src={profilePicture} alt="Profile" className="profile-picture" />
            ) : (
              <div className="profile-picture-placeholder">
                {name ? name.charAt(0).toUpperCase() : <User size={40} />}
              </div>
            )}
            
            {isEditing && (
              <>
                <label className="upload-btn" title="Change Photo">
                  <Camera size={18} />
                  <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                </label>
                {profilePicture && (
                  <button 
                    type="button" 
                    onClick={() => setProfilePicture('')} 
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      borderRadius: '50%',
                      width: '36px',
                      height: '36px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                      border: '2px solid var(--bg-dark)',
                      padding: 0
                    }}
                    title="Remove Photo"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <div className="profile-details">
          <div className="detail-group">
            <label><User size={16} /> Full Name</label>
            {isEditing ? (
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="glass-input"
              />
            ) : (
              <p className="detail-text">{user.name}</p>
            )}
          </div>

          <div className="detail-group">
            <label><Phone size={16} /> Phone Number</label>
            <p className="detail-text" style={{ opacity: isEditing ? 0.7 : 1 }}>{user.phoneNumber}</p>
          </div>
          
          <div className="detail-group">
            <label>Role</label>
            <p className="detail-text" style={{ textTransform: 'capitalize' }}>{user.role}</p>
          </div>
        </div>

        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="glass-button primary" onClick={handleSave} disabled={loading} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button className="glass-button secondary" onClick={() => setIsEditing(false)} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                <X size={18} /> Cancel
              </button>
            </>
          ) : (
            <button className="glass-button primary" onClick={() => setIsEditing(true)} style={{ width: '100%' }}>
              Edit Profile
            </button>
          )}
        </div>

        {!isEditing && (
          <div style={{ marginTop: '30px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <button 
              className="glass-button" 
              onClick={handleDeleteAccount}
              disabled={loading}
              style={{ width: '100%', backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#fca5a5', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
            >
              <Trash2 size={18} /> Delete Account
            </button>
          </div>
        )}
      </div>

      {selectedImage && (
        <ImageCropper 
          imageSrc={selectedImage} 
          onCropComplete={handleCropComplete} 
          onCancel={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};

export default Profile;
