import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import OtpLogin from './pages/OtpLogin';
import VenueDetails from './pages/VenueDetails';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import CreateListing from './pages/CreateListing';
import MyListings from './pages/MyListings';
import BottomNav from './components/BottomNav';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';

function AppContent() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const showNav = ['/', '/chat', '/profile', '/create-listing', '/my-listings'].includes(location.pathname) || location.pathname.startsWith('/edit-listing');

  return (
    <div className="app-container">
      {showNav && <TopNav user={user} onOpenSidebar={() => setIsSidebarOpen(true)} />}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        user={user} 
        onLogout={handleLogout} 
      />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={<OtpLogin setUser={setUser} />} />
        <Route path="/register" element={<OtpLogin setUser={setUser} />} />
        <Route path="/otp-login" element={<OtpLogin setUser={setUser} />} />
        <Route path="/venue/:id" element={<VenueDetails user={user} />} />
        <Route path="/chat" element={<Chat user={user} />} />
        <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
        <Route path="/create-listing" element={<CreateListing user={user} />} />
        <Route path="/edit-listing/:id" element={<CreateListing user={user} />} />
        <Route path="/my-listings" element={<MyListings user={user} />} />
      </Routes>
      
      {showNav && <BottomNav user={user} onLogout={handleLogout} />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
