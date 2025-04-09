import React from 'react';
import { FaChevronRight, FaUserPlus, FaUsers } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import './Trending_Data.css';

const Trending_Data = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleViewAllEvents = () => {
    // Extract the base path (e.g., /Student/67ea8e1551c9a3f0fa4dad0d)
    const pathParts = location.pathname.split('/');
    if (pathParts.length >= 3) {
      // Construct the correct path preserving the role and userId
      const basePath = `/${pathParts[1]}/${pathParts[2]}`; // e.g., /Student/67ea8e1551c9a3f0fa4dad0d
      navigate(`${basePath}/view-events`);
    } else {
      // Fallback in case the path structure is different
      navigate('view-events');
    }
  };

  return (
    <div className="space-y-4">
      {/* Trending events section */}
      <div className="trending-card">
        <h3 className="trending-title">
          <span className="mr-2">🔥</span>
          Trending Events
        </h3>
        <div className="trending-list">
          {/* Event cards */}
          <div className="trending-item">
            <div className="date-badge">
              <span className="text-xs font-medium">JUL</span>
              <span className="text-lg font-bold">24</span>
            </div>
            <div className="trending-content">
              <h4 className="trending-item-title">Web Development Workshop</h4>
              <p className="trending-item-desc">Learn the latest technologies in web development</p>
              <div className="trending-meta">
                <FaUsers className="meta-text mr-1" />
                <span className="meta-text">120 attending</span>
              </div>
            </div>
          </div>

          <div className="trending-item">
            <div className="date-badge">
              <span className="text-xs font-medium">AUG</span>
              <span className="text-lg font-bold">05</span>
            </div>
            <div className="trending-content">
              <h4 className="trending-item-title">Data Science Summit</h4>
              <p className="trending-item-desc">Explore the world of data analysis</p>
              <div className="trending-meta">
                <FaUsers className="meta-text mr-1" />
                <span className="meta-text">85 attending</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleViewAllEvents}
            className="view-more"
          >
            View all events
            <FaChevronRight size={12} className="ml-1" />
          </button>
        </div>
      </div>

      {/* People you may know section */}
      <div className="trending-card">
        <h3 className="trending-title">
          People you may know
        </h3>
        <div className="trending-list">
          <div className="trending-item">
            <div className="profile-img bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center justify-center text-white font-medium text-sm">
              JS
            </div>
            <div className="trending-content">
              <h4 className="trending-item-title">John Smith</h4>
              <p className="trending-item-desc">Software Engineer at Tech Co</p>
            </div>
            <button className="connect-btn">
              <FaUserPlus size={12} className="mr-1" />
              Connect
            </button>
          </div>

          <div className="trending-item">
            <div className="profile-img bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center text-white font-medium text-sm">
              AD
            </div>
            <div className="trending-content">
              <h4 className="trending-item-title">Amy Davis</h4>
              <p className="trending-item-desc">UX Designer at Design Studio</p>
            </div>
            <button className="connect-btn">
              <FaUserPlus size={12} className="mr-1" />
              Connect
            </button>
          </div>

          <div className="trending-item">
            <div className="profile-img bg-gradient-to-r from-green-400 to-teal-500 flex items-center justify-center text-white font-medium text-sm">
              MJ
            </div>
            <div className="trending-content">
              <h4 className="trending-item-title">Mark Johnson</h4>
              <p className="trending-item-desc">Web Developer at Creative Inc</p>
            </div>
            <button className="connect-btn">
              <FaUserPlus size={12} className="mr-1" />
              Connect
            </button>
          </div>

          <a href="/network" className="view-more">
            View more
            <FaChevronRight size={12} className="ml-1" />
          </a>
        </div>
      </div>

      {/* Learning resources section */}
      <div className="trending-card">
        <h3 className="trending-title">
          Learning Resources
        </h3>
        <div className="trending-list">
          <a href="/courses" className="trending-item">
            <div className="resource-icon bg-blue-50 text-blue-600">
              📚
            </div>
            <span className="trending-item-title">Explore Courses</span>
          </a>
          <a href="/webinars" className="trending-item">
            <div className="resource-icon bg-purple-50 text-purple-600">
              🎥
            </div>
            <span className="trending-item-title">Upcoming Webinars</span>
          </a>
          <a href="/articles" className="trending-item">
            <div className="resource-icon bg-green-50 text-green-600">
              📝
            </div>
            <span className="trending-item-title">Featured Articles</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Trending_Data;
