import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import './ProfileDropDown.css';

const ProfileDropDown = ({ user, baseUrl, onLogout, roleType }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    setDropdownOpen(false);
    onLogout();
  };

  return (
    <div className="profile-wrapper" onClick={toggleDropdown}>
      <div className="profile-container">
        <div className="profile-image-container">
          {user?.profilePicture ? (
            <img
              src={user.profilePicture}
              alt="Profile"
              className="profile-image"
            />
          ) : (
            <div className="profile-avatar">
              <User size={18} />
            </div>
          )}
          {/* Uncomment to show online status */}
          {/* <span className="profile-status"></span> */}
        </div>
        <div className="profile-info">
          <p className="profile-name">{user?.Username || 'User'}</p>
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
              <p className="dropdown-user">{user?.Username || 'User'}</p>
              <p className="dropdown-email">{user?.email || 'user@example.com'}</p>
            </div>
            <div className="dropdown-avatar">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="profile-image" />
              ) : (
                <User size={24} />
              )}
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
              to={`${baseUrl}/settings`}
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
