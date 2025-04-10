import React from 'react';
import { formatPostTime } from '../../../../utils/timeUtils';
import './RepostContent.css';
import PostContent from './PostContent';
import ProfileAvatar from '../../../Home_page/Home_components/ProfileAvatar';
import { FaGlobe, FaUserFriends, FaUserSlash, FaUserPlus, FaLock } from 'react-icons/fa';

// Helper function to format date in "Month Day at Hour:Minutes AM/PM" format
const formatFullPostDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Recently";

  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  }) + ' at ' + date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

const RepostContent = ({ post, isPreview = false }) => {
  // If post is empty or doesn't have originalPost, show error message
  if (!post) {
    return <div className="repost-error">Post data is missing</div>;
  }

  // Log entire post for debugging
  console.debug("Repost content - full post object:", post);

  // Safer handling of missing originalPost
  if (!post.originalPost) {
    return (
      <div className="repost-content repost-error-container">
        <div className="repost-text-container">
          {post.text && <p className="repost-text">{post.text}</p>}
        </div>
        <div className="repost-original-post repost-missing">
          <p className="repost-error-message">
            The original post is no longer available or is still loading.
          </p>
        </div>
      </div>
    );
  }

  // Get the original post data
  const originalPost = post.originalPost;

  // Log originalPost for debugging
  console.debug("Original post object:", originalPost);
  console.debug("Original post user:", originalPost.user);

  // Improved user information extraction with extensive logging and fallbacks
  let originalPoster = "User";
  if (originalPost.user) {
    // Check for Username first
    if (originalPost.user.Username) {
      originalPoster = originalPost.user.Username;
    }
    // Then check for name
    else if (originalPost.user.name) {
      originalPoster = originalPost.user.name;
    }
    // Try lowercase variations if needed
    else if (originalPost.user.username) {
      originalPoster = originalPost.user.username;
    }
    // Final fallback
    else {
      console.warn("User object exists but no name/username found:", originalPost.user);
    }
  } else {
    console.warn("No user object found in original post:", originalPost);
  }

  // Format timestamps with defensive coding
  const shortTime = originalPost.createdAt ? formatPostTime(originalPost.createdAt) : "Recently";
  const fullDateTime = originalPost.createdAt ? formatFullPostDate(originalPost.createdAt) : "Recently";

  // Log the content to debug
  console.debug("Original post text:", originalPost.text);
  console.debug("Original post content:", originalPost.content);

  // Get privacy icon based on privacy setting
  const getPrivacyIcon = (privacy) => {
    switch (privacy) {
      case 'Public': return <FaGlobe size={12} />;
      case 'Friends': return <FaUserFriends size={12} />;
      case 'Friends except...': return <FaUserSlash size={12} />;
      case 'Specific friends': return <FaUserPlus size={12} />;
      default: return <FaLock size={12} />;
    }
  };

  // Check if the post has media with proper null/undefined checks
  const hasMedia = originalPost.media &&
                  originalPost.media.files &&
                  Array.isArray(originalPost.media.files) &&
                  originalPost.media.files.length > 0;

  // Enhance content detection to check more potential locations for content
  const hasContent = originalPost.text ||
                    originalPost.content ||
                    (originalPost.media &&
                     originalPost.media.files &&
                     originalPost.media.files.length > 0) ||
                    // Additional checks for embedded content
                    (originalPost.embeddedContent) ||
                    (originalPost.link);

  // Create fallback content when none is available
  const getFallbackContent = () => {
    // If this is a shared post, use a more descriptive message
    if (post.isRepost || post.originalPost) {
      return (
        <div className="repost-fallback-content">
          <p className="repost-fallback-message">
            This shared post's original content is no longer available or couldn't be loaded.
          </p>
          {originalPost.user && (
            <p className="repost-fallback-attribution">
              Originally posted by {originalPoster}
            </p>
          )}
        </div>
      );
    }

    // Generic fallback for regular posts
    return (
      <p className="repost-no-content-message">
        This post has no content to display.
      </p>
    );
  };

  return (
    <div className="repost-content">
      {/* Repost text (if any) */}
      {post.text && (
        <div className="repost-text-container">
          <p className="repost-text">{post.text}</p>
        </div>
      )}

      {/* Original post container */}
      <div className="repost-original-post">
        {/* Original poster info with more detailed format for dates */}
        <div className="repost-poster-info">
          <ProfileAvatar
            userId={originalPost.user?._id}
            staticImageUrl={originalPost.user?.profilePicture}
            customAltText={originalPoster}
            size="micro"
            className="repost-avatar-small"
          />

          <div className="repost-post-meta">
            <span className="repost-user-name">
              {originalPoster}
            </span>
            <div className="repost-post-details">
              {/* Show full date format (March 27 at 6:16 PM) for better readability */}
              <span className="repost-post-time" title={fullDateTime}>
                {isPreview ? fullDateTime : shortTime}
              </span>
              <span className="repost-privacy-icon">
                {getPrivacyIcon(originalPost.privacy || 'Friends')}
              </span>
            </div>
          </div>
        </div>

        {/* Original content */}
        <div className="repost-original-content">
          {/* Display text if available */}
          {hasContent && !hasMedia && (
            <p className="repost-original-text">{originalPost.text || originalPost.content}</p>
          )}

          {/* If post has media, use PostContent to render everything */}
          {hasMedia && (
            <div className="repost-original-media">
              <PostContent post={originalPost} isPreview={true} />
            </div>
          )}

          {/* Show fallback content when nothing is available */}
          {!hasContent && !hasMedia && (
            getFallbackContent()
          )}
        </div>
      </div>
    </div>
  );
};

export default RepostContent;
