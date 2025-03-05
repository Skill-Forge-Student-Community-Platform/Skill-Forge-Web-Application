import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

import NavBar from '../Navigation/NavBar';
import HomeSidebar from '../Navigation/Sidebar/HomeSidebar';
import EventsSidebar from '../Navigation/Sidebar/EventsSidebar';
import TeamSidebar from '../Navigation/Sidebar/TeamSidebar';

// Page components
import Home from '../Home_page/Home';
// TODO: Uncomment these imports when the components are implemented
// import StudentDashboard from '../Dashboard/StudentDashboard';
// import OrganizerDashboard from '../Dashboard/OrganizerDashboard';
// import ViewEvent from '../Events/ViewEvent';
// import AddEvent from '../Events/AddEvent';
// import ManageEvents from '../Events/ManageEvents';
// import TeamPage from '../Team/TeamPage';
// import TeamManagement from '../Team/TeamManagement';
// import TeamActivity from '../Team/TeamActivity';
// import Inbox from '../Team/Inbox';

// Placeholder components for pages that haven't been implemented yet
const PlaceholderPage = ({ title }) => (
  <div className="p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
    <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{title}</h2>
    <p className="text-gray-600 dark:text-gray-300">This page is coming soon. Check back later!</p>
  </div>
);

const StudentDashboard = ({ userId }) => (
  <PlaceholderPage title={`Student Dashboard for user ${userId}`} />
);

const OrganizerDashboard = ({ userId }) => (
  <PlaceholderPage title={`Organizer Dashboard for user ${userId}`} />
);

const ViewEvent = ({ userId, isStudent }) => (
  <PlaceholderPage title={`Event Viewer (${isStudent ? 'Student' : 'Organizer'} View)`} />
);

const AddEvent = ({ userId }) => (
  <PlaceholderPage title={`Add Event Page for user ${userId}`} />
);

const ManageEvents = ({ userId }) => (
  <PlaceholderPage title={`Manage Events for user ${userId}`} />
);

const TeamPage = ({ userId }) => (
  <PlaceholderPage title={`Teams Page for user ${userId}`} />
);

const TeamManagement = ({ userId }) => (
  <PlaceholderPage title={`Team Management for user ${userId}`} />
);

const TeamActivity = ({ userId }) => (
  <PlaceholderPage title={`Team Activity for user ${userId}`} />
);

const Inbox = ({ userId }) => (
  <PlaceholderPage title={`Inbox for user ${userId}`} />
);

const MainLayout = ({ isDarkMode, toggleTheme, roleType }) => {
  const { user, logout } = useAuthStore();
  const { userId } = useParams();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  // Extract the current section from the URL path
  const pathParts = location.pathname.split('/');
  const currentSection = pathParts[3] || 'home'; // [0]=empty, [1]=role, [2]=userId, [3]=section

  // Validate user matches URL parameters
  useEffect(() => {
    if (user && (user._id !== userId || user.role !== roleType.toLowerCase())) {
      console.log("User/URL mismatch detected. Redirecting to correct path.");
      // Will be redirected in the rendering logic
    }
  }, [user, userId, roleType]);

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Redirect if URL doesn't match user's role or ID
  if (user._id !== userId || user.role !== roleType.toLowerCase()) {
    const correctPath = `/${user.role.charAt(0).toUpperCase() + user.role.slice(1)}/${user._id}/home`;
    return <Navigate to={correctPath} replace />;
  }

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Determine which sidebar to show based on the current main section
  const renderSidebar = () => {
    const isStudent = roleType === 'student';

    switch (currentSection) {
      case 'home':
      case 'dashboard':
        return <HomeSidebar isStudent={isStudent} collapsed={sidebarCollapsed} userId={userId} />;
      case 'view-events':
      case 'add-events':
      case 'manage-events':
        return <EventsSidebar isStudent={isStudent} collapsed={sidebarCollapsed} userId={userId} />;
      case 'teams':
        return <TeamSidebar isStudent={isStudent} collapsed={sidebarCollapsed} userId={userId} />;
      default:
        return <HomeSidebar isStudent={isStudent} collapsed={sidebarCollapsed} userId={userId} />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Top Navigation Bar */}
      <NavBar
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        user={user}
        logout={logout}
        toggleSidebar={toggleSidebar}
        userId={userId}
        roleType={roleType}
      />

      <div className="flex flex-1 overflow-hidden ml-1.5 ">
        {/* Collapsible Sidebar */}
        <div
          className={`${
            sidebarCollapsed ? 'w-16' : 'w-64'
          } transition-all duration-300 ease-in-out -ml-0.5 `}
        >
          {renderSidebar()}
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-1 pt-2.5 mt-16">
          <Routes>
            <Route path="home" element={<Home isDarkMode={isDarkMode} toggleTheme={toggleTheme} user={user} />} />

            {/* Dashboard routes based on role */}
            <Route path="dashboard" element={
              roleType === 'student'
                ? <StudentDashboard userId={userId} />
                : <OrganizerDashboard userId={userId} />
            } />

            {/* Event routes */}
            <Route path="view-events/*" element={<ViewEvent userId={userId} isStudent={roleType === 'student'} />} />

            {/* Organizer-specific routes */}
            {roleType === 'organizer' && (
              <>
                <Route path="add-events/*" element={<AddEvent userId={userId} />} />
                <Route path="manage-events/*" element={<ManageEvents userId={userId} />} />
              </>
            )}

            {/* Team routes */}
            <Route path="teams" element={<TeamPage userId={userId} />} />
            <Route path="teams/management" element={<TeamManagement userId={userId} />} />
            <Route path="teams/activity" element={<TeamActivity userId={userId} />} />
            <Route path="teams/inbox" element={<Inbox userId={userId} />} />

            {/* Default route */}
            <Route path="*" element={<Navigate to="home" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
