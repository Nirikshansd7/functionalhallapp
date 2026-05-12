import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const OtpLogin = ({ setUser }) => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('customer');
  const [step, setStep] = useState(1); // 1: Enter Phone, 2: Enter OTP
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/otp/send', { phoneNumber });
      if (response.status === 200) {
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/otp/verify', { 
        phoneNumber, 
        otp,
        name: isRegistering ? name : undefined,
        role: isRegistering ? role : undefined
      });
      if (response.status === 200) {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-box">
        <h2>{step === 1 ? (isRegistering ? 'Sign Up with OTP' : 'Login with OTP') : 'Verify OTP'}</h2>
        
        {error && <p className="error-text" style={{ color: '#ff4d4d', textAlign: 'center' }}>{error}</p>}

        {step === 1 ? (
          <form className="auth-form" onSubmit={handleSendOtp}>
            {isRegistering && (
              <>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="glass-input" 
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <select 
                  className="glass-input"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  style={{ backgroundColor: 'var(--bg-dark)' }}
                >
                  <option value="customer">I want to book a venue</option>
                  <option value="vendor">I want to list a venue</option>
                </select>
              </>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
              <span style={{ 
                color: 'var(--text-color)', 
                backgroundColor: 'rgba(255, 255, 255, 0.05)', 
                padding: '12px 15px', 
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                fontWeight: 'bold'
              }}>+91</span>
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className="glass-input" 
                style={{ flex: 1, marginBottom: 0 }}
                required
                maxLength="10"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            <button type="submit" className="glass-button primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
            
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
              <button 
                type="button" 
                className="text-link" 
                onClick={() => setIsRegistering(!isRegistering)}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer' }}
              >
                {isRegistering ? 'Already have an account? Login' : 'Need an account? Sign Up'}
              </button>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleVerifyOtp}>
            <p style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
              OTP sent to {phoneNumber}
            </p>
            <input 
              type="text" 
              placeholder="Enter 6-digit OTP" 
              className="glass-input" 
              required
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="submit" className="glass-button primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button 
              type="button" 
              className="glass-button secondary" 
              onClick={() => setStep(1)}
              style={{ marginTop: '10px' }}
            >
              Back
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default OtpLogin;
