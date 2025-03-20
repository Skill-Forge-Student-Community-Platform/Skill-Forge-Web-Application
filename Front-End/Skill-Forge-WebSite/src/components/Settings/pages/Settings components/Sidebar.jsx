import { Link, useLocation, useNavigate } from 'react-router-dom';
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
import { useState } from 'react';
import { authAPI } from '../services/api';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = [
    { name: 'Change Name', path: '/settings/name', icon: <FaUser /> },
    { name: 'Change Email', path: '/settings/email', icon: <FaEnvelope /> },
    { name: 'Change Password', path: '/settings/password', icon: <FaLock /> },
    { name: 'Last Login', path: '/settings/last-login', icon: <FaClock /> },
    { name: 'Social Links', path: '/settings/social', icon: <FaShareAlt /> },
    { name: 'Email & Notifications', path: '/settings/notifications', icon: <FaBell /> }
  ];

  const dangerItems = [
    { name: 'Delete Account', path: '/settings/delete-account', icon: <FaTrashAlt /> }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      // Call the API to logout
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear localStorage
      localStorage.removeItem('token');
      
      // Redirect to login
      navigate('/login');
    }
  };

  return (
    <div className={`settings-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <button 
        className="collapse-button md:hidden"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <FaBars />
      </button>
      <nav className="settings-nav">
        <ul className="settings-nav-list">
          {menuItems.map((item, idx) => (
            <li key={idx} className="settings-nav-item">
              <Link
                to={item.path}
                className={`settings-nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="settings-nav-icon">{item.icon}</span>
                <span className={`settings-nav-text ${isCollapsed ? 'hidden' : ''}`}>
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
                to={item.path}
                className={`settings-nav-link danger ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="settings-nav-icon">{item.icon}</span>
                <span className={`settings-nav-text ${isCollapsed ? 'hidden' : ''}`}>
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
              <span className={`settings-nav-text ${isCollapsed ? 'hidden' : ''}`}>
                Logout
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 