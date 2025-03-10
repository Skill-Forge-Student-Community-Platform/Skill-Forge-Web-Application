import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Bell } from 'lucide-react';
import { getMenus } from './MenuList';
import Theme from './shared/Theme';
import DesktopMenu from './shared/DesktopMenu';
import MobileMenu from './shared/MobileMenu';
import SearchBar from './shared/SearchBar';
import ProfileDropDown from './shared/ProfiledropDown';
import './NavBar.css';

const NavBar = ({ isDarkMode, toggleTheme, user, logout, toggleSidebar, userId, roleType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Base URL for role-based navigation
  const baseUrl = `/${roleType.charAt(0).toUpperCase() + roleType.slice(1)}/${userId}`;

  // Get menus based on current role and userId
  const Menus = getMenus(roleType, userId);

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleSidebar = () => {
    toggleSidebar();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Left Section - Logo and Toggle */}
        <div className="navbar-left">
          <button
            onClick={handleToggleSidebar}
            className="sidebar-toggle"
            aria-label="Toggle sidebar"
          >
            {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <Link to={`${baseUrl}/home`} className="navbar-logo">
            <h1>SkillForge</h1>
          </Link>
        </div>

        {/* Middle Section - Nav Links and Search */}
        <div className="navbar-middle">
          {/* Main navigation */}
          <div className="nav-menu-container">
            <ul className="nav-links">
              {Menus.map((menu) => (
                <DesktopMenu key={menu.name} menu={menu} />
              ))}
            </ul>
          </div>

          {/* Search Bar */}
          <div className="search-wrapper">
            <SearchBar placeholder="Search courses, events, teams..." />
          </div>
        </div>

        {/* Right Section */}
        <div className="navbar-right">
          {/* Theme Toggle */}
          <div className="theme-toggle-wrapper" title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <Theme isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </div>

          {/* Notification Icon */}
          <div className="notification-wrapper">
            <button className="notification-button" aria-label="Notifications">
              <Bell size={20} />
              <span className="notification-indicator"></span>
            </button>
          </div>

          {/* Profile Dropdown Component */}
          <ProfileDropDown
            user={user}
            baseUrl={baseUrl}
            onLogout={handleLogout}
            roleType={roleType}
          />

          {/* Mobile Menu Button - visible on smaller screens */}
          <div className="mobile-menu">
            <MobileMenu Menus={Menus} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
