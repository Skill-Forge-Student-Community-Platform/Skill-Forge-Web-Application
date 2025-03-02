import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { initializeTheme, lightTheme, darkTheme, applyTheme } from './utils/Theme';
import Authentications from './components/Registration/Authentications.route';
import Home from './components/Home_page/Home';
import LoadingSpinner from '../src/components/Registration/shared/LoadingSpinner';
import { ProtectedRoute } from './components/Registration/AuthGuard';

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

        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Home isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
