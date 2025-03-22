import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useAuthStore } from '../../../store/authStore';
import './FollowingFollowers.css';

// Helper function to get auth headers
const getAuthHeaders = () => ({
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const BASE_URL = 'http://localhost:5000/api';

const FollowingFollowers = () => {
  const [activeTab, setActiveTab] = useState('following');
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState([]);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
  }, [activeTab]);

  const fetchConnections = async () => {
    try {
      setLoading(true);

      if (activeTab === 'following') {
        // Fetch users that the current user is following
        const response = await axios.get(`${BASE_URL}/users/${user._id}/following`, getAuthHeaders());
        setFollowing(response.data || []);
      } else {
        // Fetch users that follow the current user
        const response = await axios.get(`${BASE_URL}/users/${user._id}/followers`, getAuthHeaders());
        setFollowers(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching connections:', error);
      toast.error('Failed to load connections');
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      setProcessingIds(prev => [...prev, userId]);
      await axios.post(`${BASE_URL}/users/follow/${userId}`, {}, getAuthHeaders());

      if (activeTab === 'followers') {
        // Update UI to show user is now followed
        setFollowers(prev =>
          prev.map(user =>
            user._id === userId ? { ...user, isFollowedByMe: true } : user
          )
        );
      }

      toast.success('User followed successfully');
    } catch (error) {
      console.error('Error following user:', error);
      toast.error('Failed to follow user');
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== userId));
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      setProcessingIds(prev => [...prev, userId]);
      await axios.post(`${BASE_URL}/users/follow/${userId}`, {}, getAuthHeaders());

      // Remove user from following list
      if (activeTab === 'following') {
        setFollowing(prev => prev.filter(user => user._id !== userId));
      }

      toast.success('User unfollowed successfully');
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error('Failed to unfollow user');
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== userId));
    }
  };

  const goToProfile = (userId) => {
    // Navigate to user profile based on role
    if (user.role) {
      const rolePath = user.role.charAt(0).toUpperCase() + user.role.slice(1);
      navigate(`/${rolePath}/${user._id}/profile/${userId}`);
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  // Render empty state
  const renderEmptyState = () => (
    <div className="empty-state-container">
      <div className="empty-state-icon">
        {activeTab === 'following' ? '👀' : '👥'}
      </div>
      <h3 className="empty-state-title">
        {activeTab === 'following'
          ? "You're not following anyone yet"
          : "You don't have any followers yet"}
      </h3>
      <p className="empty-state-text">
        {activeTab === 'following'
          ? "When you follow someone, you'll see them here"
          : "When someone follows you, they'll appear here"}
      </p>
      {activeTab === 'following' && (
        <button
          className="empty-state-button"
          onClick={() => navigate('/network')}
        >
          Find people to follow
        </button>
      )}
    </div>
  );

  return (
    <div className="friends-tabs">
      <div className="tabs-header">
        <button
          className={`tab ${activeTab === 'following' ? 'active' : ''}`}
          onClick={() => setActiveTab('following')}
        >
          Following
        </button>
        <button
          className={`tab ${activeTab === 'followers' ? 'active' : ''}`}
          onClick={() => setActiveTab('followers')}
        >
          Followers
        </button>
      </div>

      <div className="tabs-content">
        {loading ? (
          <div className="flex justify-center my-8">
            <div className="loader"></div>
          </div>
        ) : activeTab === 'following' ? (
          <div className="friend-list">
            {following.length > 0 ? (
              following.map((person) => (
                <div key={person._id} className="friend-card connection-card">
                  <div className="flex items-center cursor-pointer" onClick={() => goToProfile(person._id)}>
                    <img
                      src={person.profilePicture || "https://via.placeholder.com/50"}
                      alt={person.Username}
                      className="friend-avatar"
                    />
                    <div className="friend-info">
                      <h3 className="friend-name">{person.Username}</h3>
                      <p className="friend-role">{person.role}</p>
                    </div>
                  </div>
                  <button
                    className="message-btn"
                    onClick={() => handleUnfollow(person._id)}
                    disabled={processingIds.includes(person._id)}
                  >
                    {processingIds.includes(person._id) ? 'Processing...' : 'Unfollow'}
                  </button>
                </div>
              ))
            ) : renderEmptyState()}
          </div>
        ) : (
          <div className="friend-list">
            {followers.length > 0 ? (
              followers.map((person) => (
                <div key={person._id} className="friend-card connection-card">
                  <div className="flex items-center cursor-pointer" onClick={() => goToProfile(person._id)}>
                    <img
                      src={person.profilePicture || "https://via.placeholder.com/50"}
                      alt={person.Username}
                      className="friend-avatar"
                    />
                    <div className="friend-info">
                      <h3 className="friend-name">{person.Username}</h3>
                      <p className="friend-role">{person.role}</p>
                    </div>
                  </div>
                  {!person.isFollowedByMe ? (
                    <button
                      className="message-btn"
                      onClick={() => handleFollow(person._id)}
                      disabled={processingIds.includes(person._id)}
                    >
                      {processingIds.includes(person._id) ? 'Processing...' : 'Follow Back'}
                    </button>
                  ) : (
                    <span className="mutual-follow-badge">
                      Mutual
                    </span>
                  )}
                </div>
              ))
            ) : renderEmptyState()}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingFollowers;
