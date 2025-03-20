import { useState } from 'react';
import SettingsLayout from '../components/SettingsLayout';
import { FaExclamationTriangle } from 'react-icons/fa';

const AccountSettings = () => {
  const [email, setEmail] = useState('john.doe@company.com');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <SettingsLayout title="Account settings">
      <div className="settings-section">
        {/* Email Section */}
        <div className="settings-subsection">
          <h3 className="settings-subsection-title">Email Address</h3>
          <div className="email-display">
            <div className="email-info">
              <p className="email-label">Your email address is</p>
              <p className="email-value">{email}</p>
            </div>
            <button className="change-button">Change</button>
          </div>
        </div>

        {/* Password Section */}
        <div className="settings-subsection">
          <h3 className="settings-subsection-title">Password</h3>
          <form className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••••"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="••••••••••"
              />
            </div>

            <div className="password-recovery">
              <p>Can't remember your current password?</p>
              <button type="button" className="recovery-link">
                Recover Account
              </button>
            </div>

            <button type="submit" className="save-button">
              Save Password
            </button>
          </form>
        </div>

        {/* Delete Account Section */}
        <div className="settings-subsection">
          <h3 className="settings-subsection-title">Delete Account</h3>
          <div className="warning-box">
            <div className="warning-header">
              <FaExclamationTriangle className="warning-icon" />
              <div>
                <h4 className="warning-title">Proceed with caution</h4>
                <p className="warning-text">
                  Make sure you have taken backup of your account in case you ever need to get access to your data. 
                  We will completely wipe your data. There is no way to access your account after this action.
                </p>
              </div>
            </div>
          </div>
          <button className="delete-button">
            Continue with deletion
          </button>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default AccountSettings; 