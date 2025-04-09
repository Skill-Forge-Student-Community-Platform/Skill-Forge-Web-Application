import React, { useState, useEffect, useRef } from 'react';
import { FaChevronLeft, FaChevronRight, FaHeart, FaComment, FaShare, FaBookmark } from 'react-icons/fa';
import ProfileAvatar from '../../Home_page/Home_components/ProfileAvatar';
import './OrganizerPostActivity.css';
// Remove date-fns import
import useUserProfile from '../../../hooks/useUserProfile';

const OrganizerPostActivity = ({ userId, isOwnProfile = false, displayMode = 'vertical' }) => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const sliderRef = useRef(null);

  const { fullName } = useUserProfile(userId);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);

        setTimeout(() => {
          const samplePosts = [
            {
              id: '1',
              authorId: userId,
              authorName: fullName || 'Organization Name',
              content: 'Excited to announce our upcoming hackathon! Join us for 48 hours of coding, innovation, and fun. Great prizes to be won!',
              imageUrl: 'https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
              likes: 42,
              comments: 8,
              shares: 5,
              saved: false
            },
            {
              id: '2',
              authorId: userId,
              authorName: fullName || 'Organization Name',
              content: 'What an amazing turnout at our workshop yesterday! Thank you to all participants and our incredible speakers.',
              imageUrl: 'https://images.unsplash.com/photo-1540317580384-e5d43867caa6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
              timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
              likes: 78,
              comments: 12,
              shares: 9,
              saved: true
            },
            {
              id: '3',
              authorId: userId,
              authorName: fullName || 'Organization Name',
              content: "We're looking for mentors for our upcoming student project showcase. If you're interested in supporting young talent, reach out to us!",
              imageUrl: null,
              timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
              likes: 35,
              comments: 4,
              shares: 2,
              saved: false
            },
            {
              id: '4',
              authorId: userId,
              authorName: fullName || 'Organization Name',
              content: "Check out our new online learning platform! We've added courses on AI, machine learning, and blockchain development.",
              imageUrl: 'https://images.unsplash.com/photo-1594904351111-a072f80b1a71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
              timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
              likes: 56,
              comments: 7,
              shares: 11,
              saved: false
            }
          ];

          setPosts(samplePosts);
          setIsLoading(false);
        }, 1000);

      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts. Please try again.');
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [userId, fullName]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -320, behavior: 'smooth' });
      setScrollPosition(sliderRef.current.scrollLeft - 320);
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 320, behavior: 'smooth' });
      setScrollPosition(sliderRef.current.scrollLeft + 320);
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      setScrollPosition(sliderRef.current.scrollLeft);
    }
  };

  const toggleSavePost = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, saved: !post.saved } : post
    ));
  };

  // Custom date formatting function to replace date-fns
  const formatPostDate = (date) => {
    try {
      const now = new Date();
      const postDate = new Date(date);
      const diffInSeconds = Math.floor((now - postDate) / 1000);

      // Less than a minute
      if (diffInSeconds < 60) {
        return 'just now';
      }

      // Less than an hour
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      if (diffInMinutes < 60) {
        return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
      }

      // Less than a day
      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
      }

      // Less than a week
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
      }

      // Less than a month
      if (diffInDays < 30) {
        const diffInWeeks = Math.floor(diffInDays / 7);
        return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;
      }

      // Format as date string for older dates
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return postDate.toLocaleDateString(undefined, options);
    } catch (err) {
      return 'Recently';
    }
  };

  const createNewPost = () => {
    console.log('Creating a new post...');
  };

  if (isLoading) {
    return (
      <div className="organizer-activity-loading">
        <div className="organizer-activity-spinner"></div>
        <p>Loading posts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="organizer-activity-error">
        <p>{error}</p>
        <button
          className="organizer-retry-btn"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="organizer-activity-empty">
        <div className="organizer-empty-icon">📝</div>
        <h3>No Posts Yet</h3>
        <p>Share updates, announcements, or insights about your events and organization</p>
        {isOwnProfile && (
          <button
            className="organizer-create-post-btn"
            onClick={createNewPost}
          >
            Create Your First Post
          </button>
        )}
      </div>
    );
  }

  const showSliderControls = displayMode === 'horizontal-slider' && posts.length > 1;
  const isAtStart = scrollPosition <= 10;
  const hasMoreContent = sliderRef.current ?
    scrollPosition < sliderRef.current.scrollWidth - sliderRef.current.clientWidth - 10 : true;

  return (
    <div className={`organizer-activity-container ${displayMode === 'horizontal-slider' ? 'organizer-activity-slider-mode' : ''}`}>
      {isOwnProfile && (
        <div className="organizer-post-creation">
          <button className="organizer-create-post-button" onClick={createNewPost}>
            <span className="organizer-post-icon">+</span>
            <span>Create Post</span>
          </button>
        </div>
      )}

      <div className="organizer-posts-container">
        {showSliderControls && (
          <>
            <button
              className={`organizer-slider-nav organizer-slider-prev ${isAtStart ? 'organizer-slider-nav-hidden' : ''}`}
              onClick={scrollLeft}
              aria-label="Previous posts"
            >
              <FaChevronLeft />
            </button>

            <button
              className={`organizer-slider-nav organizer-slider-next ${!hasMoreContent ? 'organizer-slider-nav-hidden' : ''}`}
              onClick={scrollRight}
              aria-label="Next posts"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        <div
          className={`organizer-posts-list ${displayMode === 'horizontal-slider' ? 'organizer-posts-slider' : ''}`}
          ref={sliderRef}
          onScroll={handleScroll}
        >
          {posts.map(post => (
            <div
              key={post.id}
              className="organizer-post-card"
            >
              <div className="organizer-post-header">
                <div className="organizer-post-author">
                  <ProfileAvatar
                    userId={post.authorId}
                    size="small"
                    showLevel={false}
                  />
                  <div className="organizer-post-meta">
                    <h3 className="organizer-post-author-name">{post.authorName}</h3>
                    <span className="organizer-post-date">{formatPostDate(post.timestamp)}</span>
                  </div>
                </div>
              </div>

              <div className="organizer-post-content">
                <p>{post.content}</p>
              </div>

              {post.imageUrl && (
                <div className="organizer-post-media">
                  <img
                    src={post.imageUrl}
                    alt="Post attachment"
                    className="organizer-post-image"
                  />
                </div>
              )}

              <div className="organizer-post-stats">
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
              </div>

              <div className="organizer-post-actions">
                <button className="organizer-post-action-btn">
                  <FaHeart className="organizer-action-icon" />
                  <span>Like</span>
                </button>

                <button className="organizer-post-action-btn">
                  <FaComment className="organizer-action-icon" />
                  <span>Comment</span>
                </button>

                <button className="organizer-post-action-btn">
                  <FaShare className="organizer-action-icon" />
                  <span>Share</span>
                </button>

                <button
                  className={`organizer-post-action-btn ${post.saved ? 'organizer-post-action-active' : ''}`}
                  onClick={() => toggleSavePost(post.id)}
                >
                  <FaBookmark className="organizer-action-icon" />
                  <span>{post.saved ? 'Saved' : 'Save'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrganizerPostActivity;
