import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, PlusCircle, Settings, BookOpen, Filter } from 'lucide-react';
import './Sidebar.css';

const EventsSidebar = ({ isStudent, collapsed, userId }) => {
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
          to={`${baseUrl}/view-events`}
          className={`${isActive('/view-events') ? 'text-blue-700 dark:text-blue-300' : ''} mb-6`}
          title="Browse Events"
        >
          <Calendar className={iconStyle} />
        </Link>

        {isStudent && (
          <>
            <Link
              to={`${baseUrl}/view-events/registered`}
              className={`${isActive('/registered') ? 'text-blue-700 dark:text-blue-300' : ''} mb-6`}
              title="My Events"
            >
              <BookOpen className={iconStyle} />
            </Link>
          </>
        )}

        {!isStudent && (
          <>
            <Link
              to={`${baseUrl}/add-events`}
              className={`${isActive('/add-events') ? 'text-blue-700 dark:text-blue-300' : ''} mb-6`}
              title="Add Event"
            >
              <PlusCircle className={iconStyle} />
            </Link>
            <Link
              to={`${baseUrl}/manage-events`}
              className={`${isActive('/manage-events') ? 'text-blue-700 dark:text-blue-300' : ''} mb-6`}
              title="Manage Events"
            >
              <Settings className={iconStyle} />
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
        Events
      </h3>
      <nav className="flex flex-col gap-1">
        <Link to={`${baseUrl}/view-events`} className={linkStyle(isActive('/view-events') && !isActive('/registered'))}>
          <Calendar className={iconStyle} />
          <span>Browse Events</span>
        </Link>

        {/* Student-specific event links */}
        {isStudent && (
          <>
            <Link to={`${baseUrl}/view-events/registered`} className={linkStyle(isActive('/registered'))}>
              <BookOpen className={iconStyle} />
              <span>My Events</span>
            </Link>
            <div className="mt-6 mb-4">
              <h3 className="font-semibold text-gray-500 uppercase text-xs tracking-wider pl-2">
                Filters
              </h3>
              <div className="mt-4 px-2">
                <div className="flex items-center gap-2 text-sm">
                  <Filter size={16} />
                  <span>Filter by category</span>
                </div>
                <div className="mt-2 pl-6 space-y-1">
                  <div className="text-sm cursor-pointer hover:text-blue-600">Technology</div>
                  <div className="text-sm cursor-pointer hover:text-blue-600">Design</div>
                  <div className="text-sm cursor-pointer hover:text-blue-600">Business</div>
                  <div className="text-sm cursor-pointer hover:text-blue-600">Science</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Organizer-specific event links */}
        {!isStudent && (
          <>
            <Link to={`${baseUrl}/add-events`} className={linkStyle(isActive('/add-events'))}>
              <PlusCircle className={iconStyle} />
              <span>Add Event</span>
            </Link>
            <Link to={`${baseUrl}/manage-events`} className={linkStyle(isActive('/manage-events'))}>
              <Settings className={iconStyle} />
              <span>Manage Events</span>
            </Link>
          </>
        )}
      </nav>
    </div>
  );
};

export default EventsSidebar;
