import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
axios.defaults.baseURL = apiBaseUrl;

// Add a request interceptor to include token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Basic verification on mount if we have a token
    if (token) {
      axios.get('/api/auth/me').catch(() => {
        handleLogout();
      });
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={!token ? <Auth setToken={setToken} /> : <Navigate to="/dashboard" />} 
        />
        <Route 
          path="/dashboard" 
          element={token ? <Dashboard handleLogout={handleLogout} /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
