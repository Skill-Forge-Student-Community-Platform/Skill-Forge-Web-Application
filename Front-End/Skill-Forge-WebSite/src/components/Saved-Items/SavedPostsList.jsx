import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSection from './FilteringSection/FilterSection';
import { FaCalendarAlt, FaImage, FaVideo, FaArrowLeft, FaExternalLinkAlt, FaBookmark, FaEllipsisH } from 'react-icons/fa';
import postServices from '../../services/postServices';
import { toast } from 'react-hot-toast';
import './SavedPostsList.css';
import { useAuthStore } from '../../store/authStore';

const SavedPostsList = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchSavedPosts();
  }, [currentFilter]);

  const fetchSavedPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use the postServices to fetch saved posts
      const response = await postServices.getSavedPosts(1, 50, currentFilter);
      setSavedPosts(response.posts || []);
    } catch (err) {
      console.error('Error fetching saved posts:', err);
      setError('Failed to load saved posts. Please try again.');
      toast.error('Failed to load saved items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  // Handle unsaving a post
  const handleUnsavePost = async (postId) => {
    try {
      await postServices.savePost(postId); // Toggle saved status

      // Update local state to remove the post
      setSavedPosts(prevPosts => prevPosts.filter(post => post._id !== postId));

      toast.success('Item removed from saved items');
    } catch (error) {
      console.error('Error removing saved post:', error);
      toast.error('Failed to remove item');
    }
  };

  // Function to determine media type icon
  const getContentTypeIcon = (post) => {
    if (post.eventDetails) {
      return <FaCalendarAlt className="content-type-icon event" />;
    } else if (post.media && post.media.files) {
      const mediaFiles = post.media.files;
      const hasVideo = mediaFiles.some(file => file.type === 'video');
      return hasVideo ?
        <FaVideo className="content-type-icon video" /> :
        <FaImage className="content-type-icon image" />;
    }
    return null;
  };

  // Function to determine category label
  const getCategoryLabel = (post) => {
    if (post.eventDetails) return 'Event';
    if (post.media && post.media.files) {
      const mediaFiles = post.media.files;
      const hasVideo = mediaFiles.some(file => file.type === 'video');
      return hasVideo ? 'Video' : 'Photo';
    }
    return 'Post';
  };

  // Navigate to post
  const navigateToPost = (post) => {
    const baseUrl = `/${user.role.charAt(0).toUpperCase() + user.role.slice(1)}/${user._id}/home`;
    navigate(`${baseUrl}?post=${post._id}`);
  };

  if (isLoading) {
    return (
      <div className="saved-posts-container">
        <div className="saved-posts-header">
          <h1>Saved Items</h1>
        </div>
        <div className="saved-posts-loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="saved-posts-container">
        <div className="saved-posts-header">
          <h1>Saved Items</h1>
        </div>
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchSavedPosts}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-posts-container">
      <div className="saved-posts-header">
        <h1>Saved Items</h1>
        <p>Items you save will be stored here for easy access</p>
      </div>

      {/* Filter section */}
      <FilterSection onFilterChange={handleFilterChange} />

      {/* Content List */}
      {savedPosts.length === 0 ? (
        <div className="empty-saved-posts">
          <div className="empty-icon">
            <FaBookmark />
          </div>
          <h2>No saved items</h2>
          <p>Items you save will appear here. Start browsing content in the community to save items that interest you.</p>
          <button
            className="browse-content-btn"
            onClick={() => navigate(`/${user.role.charAt(0).toUpperCase() + user.role.slice(1)}/${user._id}/home`)}
          >
            Browse Content
          </button>
        </div>
      ) : (
        <div className="saved-posts-grid">
          {savedPosts.map(post => (
            <div key={post._id} className="saved-item-card">
              {/* Media Preview */}
              <div
                className="saved-item-media"
                onClick={() => navigateToPost(post)}
              >
                {post.media && post.media.files && post.media.files.length > 0 ? (
                  post.media.files[0].type === 'video' ? (
                    <video src={post.media.files[0].url} className="saved-item-preview" />
                  ) : (
                    <img src={post.media.files[0].url} alt="Post media" className="saved-item-preview" />
                  )
                ) : (
                  <div className="saved-item-no-media">
                    {getContentTypeIcon(post)}
                  </div>
                )}
                <span className="content-type-label">{getCategoryLabel(post)}</span>
              </div>

              {/* Item Content */}
              <div className="saved-item-content">
                <h3 className="saved-item-title" onClick={() => navigateToPost(post)}>
                  {post.eventDetails ? post.eventDetails.name : (post.text || "No content")}
                </h3>

                <div className="saved-item-meta">
                  <span className="saved-item-author">
                    Saved from {post.user?.Username || "Unknown"}'s post
                  </span>
                  <span className="saved-item-date">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="saved-item-actions">
                  <button
                    className="view-btn"
                    onClick={() => navigateToPost(post)}
                  >
                    <FaExternalLinkAlt /> View
                  </button>
                  <button
                    className="unsave-btn"
                    onClick={() => handleUnsavePost(post._id)}
                  >
                    <FaBookmark /> Unsave
                  </button>
                  <button className="more-btn">
                    <FaEllipsisH />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedPostsList;
