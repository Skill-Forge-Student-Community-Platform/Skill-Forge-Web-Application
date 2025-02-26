import './App.css';
import Navbar from './components/Home_page/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/Home_page/SideBar';
import React, { useState, useEffect } from 'react';
import { initializeTheme, lightTheme, darkTheme, applyTheme } from './utils/Theme';
import Posting from './components/Community_posting/Posting';

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
    <Router>
      <div className="App">
        <div className='Navigation__Container'>
          <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
        </div>
        <main className='Layout__Container'>
          <div className='SideBar__Container'>
            {/* <SideBar isDarkMode={isDarkMode} /> */}
          </div>
          <div className='Content__Container'>
            <div className="main-content">
              <Posting />
            </div>
            <div className="right-section">
              {/* Right section content */}
              <SideBar isDarkMode={isDarkMode} />
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;
