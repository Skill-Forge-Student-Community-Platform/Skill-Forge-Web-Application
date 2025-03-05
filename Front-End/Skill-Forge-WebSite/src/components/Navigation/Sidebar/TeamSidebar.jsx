import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Settings, Activity, MessageSquare } from 'lucide-react';
import './Sidebar.css';

const TeamSidebar = ({ isStudent, collapsed, userId }) => {
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
          to={`${baseUrl}/teams`}
          className={`${isActive('/teams') && !isActive('/management') && !isActive('/activity') && !isActive('/inbox') ? 'text-blue-700 dark:text-blue-300' : ''} mb-6`}
          title="My Teams"
        >
          <Users className={iconStyle} />
        </Link>
        <Link
          to={`${baseUrl}/teams/management`}
          className={`${isActive('/teams/management') ? 'text-blue-700 dark:text-blue-300' : ''} mb-6`}
          title="Team Management"
        >
          <Settings className={iconStyle} />
        </Link>
        <Link
          to={`${baseUrl}/teams/activity`}
          className={`${isActive('/teams/activity') ? 'text-blue-700 dark:text-blue-300' : ''} mb-6`}
          title="Team Activity"
        >
          <Activity className={iconStyle} />
        </Link>
        <Link
          to={`${baseUrl}/teams/inbox`}
          className={`${isActive('/teams/inbox') ? 'text-blue-700 dark:text-blue-300' : ''} mb-6`}
          title="Team Inbox"
        >
          <MessageSquare className={iconStyle} />
        </Link>
      </div>
    );
  }

  // Expanded sidebar
  return (
    <div className="sidebar-container p-4">
      <h3 className="font-semibold text-gray-500 mb-4 uppercase text-xs tracking-wider pl-2">
        Teams
      </h3>
      <nav className="flex flex-col gap-1">
        <Link
          to={`${baseUrl}/teams`}
          className={linkStyle(
            isActive('/teams') && !isActive('/management') && !isActive('/activity') && !isActive('/inbox')
          )}
        >
          <Users className={iconStyle} />
          <span>My Teams</span>
        </Link>
        <Link to={`${baseUrl}/teams/management`} className={linkStyle(isActive('/teams/management'))}>
          <Settings className={iconStyle} />
          <span>{isStudent ? 'Team Settings' : 'Team Management'}</span>
        </Link>
        <Link to={`${baseUrl}/teams/activity`} className={linkStyle(isActive('/teams/activity'))}>
          <Activity className={iconStyle} />
          <span>Activity</span>
        </Link>
        <Link to={`${baseUrl}/teams/inbox`} className={linkStyle(isActive('/teams/inbox'))}>
          <MessageSquare className={iconStyle} />
          <span>Inbox</span>
        </Link>

        {/* Different team features based on role */}
        {isStudent ? (
          <div className="mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-500 mb-4 uppercase text-xs tracking-wider pl-2">
              Your Teams
            </h3>
            <div className="space-y-2 pl-2">
              <div className="text-sm cursor-pointer hover:text-blue-600">Team Alpha</div>
              <div className="text-sm cursor-pointer hover:text-blue-600">Project Omega</div>
              <div className="text-sm cursor-pointer hover:text-blue-600">Study Group</div>
            </div>
          </div>
        ) : (
          <div className="mt-6 border-t pt-4 border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-500 mb-4 uppercase text-xs tracking-wider pl-2">
              Manage Teams
            </h3>
            <div className="space-y-2 pl-2">
              <div className="text-sm cursor-pointer hover:text-blue-600">Create New Team</div>
              <div className="text-sm cursor-pointer hover:text-blue-600">Pending Requests</div>
              <div className="text-sm cursor-pointer hover:text-blue-600">Team Analytics</div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default TeamSidebar;
