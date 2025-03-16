import React, { useState, useRef } from 'react';
import { FaEllipsisH, FaGlobe, FaUserFriends, FaUserSlash, FaUserPlus } from 'react-icons/fa';
import { BiLike, BiSolidLike, BiComment, BiRepost, BiSend } from 'react-icons/bi';
import ProfileAvatar from '../../../../components/Home_page/Home_components/ProfileAvatar';
// Remove the unused import
// import { useUserProfile } from '../../../../hooks/useUserProfile';

import { formatPostTime } from '../../../../utils/timeUtils';
import PostContent from './PostContent';
import RepostContent from './RepostContent';
import CommentSection from '../CommentsSection/CommentSection';
import PostOptionsMenu from './PostOptionsMenu';
import '../Feed.css';
import './PostTemplate.css';

const PostTemplate = ({
  post,
  currentUserId,
  isLastPost = false,
  lastPostRef = null,
  onLike,
  onComment,
  onShare,
  onDelete,
  onEdit,
  onSavePost,
  onChangePrivacy,
  onUnfollow,
  onNotInterested,
  onInterested,
  onReportPost,
  onDeleteComment,
  onMediaClick
}) => {
  // Track if comments are open
  const [showComments, setShowComments] = useState(false);
  // Track if menu is open
  const [showMenu, setShowMenu] = useState(false);
  // Refs for menu interactions
  const menuRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Toggle comment visibility
  const toggleComments = () => {
    setShowComments(prev => !prev);
  };

  // Toggle dropdown menu
  const toggleMenu = (event) => {
    event.stopPropagation();
    setShowMenu(prev => !prev);
  };

  // Close menu
  const closeMenu = () => {
    setShowMenu(false);
  };

  // Handle like action
  const handleLike = async () => {
    try {
      await onLike(post._id, !post.isLikedByUser);
    } catch (error) {
      console.error("Like error:", error);
    }
  };

  // Check if current user is post owner
  const isPostOwner = () => {
    if (!post || !post.user) return false;
    return currentUserId && post.user._id === currentUserId;
  };

  return (
    <div
      className="post-wrapper"
      ref={isLastPost ? lastPostRef : null}
    >
      <header className="post-header">
        <div className="user-info">
          <ProfileAvatar
            userId={post.user?._id} // Use userId directly if available
            staticImageUrl={post.user?.profilePicture} // Fallback to static URL
            customAltText={post.user?.Username || "User"}
            size="small"
            showLevel={false}
            showMembershipTag={false}
            className="post-author-avatar"
          />
          <div className="post-meta">
            <h3 className="user-name">{post.user?.Username || "Guest"}</h3>
            <div className="post-details">
              <span className="post-time">{formatPostTime(post.createdAt)}</span>
              <span className="privacy-icon">
                {post.privacy === "Public" ? <FaGlobe /> :
                 post.privacy === "Friends" ? <FaUserFriends /> :
                 post.privacy === "Friends except..." ? <FaUserSlash /> :
                 <FaUserPlus />}
              </span>
            </div>
          </div>
        </div>
        <div className="options-container">
          <button
            className="more-options"
            ref={menuButtonRef}
            onClick={toggleMenu}
          >
            <FaEllipsisH />
          </button>
          {showMenu && (
            <PostOptionsMenu
              ref={menuRef}
              post={post}
              isPostOwner={isPostOwner()}
              onEditPost={onEdit}
              onDeletePost={onDelete}
              onSavePost={onSavePost}
              onChangePrivacy={onChangePrivacy}
              onUnfollow={onUnfollow}
              onInterested={onInterested}
              onNotInterested={onNotInterested}
              onReportPost={onReportPost}
              onCopyLink={(success) => {
                if (success) {
                  console.log("Link copied successfully");
                }
                closeMenu();
              }}
            />
          )}
        </div>
      </header>

      <div className="post-container" onClick={() => onMediaClick && onMediaClick(post)}>
        {post.isRepost ? (
          <RepostContent post={post} />
        ) : (
          <PostContent post={post} />
        )}
      </div>

      <div className='Post-action-content'>
        {(post.likes?.length > 0 || post.comments?.length > 0 || post.reposts?.length > 0) && (
          <div className="post-stats">
            <div className="left-stats">
              {post.likes?.length > 0 && (
                <div className="likes-count">
                  <span className="emoji-container">
                    <BiSolidLike className="like-emoji" />
                  </span>
                  <span>{post.likes.length}</span>
                </div>
              )}
              {post.comments?.length > 0 && (
                <div className="stat-item">
                  <span>{post.comments.length} comments</span>
                </div>
              )}
            </div>
            <div className="right-stats">
              {post.reposts?.length > 0 && (
                <div className="stat-item">
                  <span>{post.reposts.length} reposts</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="action-bar">
        <button
          className={`action-btn ${post.isLikedByUser ? 'liked' : ''}`}
          onClick={handleLike}
          aria-label={post.isLikedByUser ? "Unlike" : "Like"}
        >
          <div className="action-icon-wrapper">
            {post.isLikedByUser ?
              <BiSolidLike className="action-icon filled" style={{fontSize: '24px', display: 'inline-block'}} /> :
              <BiLike className="action-icon" style={{fontSize: '24px', display: 'inline-block'}} />
            }
          </div>
          <span className="action-text">Like</span>
        </button>

        <button
          className="action-btn"
          onClick={toggleComments}
          aria-label="Comment"
        >
          <div className="action-icon-wrapper">
            <BiComment className="action-icon" style={{fontSize: '24px', display: 'inline-block'}} />
          </div>
          <span className="action-text">Comment</span>
        </button>

        <button
          className="action-btn"
          onClick={() => onShare(post._id)}
          aria-label="Repost"
        >
          <div className="action-icon-wrapper">
            <BiRepost className="action-icon" style={{fontSize: '24px', display: 'inline-block'}} />
          </div>
          <span className="action-text">Repost</span>
        </button>

        <button
          className="action-btn"
          aria-label="Send"
        >
          <div className="action-icon-wrapper">
            <BiSend className="action-icon" style={{fontSize: '24px', display: 'inline-block'}} />
          </div>
          <span className="action-text">Send</span>
        </button>
      </div>

      {/* Comment section - only shown when opened */}
      {showComments && (
        <CommentSection
          postId={post._id}
          comments={post.comments || []}
          onAddComment={onComment}
          onLikeComment={(postId, commentId, isLiked) => onLike(postId, commentId, isLiked)}
          onDeleteComment={onDeleteComment}
          onEditComment={onEdit}
          currentUserId={currentUserId}
          postAuthorId={post.user?._id}
        />
      )}
    </div>
  );
};

export default PostTemplate;
