import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AccountTypeSelection from './ProfileSetup/AccountTypeSelection';
import StudentProfileForm from './ProfileSetup/StudentProfileForm';
import OrganizerProfileForm from './ProfileSetup/OrganizerProfileForm';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '../../store/authStore';

function ProfileSetupRoute() {
  const location = useLocation();
  const { user } = useAuthStore();

  useEffect(() => {
    console.log('ProfileSetupRoute component mounted');
    console.log('Current pathname:', location.pathname);
    console.log('Route params:', location.pathname.split('/'));
    console.log('User state in ProfileSetupRoute:', user);
  }, [location.pathname, user]);

  // Get the last part of the URL path to determine which component to show
  const currentPath = location.pathname.split('/').pop();

  // Handle invalid paths by redirecting to the route selection
  const renderRouteContent = () => {
    switch (currentPath) {
      case 'type':
        return <AccountTypeSelection />;
      case 'student':
        return <StudentProfileForm />;
      case 'organizer':
        return <OrganizerProfileForm />;
      default:
        // If it's just /profile/setup/ or an invalid route, redirect to type selection
        if (location.pathname === '/profile/setup' || location.pathname === '/profile/setup/') {
          return <Navigate to="/profile/setup/type" replace />;
        }
        // For any other invalid paths, show the 404-like content
        return (
          <div className="flex items-center justify-center h-screen text-gray-800">
            <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
              <h1 className="text-2xl font-bold mb-4">Route Not Found</h1>
              <p className="mb-2">Current path: {location.pathname}</p>
              <p className="mb-4">Expected paths: /profile/setup/type, /profile/setup/student, or /profile/setup/organizer</p>
              <div className="mt-4 p-4 bg-gray-100 rounded-lg text-left">
                <p className="font-bold">Debug Info:</p>
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify({
                    pathname: location.pathname,
                    user: user ? {
                      role: user.role,
                      profileComplete: user.profileComplete,
                      isVerified: user.isVerified
                    } : null
                  }, null, 2)}
                </pre>
              </div>
              <button
                onClick={() => window.location.href = '/profile/setup/type'}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Go to Role Selection
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      {renderRouteContent()}
      <Toaster />
    </div>
  );
}

export default ProfileSetupRoute;
