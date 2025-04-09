import React, { useState, useEffect } from 'react';
import { FaChevronRight, FaUserPlus, FaUsers, FaSpinner } from 'react-icons/fa';
import { UserCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import friendService from '../../../services/friendService';
import ProfileAvatar from './ProfileAvatar';
import './Trending_Data.css';

const Trending_Data = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRequests, setPendingRequests] = useState([]);

  useEffect(() => {
    loadSuggestedUsers();
  }, []);

  const loadSuggestedUsers = async () => {
    try {
      setLoading(true);
      const response = await friendService.getSuggestedFriends();
      // Just get the top 3 for this compact widget
      setSuggestedUsers(response.slice(0, 3));
    } catch (error) {
      console.error("Failed to load user suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFriendRequest = async (userId) => {
    try {
      setPendingRequests(prev => [...prev, userId]);
      await friendService.sendFriendRequest(userId);
      toast.success("Friend request sent successfully!");
    } catch (error) {
      toast.error("Failed to send friend request");
      // Remove from pending if it fails
      setPendingRequests(prev => prev.filter(id => id !== userId));
    }
  };

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

  const goToNetworkPage = () => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length >= 3) {
      const basePath = `/${pathParts[1]}/${pathParts[2]}`;
      navigate(`${basePath}/network`);
    } else {
      navigate('/network');
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
          {loading ? (
            <div className="text-center py-4">
              <FaSpinner className="animate-spin mx-auto text-gray-500" size={20} />
              <p className="text-sm text-gray-500 mt-2">Loading suggestions...</p>
            </div>
          ) : suggestedUsers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No suggestions available right now.</p>
            </div>
          ) : (
            <>
              {suggestedUsers.map(user => (
                <div key={user._id} className="trending-item">
                  <ProfileAvatar
                    userId={user._id}
                    staticImageUrl={user.profilePicture}
                    customAltText={user.Username || "User"}
                    size="tiny"
                    showLevel={false}
                    className="profile-img"
                  />
                  <div className="trending-content">
                    <h4 className="trending-item-title">
                      {user.FirstName && user.LastName
                        ? `${user.FirstName} ${user.LastName}`
                        : user.Username}
                    </h4>
                    <p className="trending-item-desc">
                      {user.role || "Student"}
                      {user.school && ` at ${user.school}`}
                    </p>
                  </div>
                  <button
                    className={`Trending-connect-btn ${pendingRequests.includes(user._id) ? 'pending' : ''}`}
                    onClick={() => handleFriendRequest(user._id)}
                    disabled={pendingRequests.includes(user._id)}
                  >
                    {pendingRequests.includes(user._id) ? (
                      <>
                        <UserCheck size={12} className="mr-1" />
                        Sent
                      </>
                    ) : (
                      <>
                        <FaUserPlus size={12} className="mr-1" />
                        Connect
                      </>
                    )}
                  </button>
                </div>
              ))}

              <button onClick={goToNetworkPage} className="view-more">
                View more
                <FaChevronRight size={12} className="ml-1" />
              </button>
            </>
          )}
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
