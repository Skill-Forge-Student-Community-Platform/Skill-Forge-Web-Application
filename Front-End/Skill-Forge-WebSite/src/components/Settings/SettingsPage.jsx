import React from 'react';
import { Routes, Route, Navigate, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { FaArrowLeft } from 'react-icons/fa';
import Sidebar from './pages/components/Sidebar';
import './SettingsPage.css';

// Import settings components
import AccountSettings from './pages/AccountSettings';
import ProfileSettings from './pages/ProfileSettings';
import NameSettings from './pages/NameSettings';
import EmailSettings from './pages/EmailSettings';
import PasswordSettings from './pages/PasswordSettings';
import LastLoginSettings from './pages/LastLoginSettings';
import SocialLinksSettings from './pages/SocialLinksSettings';
import NotificationSettings from './pages/NotificationSettings';
import DeleteAccountSettings from './pages/DeleteAccountSettings';

const SettingsPage = ({ isDarkMode, toggleTheme }) => {
  const { user, logout } = useAuthStore();
  const { roleType, userId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get the current settings section from the URL
  const currentPath = location.pathname.split('/').pop();

  // Map path to title
  const getTitleForPath = (path) => {
    const titles = {
      'profile': 'Profile Settings',
      'name': 'Change Name',
      'email': 'Change Email',
      'password': 'Change Password',
      'last-login': 'Last Login',
      'social': 'Social Links',
      'notifications': 'Email & Notifications',
      'delete-account': 'Delete Account',
      'account': 'Account Overview',
      '': 'Account Overview'
    };
    return titles[path] || 'Settings';
  };

  const title = getTitleForPath(currentPath);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Validate that user matches URL parameters
  if (user._id !== userId || user.role.toLowerCase() !== roleType.toLowerCase()) {
    const correctPath = `/${user.role.charAt(0).toUpperCase() + user.role.slice(1)}/${user._id}/settings`;
    return <Navigate to={correctPath} replace />;
  }

  // Handle back navigation
  const handleBackNavigation = () => {
    const correctRoleType = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || roleType;
    const baseUrl = `/${correctRoleType}/${user?._id || userId}/home`;

    // Check if we can go back in history, otherwise go to home
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(baseUrl, { replace: true });
    }
  };

  return (
    <div className="settings-page-container">
      <div className="settings-page-content">
        <header className="settings-header">
          <div className="settings-header-content">
            <button
              onClick={handleBackNavigation}
              className="back-button"
              aria-label="Go back"
            >
              <FaArrowLeft />
            </button>
            <h1 className="settings-title">Settings</h1>
          </div>
        </header>

        <div className="settings-container">
          <Sidebar />

          <main className="settings-content">
            <div className="settings-content-header">
              <h2 className="settings-content-title">{title}</h2>
            </div>

            <div className="settings-section">
              <Routes>
                <Route path="/" element={<AccountSettings />} />
                <Route path="account" element={<AccountSettings />} />
                <Route path="profile" element={<ProfileSettings />} />
                <Route path="name" element={<NameSettings />} />
                <Route path="email" element={<EmailSettings />} />
                <Route path="password" element={<PasswordSettings />} />
                <Route path="last-login" element={<LastLoginSettings />} />
                <Route path="social" element={<SocialLinksSettings />} />
                <Route path="notifications" element={<NotificationSettings />} />
                <Route path="delete-account" element={<DeleteAccountSettings />} />
                <Route path="*" element={<Navigate to="" replace />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
