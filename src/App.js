import './App.css';
import Navbar from './components/Home_page/NavBar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/Home_page/SideBar';
import React, { useState, useEffect } from 'react';
import { initializeTheme, lightTheme, darkTheme, applyTheme } from './utils/Theme';

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
          <div className='SideBar__Container'>
            <SideBar isDarkMode={isDarkMode} />
          </div>
          <div className='NavBar__Container'>
            <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
            <Routes>
              <Route path="/" element={<div>Community Page</div>} />
              <Route path="/dashboard" element={<div>Dashboard Page</div>} />
              <Route path="/friends" element={<div>Friends Page</div>} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
