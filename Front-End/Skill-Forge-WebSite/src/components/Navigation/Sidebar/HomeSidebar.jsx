import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BarChart2, BookOpen, Award } from 'lucide-react';
import './Sidebar.css';

const HomeSidebar = ({ isStudent, collapsed, userId }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  // Role-specific base URL path
  const roleType = isStudent ? 'Student' : 'Organizer';
  const baseUrl = `/${roleType}/${userId}`;

  const isActive = (path) => currentPath.includes(path);

  // Common link style
  const linkStyle = (active) => `
    flex items-center gap-3 px-4 py-3
    ${active ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200' : 'hover:bg-gray-200 dark:hover:bg-gray-700'}
    rounded-lg transition-all duration-200
  `;

  // Common icon style
  const iconStyle = "w-6 h-6";

  // For collapsed mode, we only show icons
  if (collapsed) {
    return (
      <div className="sidebar-container collapsed py-4 flex flex-col items-center">
        <Link
          to={`${baseUrl}/home`}
          className={`${isActive('/home') ? 'text-blue-700 dark:text-blue-300' : ''} mb-6`}
          title="Home"
        >
          <Home className={iconStyle} />
        </Link>
        <Link
          to={`${baseUrl}/dashboard`}
          className={`${isActive('/dashboard') ? 'text-blue-700 dark:text-blue-300' : ''} mb-6`}
          title="Dashboard"
        >
          <BarChart2 className={iconStyle} />
        </Link>

        {/* Student-specific sidebar links */}
        {isStudent && (
          <>
            <Link
              to={`${baseUrl}/learning-paths`}
              className={`${isActive('/learning-paths') ? 'text-blue-700 dark:text-blue-300' : ''} mb-6`}
              title="Learning Paths"
            >
              <BookOpen className={iconStyle} />
            </Link>
            <Link
              to={`${baseUrl}/achievements`}
              className={`${isActive('/achievements') ? 'text-blue-700 dark:text-blue-300' : ''} mb-6`}
              title="Achievements"
            >
              <Award className={iconStyle} />
            </Link>
          </>
        )}

        {/* Organizer-specific sidebar links */}
        {!isStudent && (
          <>
            <Link
              to={`${baseUrl}/analytics`}
              className={`${isActive('/analytics') ? 'text-blue-700 dark:text-blue-300' : ''} mb-6`}
              title="Analytics"
            >
              <BarChart2 className={iconStyle} />
            </Link>
          </>
        )}
      </div>
    );
  }

  // Expanded sidebar
  return (
    <div className="sidebar-container p-4">
      <h3 className="font-semibold text-gray-500 mb-4 uppercase text-xs tracking-wider pl-2">
        Dashboard
      </h3>
      <nav className="flex flex-col gap-1">
        <Link to={`${baseUrl}/home`} className={linkStyle(isActive('/home'))}>
          <Home className={iconStyle} />
          <span>Home</span>
        </Link>
        <Link to={`${baseUrl}/dashboard`} className={linkStyle(isActive('/dashboard'))}>
          <BarChart2 className={iconStyle} />
          <span>Dashboard</span>
        </Link>

        {/* Student-specific sidebar links */}
        {isStudent && (
          <>
            <h3 className="font-semibold text-gray-500 mt-6 mb-4 uppercase text-xs tracking-wider pl-2">
              Learning
            </h3>
            <Link to={`${baseUrl}/learning-paths`} className={linkStyle(isActive('/learning-paths'))}>
              <BookOpen className={iconStyle} />
              <span>Learning Paths</span>
            </Link>
            <Link to={`${baseUrl}/achievements`} className={linkStyle(isActive('/achievements'))}>
              <Award className={iconStyle} />
              <span>Achievements</span>
            </Link>
          </>
        )}

        {/* Organizer-specific sidebar links */}
        {!isStudent && (
          <>
            <h3 className="font-semibold text-gray-500 mt-6 mb-4 uppercase text-xs tracking-wider pl-2">
              Management
            </h3>
            <Link to={`${baseUrl}/analytics`} className={linkStyle(isActive('/analytics'))}>
              <BarChart2 className={iconStyle} />
              <span>Analytics</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default HomeSidebar;
