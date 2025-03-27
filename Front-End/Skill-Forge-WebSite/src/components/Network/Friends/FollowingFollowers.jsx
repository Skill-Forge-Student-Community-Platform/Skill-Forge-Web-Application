import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, UserMinus, Search, Loader, UserCheck } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import friendService from '../../../services/friendService';
import { toast } from 'react-hot-toast';
import './FollowingFollowers.css';

const FollowingFollowers = () => {
  const [activeTab, setActiveTab] = useState('following');
  const [following, setFollowing] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const [loadingFollowers, setLoadingFollowers] = useState(false);
  const [errorFollowing, setErrorFollowing] = useState(null);
  const [errorFollowers, setErrorFollowers] = useState(null);
  const [processingUsers, setProcessingUsers] = useState({});
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === 'following') {
      loadFollowing();
    } else {
      loadFollowers();
    }
  }, [activeTab]);

  const loadFollowing = async () => {
    if (loadingFollowing) return;

    try {
      setLoadingFollowing(true);
      setErrorFollowing(null);
      const data = await friendService.getFollowing(user._id);
      setFollowing(data);
    } catch (error) {
      console.error('Error loading following:', error);
      setErrorFollowing(error.message || 'Failed to load following');
      toast.error('Could not load following list');
    } finally {
      setLoadingFollowing(false);
    }
  };

  const loadFollowers = async () => {
    if (loadingFollowers) return;

    try {
      setLoadingFollowers(true);
      setErrorFollowers(null);
      const data = await friendService.getFollowers(user._id);
      setFollowers(data);
    } catch (error) {
      console.error('Error loading followers:', error);
      setErrorFollowers(error.message || 'Failed to load followers');
      toast.error('Could not load followers list');
    } finally {
      setLoadingFollowers(false);
    }
  };

  const handleFollow = async (userId) => {
    try {
      setProcessingUsers(prev => ({ ...prev, [userId]: 'following' }));
      await friendService.followUser(userId);

      // Update UI to show user is now followed
      if (activeTab === 'following') {
        setFollowing(prev => prev.map(user =>
          user._id === userId ? { ...user, isFollowedByMe: true } : user
        ));
      } else {
        setFollowers(prev => prev.map(user =>
          user._id === userId ? { ...user, isFollowedByMe: true } : user
        ));
      }

      toast.success('Successfully followed user');
    } catch (error) {
      console.error('Error following user:', error);
      toast.error(error.message || 'Failed to follow user');
    } finally {
      setProcessingUsers(prev => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  const handleUnfollow = async (userId) => {
    try {
      setProcessingUsers(prev => ({ ...prev, [userId]: 'unfollowing' }));
      await friendService.unfollowUser(userId);

      // Update UI to show user is now unfollowed
      if (activeTab === 'following') {
        setFollowing(prev => prev.map(user =>
          user._id === userId ? { ...user, isFollowedByMe: false } : user
        ));
      } else {
        setFollowers(prev => prev.map(user =>
          user._id === userId ? { ...user, isFollowedByMe: false } : user
        ));
      }

      toast.success('Successfully unfollowed user');
    } catch (error) {
      console.error('Error unfollowing user:', error);
      toast.error(error.message || 'Failed to unfollow user');
    } finally {
      setProcessingUsers(prev => {
        const newState = { ...prev };
        delete newState[userId];
        return newState;
      });
    }
  };

  const goToProfile = (userId) => {
    if (user.role) {
      const rolePath = user.role.charAt(0).toUpperCase() + user.role.slice(1);
      navigate(`/${rolePath}/${user._id}/profile/${userId}`);
    } else {
      navigate(`/profile/${userId}`);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const retryLoad = () => {
    if (activeTab === 'following') {
      loadFollowing();
    } else {
      loadFollowers();
    }
  };

  // Filter users based on search term
  const filteredUsers = activeTab === 'following'
    ? following.filter(user =>
        user.Username?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm))
    : followers.filter(user =>
        user.Username?.toLowerCase().includes(searchTerm) ||
        user.email?.toLowerCase().includes(searchTerm));

  // Error display for each tab
  const renderError = () => {
    const error = activeTab === 'following' ? errorFollowing : errorFollowers;

    if (!error) return null;

    return (
      <div className="error-container">
        <p className="error-message">{error}</p>
        <button className="retry-button" onClick={retryLoad}>
          Retry
        </button>
      </div>
    );
  };

  return (
    <div className="following-followers-container">
      <div className="tabs">
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

      <div className="following-search-container">
        <div className="search-input-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder={`Search ${activeTab}`}
            value={searchTerm}
            onChange={handleSearch}
            className="following-search-input"
          />
        </div>
      </div>

      <div className="user-list">
        {/* Loading states */}
        {(activeTab === 'following' && loadingFollowing) || (activeTab === 'followers' && loadingFollowers) ? (
          <div className="loading-container">
            <Loader size={24} className="spinner" />
            <p>Loading {activeTab}...</p>
          </div>
        ) : renderError() ? (
          renderError()
        ) : filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div key={user._id} className="user-card">
              <div className="user-info" onClick={() => goToProfile(user._id)}>
                <img
                  src={user.profilePicture || "/assets/default-avatar.png"}
                  alt={user.Username}
                  className="user-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/assets/default-avatar.png";
                  }}
                />
                <div className="user-details">
                  <h3 className="user-name">{user.Username}</h3>
                  <p className="user-role">{user.role}</p>
                </div>
              </div>
              <div className="action-buttons">
                {user.isFollowedByMe ? (
                  <button
                    className="unfollow-btn"
                    onClick={() => handleUnfollow(user._id)}
                    disabled={processingUsers[user._id]}
                  >
                    {processingUsers[user._id] === 'unfollowing' ? (
                      <Loader size={16} className="spinner-sm" />
                    ) : (
                      <>
                        <UserMinus size={16} />
                        <span>Unfollow</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    className="follow-btn"
                    onClick={() => handleFollow(user._id)}
                    disabled={processingUsers[user._id]}
                  >
                    {processingUsers[user._id] === 'following' ? (
                      <Loader size={16} className="spinner-sm" />
                    ) : (
                      <>
                        <UserPlus size={16} />
                        <span>Follow</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No {activeTab} to display</p>
            {activeTab === 'following' ? (
              <button
                className="find-people-btn"
                onClick={() => navigate('/network')}
              >
                Find people to follow
              </button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowingFollowers;
