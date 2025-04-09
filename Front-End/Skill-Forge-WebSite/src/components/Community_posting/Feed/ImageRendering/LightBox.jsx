import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaChevronLeft, FaChevronRight, FaThumbsUp, FaComment, FaShare, FaTrash } from 'react-icons/fa';
import CommentSection from '../CommentsSection/CommentSection';
import ProfileAvatar from '../../../Home_page/Home_components/ProfileAvatar';
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
  onLikeComment,
  onDeleteComment,
  currentUserId
}) => {
  const currentMedia = media[currentIndex];
  const mediaContainerRef = useRef(null);
  const detailsContainerRef = useRef(null);
  const lightboxContainerRef = useRef(null);
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

  // Critical: Only close when clicking on the actual overlay background
  const handleOverlayClick = (e) => {
    // Only close if the click is directly on the overlay element
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent scrolling when lightbox is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const isImage = currentMedia.type === 'image' || currentMedia.type?.startsWith('image/');

  const handleAddComment = async (postId, text, parentId = null) => {
    try {
      console.log("Adding comment from lightbox:", text, "parent:", parentId);
      await onComment(postId, text, parentId);
    } catch (error) {
      console.error('Failed to add comment:', error);
    }
  };

  // Handle comment like from the lightbox
  const handleLikeComment = async (postId, commentId, isLiked) => {
    try {
      await onLikeComment(postId, commentId, isLiked);
    } catch (error) {
      console.error('Failed to like/unlike comment:', error);
    }
  };

  return (
    <div className="lightbox-overlay" onClick={handleOverlayClick}>
      <button
        className="lightbox-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <FaTimes />
      </button>

      <div
        className="lightbox-container"
        ref={lightboxContainerRef}
        onClick={(e) => e.stopPropagation()} // Stop propagation for all container clicks
      >
        {/* Left side - Media */}
        <div className="lightbox-media-container" ref={mediaContainerRef}>
          <div className="media-counter">{currentIndex + 1} / {media.length}</div>

          {media.length > 1 && (
            <>
              <button
                className="lightbox-nav lightbox-prev"
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>
              <button
                className="lightbox-nav lightbox-next"
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
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
              onClick={(e) => e.stopPropagation()} // Stop propagation for video controls
            />
          )}
        </div>

        {/* Right side - Post details and comments */}
        {post && (
          <div
            className="lightbox-details"
            ref={detailsContainerRef}
            onClick={(e) => e.stopPropagation()} // Stop propagation for all details clicks
          >
            {/* Post header */}
            <div className="lightbox-post-header">
              <div className="lightbox-user-info">
                <ProfileAvatar
                  userId={post.user?._id}
                  staticImageUrl={post.user?.profilePicture}
                  customAltText={post.user?.Username || "User"}
                  size="small"
                  showLevel={false}
                  showMembershipTag={false}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(post._id);
                    onClose(); // Close lightbox after deletion
                  }}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onLike && onLike(post._id);
                  }}
                >
                  <FaThumbsUp />
                  <span>Like{post.likes?.length > 0 ? ` (${post.likes.length})` : ''}</span>
                </button>
                <button
                  className="lightbox-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowComments(!showComments);
                  }}
                >
                  <FaComment />
                  <span>Comment{post.comments?.length > 0 ? ` (${post.comments.length})` : ''}</span>
                </button>
                <button
                  className="lightbox-action-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onShare && onShare(post._id);
                  }}
                >
                  <FaShare />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Comments section */}
            {showComments && (
              <div
                className="lightbox-comments"
                onClick={(e) => e.stopPropagation()} // Extra protection for comments area
              >
                <CommentSection
                  postId={post._id}
                  comments={post.comments || []}
                  onAddComment={handleAddComment}
                  onLikeComment={handleLikeComment}
                  onDeleteComment={onDeleteComment}
                  currentUserId={currentUserId}
                  postAuthorId={post.user?._id}
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
