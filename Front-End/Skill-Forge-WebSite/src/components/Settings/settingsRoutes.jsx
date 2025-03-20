import { Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import NameSettings from '../pages/NameSettings'
import EmailSettings from '../pages/EmailSettings'
import PasswordSettings from '../pages/PasswordSettings'
import LastLoginSettings from '../pages/LastLoginSettings'
import SocialLinksSettings from '../pages/SocialLinksSettings'
import NotificationSettings from '../pages/NotificationSettings'
import DeleteAccountSettings from '../pages/DeleteAccountSettings'
import Register from '../pages/Register'
import { authAPI } from '../services/api'

// Protected Route component that verifies authentication with the API
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        
        // Verify token with the API
        const response = await authAPI.verifyToken();
        
        if (response.data.valid) {
          setIsAuthenticated(true);
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Authentication error:', err);
        localStorage.removeItem('token');
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, []);
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/settings/name" />;
  }
  
  return children;
};

const SettingsRoutes = () => {
  return (
    <Routes>
      <Route path="/register" element={<Register />} />
      
      <Route path="/settings/name" element={
        <ProtectedRoute>
          <NameSettings />
        </ProtectedRoute>
      } />
      
      <Route path="/settings/email" element={
        <ProtectedRoute>
          <EmailSettings />
        </ProtectedRoute>
      } />
      
      <Route path="/settings/password" element={
        <ProtectedRoute>
          <PasswordSettings />
        </ProtectedRoute>
      } />
      
      <Route path="/settings/last-login" element={
        <ProtectedRoute>
          <LastLoginSettings />
        </ProtectedRoute>
      } />
      
      <Route path="/settings/social" element={
        <ProtectedRoute>
          <SocialLinksSettings />
        </ProtectedRoute>
      } />
      
      <Route path="/settings/notifications" element={
        <ProtectedRoute>
          <NotificationSettings />
        </ProtectedRoute>
      } />
      
      <Route path="/settings/delete-account" element={
        <ProtectedRoute>
          <DeleteAccountSettings />
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/settings/name" replace />} />
    </Routes>
  );
};

export default SettingsRoutes; 