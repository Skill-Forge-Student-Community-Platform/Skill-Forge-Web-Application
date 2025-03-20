import { useState, useEffect } from 'react';
import SettingsLayout from '../components/SettingsLayout';
import { userAPI, settingsAPI } from '../services/api';

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
      <div className="settings-section">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <div className="current-email-display">
          <h3 className="email-label">Current Email</h3>
          <p className="email-value">{loading ? 'Loading...' : currentEmail}</p>
        </div>

        <form onSubmit={handleSubmit} className="email-form">
          <div className="form-group">
            <label htmlFor="newEmail">New Email Address</label>
            <input
              type="email"
              id="newEmail"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="form-input"
              placeholder="Enter new email address"
              required
            />
          </div>

          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Email'}
          </button>
        </form>
      </div>
    </SettingsLayout>
  );
};

export default EmailSettings; 