import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, User, ChevronDown, LogOut, Settings } from 'lucide-react';
import { FaMoon } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import { HiOutlineBell } from "react-icons/hi2";
import './NavBar.css';

const NavBar = ({ isDarkMode, toggleTheme, user, logout, toggleSidebar, userId, roleType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Base URL for role-based navigation
  const baseUrl = `/${roleType.charAt(0).toUpperCase() + roleType.slice(1)}/${userId}`;

  const handleToggleSidebar = () => {
    toggleSidebar();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <button
          onClick={handleToggleSidebar}
          className="sidebar-toggle"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <X size={24} />
          ) : (
            <Menu size={24} />
          )}
        </button>
      <div className="navbar-container">
        {/* Sidebar Toggle Button positioned absolutely */}


        {/* Left Section - Logo */}
        <div className="navbar-logo">
          <Link to={`${baseUrl}/home`}>
            <h1>SkillForge</h1>
          </Link>
        </div>

        {/* Middle Section - Navigation Links */}
        <div className="navbar-middle">
          <ul className="nav-links">
            <NavLink
              to={`${baseUrl}/home`}
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              <span>Home</span>
            </NavLink>

            <NavLink
              to={`${baseUrl}/view-events`}
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              <span>Events</span>
            </NavLink>

            <NavLink
              to={`${baseUrl}/teams`}
              className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            >
              <span>Teams</span>
            </NavLink>

            {roleType === 'organizer' && (
              <>
                <NavLink
                  to={`${baseUrl}/add-events`}
                  className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                >
                  <span>Add Event</span>
                </NavLink>
              </>
            )}
          </ul>
        </div>

        {/* Right Section - Theme Toggle, Notifications, Profile */}
        <div className="navbar-right">
          {/* Custom Theme Toggle */}
          <div
            className={`toggle-icon ${isDarkMode ? "dark" : ""}`}
            onClick={toggleTheme}
          >
            <div className="icon-light">
              <IoSunnyOutline />
            </div>
            <div className="icon-dark">
              <FaMoon />
            </div>
            <div className="toggle-circle"></div>
          </div>

          {/* Notification Icon */}
          <div className="notification-icon">
            <HiOutlineBell />
          </div>

          {/* Profile with Dropdown */}
          <div className="profile" onClick={toggleDropdown}>
            <p className="profile-name">Hey {user?.Username || 'User'}</p>
            <div className="profile-image-container">
              {user?.profilePicture ? (
                <img
                  src={user.profilePicture}
                  alt="Profile"
                  className="profile-image"
                />
              ) : (
                <div className="profile-image profile-placeholder">
                  <User size={18} />
                </div>
              )}
            </div>
            <ChevronDown size={16} className="dropdown-icon" />

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <p className="dropdown-user">{user?.Username || 'User'}</p>
                  <p className="dropdown-email">{user?.email || 'user@example.com'}</p>
                </div>

                <Link
                  to={`${baseUrl}/profile`}
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <User size={16} />
                  <span>View Profile</span>
                </Link>

                <Link
                  to={`${baseUrl}/settings`}
                  className="dropdown-item"
                  onClick={() => setDropdownOpen(false)}
                >
                  <Settings size={16} />
                  <span>Account Settings</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setDropdownOpen(false);
                  }}
                  className="dropdown-item logout"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
