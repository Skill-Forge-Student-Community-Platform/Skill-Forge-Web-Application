import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

import { EventProvider } from '../../context/EventContext';

import NavBar from '../Navigation/NavBar';

// Page components
import Home from '../Home_page/Home';
import ExplorePage from '../Events/Student/ExplorePage';
import OrgnizerEventAddingForm from '../Events/Organizer/OrganizerEventAddingForm';
import OrganizerEventList from '../Events/Organizer/OrganizerEventList';

import Friendspage from '../Network/Friendspage';
import AchievementCenter from '../Achievementcenter/AchievementCenter';

import NotificationPage from '../Notifications/NotificationPage';
import OrganizerEventDetails from '../Events/Organizer/OrganizerEventDetails';
import ExploreDetails from '../Events/Student/ExploreDetails';
import RegisterEvents from '../Events/Student/RegisterEvents';

// Import Student Profile components
import StudentProfilePage from '../StudentProfile/StudentProfilePage';
// Import student profile related components from correct location
import ViewAllProjects from '../StudentProfile/student_layout_pages/ViewAllProjects';
import ViewAllPosts from '../StudentProfile/student_layout_pages/ViewAllPosts';

// Placeholder for components to be implemented later
const AddCertificateForm = () => <PlaceholderPage title="Add Certificate Form" />;
const AddProjectForm = () => <PlaceholderPage title="Add Project Form" />;
const PortfolioBuilder = () => <PlaceholderPage title="Portfolio Builder" />;
const PortfolioView = () => <PlaceholderPage title="Portfolio View" />;

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

// Existing placeholder components
const StudentDashboard = ({ userId }) => (
  <PlaceholderPage title={`Student Dashboard for user ${userId}`} />
);

const OrganizerDashboard = ({ userId }) => (
  <PlaceholderPage title={`Organizer Dashboard for user ${userId}`} />
);

// More existing placeholders
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

// New placeholder components
const NetworkPage = ({ userId }) => (
  <PlaceholderPage title={`Network Page for user ${userId}`} />
);

const BookmarksPage = ({ userId }) => (
  <PlaceholderPage title={`Bookmarks Page for user ${userId}`} />
);

const SavedEventsPage = ({ userId }) => (
  <PlaceholderPage title={`Saved Events for user ${userId}`} />
);

const CreateTeamPage = ({ userId }) => (
  <PlaceholderPage title={`Create Team Page for user ${userId}`} />
);

const FindTeamsPage = ({ userId }) => (
  <PlaceholderPage title={`Find Teams Page for user ${userId}`} />
);

const PricingPage = ({ userId }) => (
  <PlaceholderPage title={`Pricing Plans for user ${userId}`} />
);

// Additional placeholder components for missing routes
const LearningPathsPage = ({ userId }) => (
  <PlaceholderPage title={`Learning Paths for user ${userId}`} />
);

const AchievementsPage = ({ userId }) => (
  <PlaceholderPage title={`Achievements for user ${userId}`} />
);

const EventCategoriesPage = ({ userId }) => (
  <PlaceholderPage title={`Event Categories for user ${userId}`} />
);

// Additional placeholder components for event-related routes
const UpcomingEventsPage = ({ userId }) => (
  <PlaceholderPage title={`Upcoming Events for user ${userId}`} />
);

const EventUpdatesPage = ({ userId }) => (
  <PlaceholderPage title={`Event Updates for user ${userId}`} />
);

const MyEventsPage = ({ userId }) => (
  <PlaceholderPage title={`My Registered Events for user ${userId}`} />
);

// Role-specific profile pages
const OrganizerProfilePage = ({ userId }) => (
  <PlaceholderPage title={`Organizer Profile for user ${userId}`} />
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

  return (
    <div className="flex h-screen ">
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

      {/* Main Content - full width */}
      <main className="w-full overflow-auto p-4 pt-20">

        <EventProvider>
          <Routes>
            <Route path="home/*" element={<Home isDarkMode={isDarkMode} toggleTheme={toggleTheme} user={user} />} />

            {/* Dashboard route for students only */}
            {roleType === 'student' && (
              <Route path="dashboard/*" element={<StudentDashboard userId={userId} />} />
            )}

            {/* Profile routes */}
            <Route path="profile/*" element={
              roleType === 'student' ? (
                <StudentProfilePage user={user} isOwnProfile={true} />
              ) : (
                <OrganizerProfilePage userId={userId} />
              )
            } />

            {/* Student profile viewing routes */}
            <Route path="student/:profileId/*" element={<StudentProfilePage user={user} />} />

            {/* Certificate and project routes */}
            <Route path="add-certificate" element={<AddCertificateForm />} />
            <Route path="add-project" element={<AddProjectForm />} />
            <Route path="portfolio-builder/*" element={<PortfolioBuilder userId={userId} />} />
            <Route path="portfolio/:portfolioId" element={<PortfolioView />} />

            {/* Student-specific learning routes */}
            <Route path="learning-paths/*" element={<LearningPathsPage userId={userId} />} />
            <Route path="achievements/*" element={<AchievementCenter />} />

            {/* Event routes */}
            <Route path="view-events/*" element={<ExplorePage userId={userId} user={user} isStudent={roleType === 'student'} />} />

            <Route path="explore-event/:id/*" element={<ExploreDetails userId={userId} user={user} />} />
            <Route path="view-events/categories/*" element={<EventCategoriesPage userId={userId} />} />
            <Route path="view-events/registered" element={<RegisterEvents userId={userId} />} />

            {/* Additional event routes */}
            <Route path="view-events/upcoming/*" element={<UpcomingEventsPage userId={userId} />} />
            <Route path="view-events/updates/*" element={<EventUpdatesPage userId={userId} />} />
            <Route path="saved-events" element={<SavedEventsPage userId={userId} />} />


            {/* Notifications page */}
            <Route path="notifications/*" element={<NotificationPage userId={userId} />} />

            {/* Organizer-specific routes */}
            {roleType === 'organizer' && (
              <>
                <Route path="add-events/*" element={<OrgnizerEventAddingForm userId={userId} />} />
                <Route path="manage-events/*" element={<OrganizerEventList userId={userId} />} />
                <Route path="view-event/:id/*" element={<OrganizerEventDetails />} />
              </>
            )}

            {/* Team routes */}
            <Route path="teams" element={<TeamPage userId={userId} />} />
            <Route path="teams/management" element={<TeamManagement userId={userId} />} />
            <Route path="teams/activity" element={<TeamActivity userId={userId} />} />
            <Route path="teams/inbox" element={<Inbox userId={userId} />} />
            <Route path="teams/create" element={<CreateTeamPage userId={userId} />} />
            <Route path="teams/find" element={<FindTeamsPage userId={userId} />} />

            {/* Network routes */}
            <Route path="network/*" element={<Friendspage />} />

            {/* other routes */}
            <Route path="bookmarks" element={<BookmarksPage userId={userId} />} />
            <Route path="pricing" element={<PricingPage userId={userId} />} />

            {/* Default route */}
            <Route path="*" element={<Navigate to="home" replace />} />
          </Routes>
        </EventProvider>

      </main>
    </div>
  );
};

export default MainLayout;
