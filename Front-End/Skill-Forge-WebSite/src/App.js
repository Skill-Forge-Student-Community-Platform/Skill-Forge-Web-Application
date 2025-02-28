import './App.css';
import Navbar from './components/Home_page/NavBar';
import { Routes, Route } from 'react-router-dom';
import SideBar from './components/Home_page/SideBar';
import React, { useState, useEffect } from 'react';
import { initializeTheme, lightTheme, darkTheme, applyTheme } from './utils/Theme';
import Posting from './components/Community_posting/Posting';
import Authentications from './components/Registration/Authentications.route';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    initializeTheme();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.setAttribute('data-theme', !isDarkMode ? 'dark' : 'light');
    applyTheme(!isDarkMode ? darkTheme : lightTheme);
  };

  return (
    <div className="App">
      <Routes>
        {/* Authentication routes without navigation and sidebar */}
        <Route path="/auth/*" element={<Authentications />} />

        {/* Main layout routes with navigation and sidebar */}
        <Route path="/*" element={
          <>
            <div className='Navigation__Container'>
              <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            </div>
            <main className='Layout__Container'>
              <div className='SideBar__Container'>
                {/* <SideBar isDarkMode={isDarkMode} /> */}
              </div>
              <div className='Content__Container'>
                <div className="main-content">
                  <Routes>
                    <Route path="/" element={<Posting />} />
                    {/* Add other main content routes here */}
                  </Routes>
                </div>
                <div className="right-section">
                  <SideBar isDarkMode={isDarkMode} />
                </div>
              </div>
            </main>
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;
