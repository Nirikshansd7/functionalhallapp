import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app we would hit our API
      // const res = await axios.post('/api/auth/login', formData);
      // setUser(res.data);
      // localStorage.setItem('user', JSON.stringify(res.data));
      
      // Mock login for now
      const mockUser = { id: 1, name: 'John Doe', email: formData.email, role: 'customer' };
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
        <h2>Welcome Back</h2>
        <form className="auth-form" onSubmit={handleSubmit}>
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
          <button type="submit" className="glass-button primary">Login</button>
        </form>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Register</Link>
        </p>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '10px' }}>
          Or <Link to="/otp-login" style={{ color: 'var(--primary)' }}>Login with OTP</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
