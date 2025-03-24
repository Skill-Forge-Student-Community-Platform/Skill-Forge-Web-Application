import React from 'react';
import { Link } from 'react-router-dom';
import { Users, UserPlus, UserCheck, UsersRound, Calendar, Home } from 'lucide-react';

const NetworkSidebar = ({ connectionCount = 0, pendingCount = 0, currentPath, userId, roleType }) => {
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
      <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Manage My Network</h2>

      <nav className="space-y-2">
        {/* Home/Default page */}
        <Link
          to={basePath}
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            isActive('') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <Home size={20} />
          <span>Home</span>
        </Link>

        <Link
          to={`${basePath}/connections`}
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            isActive('/connections') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <Users size={20} />
          <span>Connections</span>
          {connectionCount > 0 && (
            <span className="ml-auto bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full text-xs">
              {connectionCount}
            </span>
          )}
        </Link>

        {pendingCount > 0 && (
          <Link
            to={`${basePath}/requests`}
            className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
              isActive('/requests') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <UserPlus size={20} />
            <span>Invitations</span>
            <span className="ml-auto bg-red-500 text-white px-2 py-1 rounded-full text-xs">
              {pendingCount}
            </span>
          </Link>
        )}

        <Link
          to={`${basePath}/following`}
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            isActive('/following') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <UserCheck size={20} />
          <span>Following & Followers</span>
        </Link>

        <Link
          to={`${basePath}/groups`}
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            isActive('/groups') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <UsersRound size={20} />
          <span>Groups</span>
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            Soon
          </span>
        </Link>

        <Link
          to={`${basePath}/events`}
          className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
            isActive('/events') ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          <Calendar size={20} />
          <span>Events</span>
          <span className="ml-auto text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            Soon
          </span>
        </Link>
      </nav>

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
          Grow Your Network
        </h3>
        <p className="text-xs text-blue-600 dark:text-blue-400">
          Connect with peers and professionals to expand your learning opportunities and career prospects.
        </p>
      </div>
    </div>
  );
};

export default NetworkSidebar;
