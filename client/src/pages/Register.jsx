import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'customer' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Mock register for now
      const mockUser = { id: 2, name: formData.name, email: formData.email, role: formData.role };
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="auth-container">
      <div className="glass-panel auth-box">
        <h2>Create Account</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Full Name" 
            className="glass-input" 
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            className="glass-input" 
            required
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="glass-input" 
            required
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
          />
          <select 
            className="glass-input"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            style={{ backgroundColor: 'var(--bg-dark)' }}
          >
            <option value="customer">I want to book a venue</option>
            <option value="vendor">I want to list a venue</option>
          </select>
          <button type="submit" className="glass-button primary">Register</button>
        </form>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link>
        </p>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '10px' }}>
          Or <Link to="/otp-login" style={{ color: 'var(--primary)' }}>Sign Up with OTP</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
