import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, UserCheck, UsersRound, Calendar, Home } from 'lucide-react';
import useThemeToggle from "../../hooks/useThemeToggle";
import './NetworkSidebar.css';

const NetworkSidebar = ({ connectionCount = 0, pendingCount = 0, currentPath, userId, roleType }) => {
  const { isDarkMode } = useThemeToggle();

  // Construct the base path for network routes
  const getBasePath = () => {
    if (!userId || !roleType) return "/network";
    const formattedRole = roleType.charAt(0).toUpperCase() + roleType.slice(1);
    return `/${formattedRole}/${userId}/network`;
  };

  const basePath = getBasePath();

  // Check if a link is active
  const isActive = (path) => {
    if (path === '') {
      // For home page, check if current path is exactly the base path or has no additional segments
      return currentPath === basePath || currentPath === `${basePath}/`;
    }
    return currentPath?.includes(path);
  };

  return (
    <div className={`network-sidebar ${isDarkMode ? 'dark' : 'light'}`}>
      <h2 className="sidebar-title">Manage My Network</h2>

      <ul className="sidebar-menu">
        {/* Home/Default page */}
        <li className={`sidebar-item ${isActive('') ? 'active' : ''}`}>
          <Link to={basePath} className="sidebar-link">
            <Home size={20} />
            <span className="item-name">Home</span>
          </Link>
        </li>

        <li className={`sidebar-item ${isActive('/connections') ? 'active' : ''}`}>
          <Link to={`${basePath}/connections`} className="sidebar-link">
            <Users size={20} />
            <span className="item-name">Connections</span>
            {connectionCount > 0 && (
              <span className="item-count">{connectionCount}</span>
            )}
          </Link>
        </li>

        {pendingCount > 0 && (
          <li className={`sidebar-item ${isActive('/requests') ? 'active' : ''}`}>
            <Link to={`${basePath}/requests`} className="sidebar-link">
              <UserPlus size={20} />
              <span className="item-name">Invitations</span>
              <span className="item-count" style={{ backgroundColor: 'var(--accent-red)' }}>
                {pendingCount}
              </span>
            </Link>
          </li>
        )}

        <li className={`sidebar-item ${isActive('/following') ? 'active' : ''}`}>
          <Link to={`${basePath}/following`} className="sidebar-link">
            <UserCheck size={20} />
            <span className="item-name">Following & Followers</span>
          </Link>
        </li>

        <div className="sidebar-divider"></div>

        <li className={`sidebar-item ${isActive('/groups') ? 'active' : ''}`}>
          <Link to={`${basePath}/groups`} className="sidebar-link">
            <UsersRound size={20} />
            <span className="item-name">Groups</span>
            <span className="item-badge soon">Soon</span>
          </Link>
        </li>

        <li className={`sidebar-item ${isActive('/events') ? 'active' : ''}`}>
          <Link to={`${basePath}/events`} className="sidebar-link">
            <Calendar size={20} />
            <span className="item-name">Events</span>
            <span className="item-badge soon">Soon</span>
          </Link>
        </li>
      </ul>

      <div className="network-tip">
        <h3 className="tip-title">Grow Your Network</h3>
        <p className="tip-text">
          Connect with peers and professionals to expand your learning opportunities and career prospects.
        </p>
      </div>
    </div>
  );
};

export default NetworkSidebar;
