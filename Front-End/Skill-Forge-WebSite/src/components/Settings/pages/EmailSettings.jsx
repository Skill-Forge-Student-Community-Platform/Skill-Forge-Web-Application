import { useState, useEffect } from 'react';
import SettingsLayout from './components/SettingsLayout';
import { FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import { settingsAPI, userAPI } from '../services/api';

const EmailSettings = () => {
  const [currentEmail, setCurrentEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user data when component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getCurrentUser();
        setCurrentEmail(response.data.email);
      } catch (err) {
        setError('Failed to load user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Call the API to update email
      await settingsAPI.updateEmail({ email: newEmail });
      setSuccess('Email updated successfully');
      setCurrentEmail(newEmail);
      setNewEmail('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update email');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsLayout title="Change Email">
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
          <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 transition-transform duration-300 ease-in-out transform hover:scale-110">
            <FaEnvelope className="h-5 w-5" />
          </div>
          <div className="ml-4">
            <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Current Email</h3>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {loading ? 'Loading...' : currentEmail}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="newEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              New Email Address
            </label>
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="Enter new email address"
              required
            />
          </div>


          <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-900 dark:bg-opacity-10 border border-blue-200 dark:border-blue-800 flex items-start hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
            <FaInfoCircle className="text-blue-500 dark:text-blue-400 h-5 w-5 mr-3 mt-0.5 animate-pulse" />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              After changing your email, you'll need to verify the new address before it becomes active.
            </p>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Email'}
            </button>
          </div>
        </form>
      </div>
    </SettingsLayout>
  );
};

export default EmailSettings;
