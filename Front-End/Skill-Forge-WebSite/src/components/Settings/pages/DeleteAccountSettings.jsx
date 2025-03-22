import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsLayout from './components/SettingsLayout';
import { FaExclamationTriangle, FaTrash, FaLock } from 'react-icons/fa';
import { settingsAPI } from '../services/api';

const DeleteAccountSettings = () => {
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (confirmText !== 'DELETE') {
      setError('Please type DELETE to confirm account deletion');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Call the API to delete the account
      await settingsAPI.deleteAccount({ password });

      // Clear user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Show success step
      setLoading(false);
      setStep(3);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to delete account. Please try again.');
      console.error('Error deleting account:', err);
    }
  };

  const handleReturnHome = () => {
    navigate('/login');
  };

  return (
    <SettingsLayout title="Delete Account">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-200 dark:border-red-800 rounded-lg p-5">
              <div className="flex items-start">
                <FaExclamationTriangle className="h-6 w-6 text-red-600 dark:text-red-400 mr-4 mt-1 animate-pulse" />
                <div>
                  <h4 className="text-lg font-semibold text-red-800 dark:text-red-400">This action cannot be undone</h4>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    Deleting your account will permanently remove all your data, including:
                  </p>
                </div>
              </div>

              <ul className="mt-4 ml-12 list-disc text-gray-700 dark:text-gray-300 space-y-2">
                <li>All your personal information</li>
                <li>Your activity history and preferences</li>
                <li>All files and documents you've uploaded</li>
                <li>Access to any premium features you've purchased</li>
              </ul>

              <p className="mt-4 text-gray-700 dark:text-gray-300 ml-12">
                Make sure you have backed up any important data before proceeding.
                Once your account is deleted, we cannot recover any information.
              </p>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                onClick={() => window.history.back()}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
                onClick={handleNextStep}
              >
                Continue to Verification
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 mr-3 transition-transform duration-300 ease-in-out transform hover:scale-110">
                <FaLock className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Verify Your Identity</h3>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-6">
              For security purposes, please enter your password and confirm your decision
              by typing "DELETE" in the confirmation field.
            </p>

            <form onSubmit={handleDeleteAccount} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="Enter your current password"
                  required
                />
              </div>

              <div>
                <label htmlFor="confirmText" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Type "DELETE" to confirm
                </label>
                <input
                  type="text"
                  id="confirmText"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="DELETE"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-md bg-red-50 dark:bg-red-900 dark:bg-opacity-20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
                  onClick={handlePreviousStep}
                >
                  Go Back
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Permanently Delete Account'}
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 3 && (
          <div className="text-center py-8">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 mb-6 animate-bounce">
              <FaTrash className="h-8 w-8" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Account Deletion Successful</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-2 max-w-md mx-auto">
              Your account has been permanently deleted. All your data has been removed
              from our systems.
            </p>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
              Thank you for using our service. We're sorry to see you go.
            </p>
            <button
              type="button"
              className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              onClick={handleReturnHome}
            >
              Return to Login
            </button>
          </div>
        )}
      </div>
    </SettingsLayout>
  );
};

export default DeleteAccountSettings;
