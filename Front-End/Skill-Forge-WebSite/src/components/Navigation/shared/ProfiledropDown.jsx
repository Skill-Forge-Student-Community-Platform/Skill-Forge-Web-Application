import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
// Fix the import - ensure it's importing the default export
import useUserProfile from '../../../hooks/useUserProfile.js'; // Add .js extension
import ProfileAvatar from '../../../components/Home_page/Home_components/ProfileAvatar';
import './ProfileDropDown.css';

const ProfileDropDown = ({ user, baseUrl, onLogout, roleType }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { fullName, email } = useUserProfile(user?._id);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    setDropdownOpen(false);
    onLogout();
  };

  return (
    <div className="profile-wrapper" onClick={toggleDropdown}>
      <div className="profile-container">
        <div className="profile-image-container">
          {user?._id ? (
            <ProfileAvatar
              userId={user._id}
              size="tiny"
              showLevel={false}
              showMembershipTag={false}
              className="profile-dropdown-avatar"
            />
          ) : (
            <div className="profile-avatar">
              <User size={18} />
            </div>
          )}
        </div>
        <div className="profile-info">
          <p className="profile-name">{user?.Username || fullName || 'User'}</p>
          <p className="profile-role">{roleType}</p>
        </div>
        <ChevronDown
          size={16}
          className={`profile-chevron ${dropdownOpen ? 'rotated' : ''}`}
        />
      </div>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-header">
            <div className="dropdown-user-info">
              <p className="dropdown-user">{fullName || user?.Username || 'User'}</p>
              <p className="dropdown-email">{email || user?.email || 'user@example.com'}</p>
            </div>
            <div className="dropdown-avatar">
              <ProfileAvatar
                userId={user?._id}
                size="tiny"
                showLevel={false}
                showMembershipTag={false}
              />
            </div>
          </div>

          <div className="dropdown-section">
            <Link
              to={`${baseUrl}/profile`}
              className="dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="dropdown-item-icon">
                <User size={16} />
              </div>
              <span>View Profile</span>
            </Link>

            <Link
              to={`${baseUrl}/settings/${user?._id}`}  // This should now point to /Student/:userId/settings or /Organizer/:userId/settings
              className="dropdown-item"
              onClick={() => setDropdownOpen(false)}
            >
              <div className="dropdown-item-icon">
                <Settings size={16} />
              </div>
              <span>Account Settings</span>
            </Link>

            <button
              onClick={handleLogout}
              className="dropdown-item logout"
            >
              <div className="dropdown-item-icon">
                <LogOut size={16} />
              </div>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropDown;
