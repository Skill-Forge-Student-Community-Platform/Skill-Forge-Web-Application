import React, { useState } from 'react'
import './SideBar.css'
import { Link, useLocation } from 'react-router-dom'
import { MdDashboard, MdEvent, MdBookmark } from 'react-icons/md'
import { FaUsers, FaTrophy, FaInbox, FaCog } from 'react-icons/fa'

const SideBar = () => {
  const location = useLocation();
  // Initialize with empty string instead of location.pathname
  const [activeLink, setActiveLink] = useState('');

  const handleLinkClick = (path) => {
    setActiveLink(path);
  };

  return (
    <div className='SideBar'>
      <h1 className='Application_Logo'>Skill Forge</h1>

      <div className="SideLink_container1">
        <Link
          to="/dashboard"
          className={`side-link ${activeLink === '/dashboard' ? 'active' : ''}`}
          onClick={() => handleLinkClick('/dashboard')}
        >
          <MdDashboard /> <span>Dashboard</span>
        </Link>
        <Link
          to="/friends"
          className={`side-link ${activeLink === '/friends' ? 'active' : ''}`}
          onClick={() => handleLinkClick('/friends')}
        >
          <FaUsers /> <span>Friends</span>
        </Link>
        <Link
          to="/events"
          className={`side-link ${activeLink === '/events' ? 'active' : ''}`}
          onClick={() => handleLinkClick('/events')}
        >
          <MdEvent /> <span>Events</span>
        </Link>
        <Link
          to="/saved"
          className={`side-link ${activeLink === '/saved' ? 'active' : ''}`}
          onClick={() => handleLinkClick('/saved')}
        >
          <MdBookmark /> <span>Saved Items</span>
        </Link>
      </div>

      <div className="SideLink_container2">
        <Link
          to="/leaderboard"
          className={`side-link ${activeLink === '/leaderboard' ? 'active' : ''}`}
          onClick={() => handleLinkClick('/leaderboard')}
        >
          <FaTrophy /> <span>Leaderboard</span>
        </Link>
        <Link
          to="/inbox"
          className={`side-link ${activeLink === '/inbox' ? 'active' : ''}`}
          onClick={() => handleLinkClick('/inbox')}
        >
          <FaInbox /> <span>Inbox</span>
        </Link>
        <Link
          to="/settings"
          className={`side-link ${activeLink === '/settings' ? 'active' : ''}`}
          onClick={() => handleLinkClick('/settings')}
        >
          <FaCog /> <span>Settings</span>
        </Link>
      </div>

      <div className="Quick_statistics">
        <h3>Quick Statistics</h3>
        {/* Content will be added later */}
      </div>
    </div>
  )
}

export default SideBar
