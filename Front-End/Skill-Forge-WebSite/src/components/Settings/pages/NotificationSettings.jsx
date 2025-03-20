import { useState, useEffect } from 'react';
import SettingsLayout from '../components/SettingsLayout';
import { FaBell } from 'react-icons/fa';
import { settingsAPI, userAPI } from '../services/api';

const NotificationSettings = () => {
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    securityAlerts: true,
    newsAndFeatures: false,
    marketingEmails: false
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user's notification settings when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setInitialLoading(true);
        const response = await userAPI.getCurrentUser();
        if (response.data && response.data.notificationSettings) {
          setNotifications(response.data.notificationSettings);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to load your notification settings. Please try again later.');
      } finally {
        setInitialLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleToggle = (setting) => {
    setNotifications(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Call API to update notification settings
      await settingsAPI.updateNotifications({ notificationSettings: notifications });
      setSuccess('Notification preferences updated successfully!');
    } catch (err) {
      console.error('Error updating notification settings:', err);
      setError(err.response?.data?.message || 'Failed to update notification settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const notificationOptions = [
    {
      id: 'emailUpdates',
      label: 'Email Updates',
      description: 'Receive important updates about your account via email'
    },
    {
      id: 'securityAlerts',
      label: 'Security Alerts',
      description: 'Get notified about important security-related changes to your account'
    },
    {
      id: 'newsAndFeatures',
      label: 'News and Features',
      description: 'Stay updated with new features and improvements'
    },
    {
      id: 'marketingEmails',
      label: 'Marketing Emails',
      description: 'Receive promotional offers and marketing communications'
    }
  ];

  if (initialLoading) {
    return (
      <SettingsLayout title="Email & Notifications">
        <div className="settings-section">
          <div className="loading-screen">Loading your notification preferences...</div>
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout title="Email & Notifications">
      <div className="settings-section">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="notification-header">
          <FaBell className="notification-icon" />
          <p className="notification-description">
            Manage your email preferences and notification settings. You can customize what 
            types of emails you'd like to receive.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="notification-form">
          {notificationOptions.map((option) => (
            <div key={option.id} className="notification-option">
              <div className="notification-option-content">
                <label htmlFor={option.id} className="notification-label">
                  {option.label}
                </label>
                <p className="notification-description">
                  {option.description}
                </p>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  id={option.id}
                  checked={notifications[option.id]}
                  onChange={() => handleToggle(option.id)}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          ))}

          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Preferences'}
          </button>
        </form>
      </div>
    </SettingsLayout>
  );
};

export default NotificationSettings; 