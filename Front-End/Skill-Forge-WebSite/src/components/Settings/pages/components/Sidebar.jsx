import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaClock,
  FaShareAlt,
  FaBell,
  FaBars,
  FaTrashAlt,
  FaSignOutAlt
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../store/authStore';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roleType, userId } = useParams();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout, user } = useAuthStore();

  // Set a class on the parent container when collapsed
  useEffect(() => {
    const settingsContent = document.querySelector('.settings-content');
    if (settingsContent) {
      if (isCollapsed) {
        document.querySelector('.settings-sidebar').classList.add('collapsed');
      } else {
        document.querySelector('.settings-sidebar').classList.remove('collapsed');
      }
    }
  }, [isCollapsed]);

  // Determine the base URL for the role
  const correctedRoleType = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || roleType;
  const correctedUserId = user?._id || userId;
  const baseUrl = `/${correctedRoleType}/${correctedUserId}/settings`;

  const menuItems = [
    { name: 'Profile Settings', path: 'profile', icon: <FaUser /> },
    { name: 'Change Name', path: 'name', icon: <FaUser /> },
    { name: 'Change Email', path: 'email', icon: <FaEnvelope /> },
    { name: 'Change Password', path: 'password', icon: <FaLock /> },
    { name: 'Last Login', path: 'last-login', icon: <FaClock /> },
    { name: 'Social Links', path: 'social', icon: <FaShareAlt /> },
    { name: 'Email & Notifications', path: 'notifications', icon: <FaBell /> }
  ];

  const dangerItems = [
    { name: 'Delete Account', path: 'delete-account', icon: <FaTrashAlt /> }
  ];

  // Check if the current path matches a given path segment
  const isActive = (path) => {
    const currentPath = location.pathname;
    if (path === '') {
      // For root settings path or /account
      return currentPath === baseUrl ||
             currentPath === `${baseUrl}/` ||
             currentPath === `${baseUrl}/account`;
    }
    return currentPath === `${baseUrl}/${path}`;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth/login', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`settings-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="settings-nav">
        <button
          className="collapse-button"
          onClick={toggleCollapse}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <FaBars />
        </button>

        <ul className="settings-nav-list">
          <li className="settings-nav-item">
            <Link
              to={`${baseUrl}/`}
              className={`settings-nav-link ${isActive('') ? 'active' : ''}`}
            >
              <span className="settings-nav-icon"><FaUser /></span>
              <span className={`settings-nav-text`}>
                Overview
              </span>
            </Link>
          </li>

          {menuItems.map((item, idx) => (
            <li key={idx} className="settings-nav-item">
              <Link
                to={`${baseUrl}/${item.path}`}
                className={`settings-nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="settings-nav-icon">{item.icon}</span>
                <span className={`settings-nav-text`}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="settings-divider"></div>

        <ul className="settings-nav-list danger-zone">
          {dangerItems.map((item, idx) => (
            <li key={idx} className="settings-nav-item">
              <Link
                to={`${baseUrl}/${item.path}`}
                className={`settings-nav-link danger ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="settings-nav-icon">{item.icon}</span>
                <span className={`settings-nav-text`}>
                  {item.name}
                </span>
              </Link>
            </li>
          ))}
          <li className="settings-nav-item">
            <button
              onClick={handleLogout}
              className="settings-nav-link w-full text-left"

            >
              <span className="settings-nav-icon"><FaSignOutAlt /></span>
              <span className={`settings-nav-text`}>
                Logout
              </span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
