import { useState } from 'react';
import SettingsLayout from '../components/SettingsLayout';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { settingsAPI } from '../services/api';

const PasswordSettings = () => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset messages
    setError('');
    setSuccess('');
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match!');
      return;
    }
    
    // Validate password length
    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the API to update password
      const response = await settingsAPI.updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      // Show success message
      setSuccess(response.data.message || 'Password updated successfully');
      
      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsLayout title="Change Password">
      <div className="settings-section">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handleChange}
                className="form-input pr-10"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handleChange}
                className="form-input pr-10"
                placeholder="Enter new password"
                required
                minLength="6"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handleChange}
                className="form-input pr-10"
                placeholder="Confirm new password"
                required
                minLength="6"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="save-button"
            disabled={loading}
          >
            {loading ? 'Updating Password...' : 'Save Password'}
          </button>
        </form>
      </div>
    </SettingsLayout>
  );
};

export default PasswordSettings; 