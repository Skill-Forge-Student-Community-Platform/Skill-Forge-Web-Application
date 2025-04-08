import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Posting from '../Community_posting/Posting';
import Trending_Data from '../Home_page/Home_components/Trending_Data';
import ProfileOverview from '../Home_page/Home_components/ProfileOverview';
import { useAuthStore } from '../../store/authStore';
import useThemeToggle from '../../hooks/useThemeToggle';
import './Home.css';

function Home() {
  // Get user data from the auth store
  const { user } = useAuthStore();

  // Use the theme hook - we only need isDarkMode here, not the toggle function
  const { isDarkMode } = useThemeToggle();

  // Don't render until theme is determined
  if (isDarkMode === null) {
    return null;
  }

  return (
    <div className="flex justify-center w-full home-container">
      <div className="w-full max-w-[1128px] xl:max-w-[1128px] lg:max-w-[990px] px-4">
        {/* Three column layout with responsive visibility - changed to row at md breakpoint */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left column - Profile Overview - visible on medium screens and larger */}
          <div className="w-full hidden md:block md:w-[240px] lg:w-[260px] xl:w-[260px] shrink-0 sidebar-margin home-sidebar">
            <div className="sticky top-0">
              <ProfileOverview user={user} />
            </div>
          </div>

          {/* Middle column - Feed/Posts - always visible, smaller on medium screens */}
          <main className="w-full sm:max-w-[600px] md:w-[calc(100%-230px)] lg:w-[520px] xl:w-[540px] shrink-0 overflow-y-auto mx-auto md:mx-0 feed-container">
            <div className="mb-4">
              <div>
                <Routes>
                  <Route path="/" element={<Posting user={user} />} />
                </Routes>
              </div>
            </div>
          </main>

          {/* Right column - Trending - only visible on large screens and up */}
          <div className="hidden lg:block w-full lg:w-[300px] xl:w-[300px] shrink-0 home-sidebar">
            <div className="sticky top-0">
              <Trending_Data />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
