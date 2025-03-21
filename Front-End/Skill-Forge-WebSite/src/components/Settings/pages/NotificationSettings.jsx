import { useState, useEffect } from 'react';
import SettingsLayout from './components/SettingsLayout';
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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
            <span className="ml-3 text-gray-700 dark:text-gray-300">Loading your notification preferences...</span>
          </div>
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout title="Email & Notifications">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-900 dark:bg-opacity-20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-md bg-green-50 dark:bg-green-900 dark:bg-opacity-20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
            {success}
          </div>
        )}

        <div className="flex items-start mb-8">
          <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 mt-1 mr-4 transition-transform duration-300 ease-in-out transform hover:scale-110">
            <FaBell className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Email Notifications</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Customize what types of emails you'd like to receive. You can change these settings at any time.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notificationOptions.map((option) => (
              <div key={option.id} className="py-4 flex items-center justify-between transition-all duration-300 hover:bg-blue-50 dark:hover:bg-blue-900 dark:hover:bg-opacity-10 hover:rounded-md px-2">
                <div className="pr-4">
                  <label htmlFor={option.id} className="font-medium text-gray-800 dark:text-white cursor-pointer">
                    {option.label}
                  </label>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {option.description}
                  </p>
                </div>
                <label className="relative inline-flex items-center">
                  <input
                    type="checkbox"
                    id={option.id}
                    checked={notifications[option.id]}
                    onChange={() => handleToggle(option.id)}
                    className="sr-only"
                  />
                  <div className={`w-11 h-6 bg-gray-200 rounded-full peer transition-colors duration-300 ease-in-out
                    ${notifications[option.id] ? 'bg-blue-600 dark:bg-blue-500' : 'dark:bg-gray-600'}`}>
                    <div className={`absolute w-5 h-5 bg-white rounded-full shadow top-0.5 left-0.5 transition-transform duration-300 ease-in-out
                      ${notifications[option.id] ? 'transform translate-x-5' : ''}`}>
                    </div>
                  </div>
                </label>
              </div>
            ))}
          </div>

          <div className="pt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </form>
      </div>
    </SettingsLayout>
  );
};

export default NotificationSettings;
