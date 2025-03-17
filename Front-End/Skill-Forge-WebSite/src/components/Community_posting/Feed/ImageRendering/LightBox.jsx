import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaThumbsUp, FaComment, FaShare, FaTrash } from 'react-icons/fa';
import CommentSection from '../CommentsSection/CommentSection';
import './LightBox.css';

const LightBox = ({
  media,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  post = null,
  onLike,
  onComment,
  onShare,
  onDelete,
  currentUserId
}) => {
  const currentMedia = media[currentIndex];
  const containerRef = useRef(null);
  const [showComments, setShowComments] = useState(true);

  // Check if current user is the post owner
  const isPostOwner = post && currentUserId && post.user && post.user._id === currentUserId;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
          onPrev();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case 'Escape':
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose, onPrev, onNext]);

  // Detect clicks outside the lightbox content to close
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [onClose]);

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const isImage = currentMedia.type === 'image' || currentMedia.type?.startsWith('image/');

  const handleAddComment = async (postId, text) => {
    try {
      await onComment(postId, text);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  return (
    <div className="lightbox-overlay">
      <button className="lightbox-close" onClick={onClose}>
        <FaTimes />
      </button>

      <div className="lightbox-container">
        {/* Left side - Media */}
        <div className="lightbox-media-container" ref={containerRef}>
          <div className="media-counter">{currentIndex + 1} / {media.length}</div>

          {media.length > 1 && (
            <>
              <button
                className="lightbox-nav lightbox-prev"
                onClick={onPrev}
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>
              <button
                className="lightbox-nav lightbox-next"
                onClick={onNext}
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>
            </>
          )}

          {isImage ? (
            <img
              src={currentMedia.url}
              alt={currentMedia.altText || "Media content"}
              className="lightbox-media"
            />
          ) : (
            <video
              src={currentMedia.url}
              controls
              autoPlay
              className="lightbox-media video"
            />
          )}
        </div>

        {/* Right side - Post details and comments */}
        {post && (
          <div className="lightbox-details">
            {/* Post header */}
            <div className="lightbox-post-header">
              <div className="lightbox-user-info">
                <img
                  src={post.user?.profilePicture || "/default-avatar.png"}
                  alt={post.user?.Username || "User"}
                  className="lightbox-avatar"
                />
                <div>
                  <h3>{post.user?.Username || "User"}</h3>
                  <p className="lightbox-post-time">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* Show delete button if user owns the post */}
              {isPostOwner && onDelete && (
                <button
                  className="lightbox-delete-btn"
                  onClick={() => onDelete(post._id)}
                  title="Delete post"
                >
                  <FaTrash />
                </button>
              )}

              {/* Post text content */}
              {post.text && (
                <div className="lightbox-post-content">
                  <p>{post.text}</p>
                </div>
              )}

              {/* Post actions */}
              <div className="lightbox-post-actions">
                <button
                  className={`lightbox-action-btn ${post.isLikedByUser ? 'active' : ''}`}
                  onClick={() => onLike && onLike(post._id)}
                >
                  <FaThumbsUp />
                  <span>Like{post.likes?.length > 0 ? ` (${post.likes.length})` : ''}</span>
                </button>
                <button
                  className="lightbox-action-btn"
                  onClick={() => setShowComments(!showComments)}
                >
                  <FaComment />
                  <span>Comment{post.comments?.length > 0 ? ` (${post.comments.length})` : ''}</span>
                </button>
                <button
                  className="lightbox-action-btn"
                  onClick={() => onShare && onShare(post._id)}
                >
                  <FaShare />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Comments section */}
            {showComments && (
              <div className="lightbox-comments">
                <CommentSection
                  postId={post._id}
                  comments={post.comments || []}
                  onAddComment={handleAddComment}
                  currentUserId={currentUserId}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LightBox;
