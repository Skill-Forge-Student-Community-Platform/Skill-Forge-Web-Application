import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../Home_page/HomePage/NavBar';
import SideBar from '../Home_page/HomePage/SideBar';
import Posting from '../Community_posting/Posting';
import { useAuthStore } from '../../store/authStore';

function Home({ isDarkMode, toggleTheme }) {
  // Get user data and logout function from the auth store
  const { user, logout } = useAuthStore();

  return (
    <>
      <div className='Navigation__Container'>
        <Navbar
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme} 
          user={user}
          logout={logout}
        />
      </div>
      <main className='Layout__Container'>
        <div className='SideBar__Container'>
          {/* <SideBar isDarkMode={isDarkMode} user={user} /> */}
        </div>
        <div className='Content__Container'>
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Posting user={user} />} />
              {/* Add other main content routes here */}
            </Routes>
          </div>
          <div className="right-section">
            <SideBar isDarkMode={isDarkMode} user={user} />
          </div>
        </div>
      </main>
    </>
  );
}

export default Home;
