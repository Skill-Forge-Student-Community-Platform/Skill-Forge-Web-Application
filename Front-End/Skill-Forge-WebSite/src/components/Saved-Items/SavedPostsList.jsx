import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterSection from './FilteringSection/FilterSection';
import { FaCalendarAlt, FaImage, FaVideo, FaBookmark, FaEllipsisH,
         FaExternalLinkAlt, FaSearch, FaMoon, FaSun } from 'react-icons/fa';
import postServices from '../../services/postServices';
import { toast } from 'react-hot-toast';
import './SavedPostsList.css';
import { useAuthStore } from '../../store/authStore';
import useThemeToggle from '../../hooks/useThemeToggle';

const SavedPostsList = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { isDarkMode, toggleTheme } = useThemeToggle();

  // Get the theme class
  const themeClass = isDarkMode ? 'dark' : 'light';

  // Fetch saved posts only once on component mount
  useEffect(() => {
    fetchSavedPosts();
  }, []);

  // Apply filters whenever currentFilter or searchTerm or savedPosts change
  useEffect(() => {
    if (savedPosts.length > 0) {
      filterSavedPosts();
    }
  }, [currentFilter, searchTerm, savedPosts]);

  const fetchSavedPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all posts at once, filtering will be done client-side
      const response = await postServices.getSavedPosts(1, 100);
      const posts = response.posts || [];
      setSavedPosts(posts);
      setFilteredPosts(posts); // Initialize filtered posts
    } catch (err) {
      console.error('Error fetching saved posts:', err);
      setError('Failed to load saved posts. Please try again.');
      toast.error('Failed to load saved items');
    } finally {
      setIsLoading(false);
    }
  };

  // Filter posts client-side
  const filterSavedPosts = useCallback(() => {
    let filtered = [...savedPosts];

    // Apply type filter
    if (currentFilter !== 'all') {
      filtered = filtered.filter(post => {
        if (currentFilter === 'events' && post.eventDetails) return true;
        if (currentFilter === 'videos' && post.media?.files?.some(file => file.type === 'video')) return true;
        if (currentFilter === 'photos' && post.media?.files?.some(file => file.type === 'image' || file.type === 'photo')) return true;
        return false;
      });
    }

    // Apply search filter if there's a search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(post =>
        (post.text && post.text.toLowerCase().includes(term)) ||
        (post.eventDetails?.name && post.eventDetails.name.toLowerCase().includes(term)) ||
        (post.user?.Username && post.user.Username.toLowerCase().includes(term))
      );
    }

    setFilteredPosts(filtered);
  }, [currentFilter, searchTerm, savedPosts]);

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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

  // Get formatted date
  const getFormattedDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  // Content rendering - this is the part that changes
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="saved-posts-loading">
          <div className="saved-loading-spinner"></div>
          <p>Loading your saved items...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchSavedPosts}>Try Again</button>
        </div>
      );
    }

    if (filteredPosts.length === 0) {
      return (
        <div className="empty-saved-posts">
          <div className="empty-icon">
            <FaBookmark />
          </div>
          {searchTerm || currentFilter !== 'all' ? (
            <>
              <h2>No matching items found</h2>
              <p>Try adjusting your filters or search term</p>
              <button
                className="reset-filters-btn"
                onClick={() => {
                  setCurrentFilter('all');
                  setSearchTerm('');
                }}
              >
                Reset Filters
              </button>
            </>
          ) : (
            <>
              <h2>No saved items</h2>
              <p>Items you save will appear here. Start browsing content in the community to save items that interest you.</p>
              <button
                className="browse-content-btn"
                onClick={() => navigate(`/${user.role.charAt(0).toUpperCase() + user.role.slice(1)}/${user._id}/home`)}
              >
                Browse Content
              </button>
            </>
          )}
        </div>
      );
    }

    return (
      <>
        <div className="saved-posts-stats">
          <p>Showing {filteredPosts.length} {currentFilter !== 'all' ? currentFilter : 'saved'} items</p>
        </div>
        <div className="saved-posts-grid">
          {filteredPosts.map(post => (
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
                    By {post.user?.Username || "Unknown"}
                  </span>
                  <span className="saved-item-date">
                    {getFormattedDate(post.createdAt)}
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
                    title="Remove from saved items"
                  >
                    <FaBookmark />
                  </button>
                  <button className="more-btn" title="More options">
                    <FaEllipsisH />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  // Main render - this part stays stable
  return (
    <div className={`saved-posts-container ${themeClass}`}>
      {/* This header and filter section stays visible all the time */}
      <div className="saved-posts-header">
        <div className="header-top">
          <h1>Saved Items</h1>
        </div>
        <p>Items you save will be stored here for easy access</p>

        <div className="search-filter-container">
          <div className="search-container">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search saved items..."
              value={searchTerm}
              onChange={handleSearch}
              className="saved-search-input"
            />
          </div>
          <FilterSection
            onFilterChange={handleFilterChange}
            currentFilter={currentFilter}
            theme={themeClass}
          />
        </div>
      </div>

      {/* Only this content section changes when filters are applied */}
      <div className="saved-posts-content">
        {renderContent()}
      </div>
    </div>
  );
};

export default SavedPostsList;
