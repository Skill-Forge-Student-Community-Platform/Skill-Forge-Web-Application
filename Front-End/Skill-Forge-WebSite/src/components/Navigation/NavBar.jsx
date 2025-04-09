import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { getMenus } from './MenuList';
import Theme from './shared/Theme';
import DesktopMenu from './shared/DesktopMenu';
import MobileMenu from './shared/MobileMenu';
import TabletMenu from './shared/TabletMenu';
import SearchBar from './shared/SearchBar';
import ProfileDropDown from './shared/ProfiledropDown';
import Notification from '../Notifications/Notification dropdown/Notification';
import SkillForgeBlackLogo from '../../Assets/Skill Forge black.svg';
import SkillForgeWhiteLogo from '../../Assets/Skill Forge white.svg';
import useThemeToggle from '../../hooks/useThemeToggle';
import UserSearch from "./shared/UserSearch";
import './NavBar.css';

const NavBar = ({ user, logout, toggleSidebar, userId, roleType }) => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  // Use our custom hook for theme toggling
  const { isDarkMode, toggleTheme } = useThemeToggle();

  // Base URL for role-based navigation
  const baseUrl = `/${
    roleType.charAt(0).toUpperCase() + roleType.slice(1)
  }/${userId}`;

  // Get menus based on current role and userId
  const Menus = getMenus(roleType, userId);

  // Track scroll position for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Only render content when isDarkMode is determined (no longer null)
  if (isDarkMode === null) {
    return null; // Or a minimal loading state
  }

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Left Section - Logo */}
        <div className="navbar-left">
          <Link to={`${baseUrl}/home`} className="navbar-logo">
             <img
                src={isDarkMode ? SkillForgeWhiteLogo : SkillForgeBlackLogo}
                alt="SkillForge Logo"
                className="h-10 w-auto "
              />
            <h1>SkillForge</h1>
          </Link>
        </div>

        {/* Middle Section - Nav Links */}
        <div className="navbar-middle">
          {/* Main navigation */}
          <div className="nav-menu-container">
            <ul className="nav-links">
              {Menus.map((menu) => (
                <DesktopMenu key={menu.name} menu={menu} />
              ))}
            </ul>
          </div>
        </div>

        {/* Right Section - Search, Theme, Notifications, Profile */}
        <div className="navbar-right">
          {/* Search Bar - Now in the right section */}
          <div className="search-wrapper lg:block md:hidden">
            <SearchBar placeholder="Search friends, events, teams..." />
          </div>

          {/* Theme Toggle */}
          <div
            className="theme-toggle-wrapper"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            <Theme isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
          </div>

          {/* Notification Component */}
          <div className="notification-wrapper">
            <Notification />
          </div>

          {/* Profile Dropdown Component */}
          <ProfileDropDown
            user={user}
            baseUrl={baseUrl}
            onLogout={handleLogout}
            roleType={roleType}
          />

          {/* Tablet navigation - visible on medium screens */}
          <div className="tablet-menu">
            <TabletMenu Menus={Menus} />
          </div>

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
