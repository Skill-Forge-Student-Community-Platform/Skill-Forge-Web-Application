import { useState, useEffect } from 'react';
import SettingsLayout from './components/SettingsLayout';
import { FaClock, FaDesktop, FaMapMarkerAlt, FaExclamationTriangle } from 'react-icons/fa';
import { settingsAPI } from '../services/api';

const LastLoginSettings = () => {
  const [lastLogin, setLastLogin] = useState({
    timestamp: new Date().toISOString(),
    device: 'Unknown',
    location: 'Unknown'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLastLogin = async () => {
      try {
        setLoading(true);
        const response = await settingsAPI.getLastLogin();
        setLastLogin(response.data);
      } catch (err) {
        console.error('Error fetching last login data:', err);
        setError('Failed to load last login information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLastLogin();
  }, []);

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <SettingsLayout title="Last Login">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 dark:border-blue-400"></div>
            <span className="ml-3 text-gray-700 dark:text-gray-300">Loading last login information...</span>
          </div>
        </div>
      </SettingsLayout>
    );
  }

  return (
    <SettingsLayout title="Last Login">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-6 p-4 rounded-md bg-red-50 dark:bg-red-900 dark:bg-opacity-20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 mr-3 transition-transform duration-300 ease-in-out transform hover:scale-110">
              <FaClock className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Last Login Activity</h3>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-6 space-y-6 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 transition-transform duration-300 ease-in-out transform hover:scale-110">
                <FaClock className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Time</h4>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {formatDate(lastLogin.timestamp)}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 transition-transform duration-300 ease-in-out transform hover:scale-110">
                <FaDesktop className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Device</h4>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {lastLogin.device}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 transition-transform duration-300 ease-in-out transform hover:scale-110">
                <FaMapMarkerAlt className="h-5 w-5" />
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h4>
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {lastLogin.location}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-md bg-yellow-50 dark:bg-yellow-900 dark:bg-opacity-20 border border-yellow-200 dark:border-yellow-800 flex items-start hover:border-yellow-300 dark:hover:border-yellow-700 transition-all duration-300">
          <FaExclamationTriangle className="text-yellow-500 dark:text-yellow-400 h-5 w-5 mr-3 mt-0.5 animate-pulse" />
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            If you notice any suspicious activity, please change your password immediately
            and contact our support team.
          </p>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default LastLoginSettings;
