import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { initializeTheme, lightTheme, darkTheme, applyTheme } from './utils/Theme';
import Authentications from './components/Registration/Authentications.route';
import ProfileSetupRoute from './components/Profile/ProfileSetup.route';
import LoadingSpinner from '../src/components/Registration/shared/LoadingSpinner';
import { ProtectedRoute } from './components/Registration/AuthGuard';
import MainLayout from './components/Main_APP_Layout/MainLayout';
import HomeRedirect from './components/Main_APP_Layout/HomeRedirect';
import SettingsPage from './components/Settings/SettingsPage';


import { useAuthStore } from './store/authStore';
import { Toaster } from 'react-hot-toast';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    initializeTheme();
    checkAuth(); // Check authentication status on app load
  }, [checkAuth]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
    applyTheme(!isDarkMode ? darkTheme : lightTheme);
  };

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="App">
      <Routes>
        {/* Redirect reset password routes to auth module */}
        <Route path="/reset-password/:token" element={<Navigate to={(location) => {
          const token = location.pathname.split('/').pop();
          return `/auth/reset-password/${token}`;
        }} replace />} />

        {/* Authentication routes */}
        <Route path="/auth/*" element={<Authentications />} />

        {/* Profile setup routes - protected */}
        <Route path="/profile/setup/*" element={
          <ProtectedRoute>
            <ProfileSetupRoute />
          </ProtectedRoute>
        } />

        {/* Student routes - using MainLayout */}
        <Route path="/Student/:userId/*" element={
          <ProtectedRoute>
            <MainLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme} roleType="student" />
          </ProtectedRoute>
        } />

        <Route path="/Student/:userId/settings/*" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />

        {/* Organizer routes - using MainLayout */}
        <Route path="/Organizer/:userId/*" element={
          <ProtectedRoute>
            <MainLayout isDarkMode={isDarkMode} toggleTheme={toggleTheme} roleType="organizer" />
          </ProtectedRoute>
        } />


        <Route path="/Organizer/:userId/settings/*" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />


        {/* Root redirect */}
        <Route path="/" element={
          <ProtectedRoute>
            <HomeRedirect />
          </ProtectedRoute>
        } />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
