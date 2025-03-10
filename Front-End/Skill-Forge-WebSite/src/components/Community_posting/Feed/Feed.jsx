import React, { useState } from 'react';
import './Feed.css';
import { FaEllipsisH, FaThumbsUp, FaRegThumbsUp, FaComment, FaShare, FaPaperPlane, FaGlobe, FaUserFriends, FaUserSlash, FaUserPlus } from 'react-icons/fa';
import { formatPostTime } from '../../../utils/timeUtils';
import PostContent from './PostContent';
import RepostContent from './RepostContent';
import CommentSection from './CommentSection';
import { toast } from 'react-hot-toast';

const Feed = ({ posts, onLike, onComment, onShare, onDelete, lastPostRef }) => {
  // Track which posts have open comments
  const [openComments, setOpenComments] = useState({});

  // Toggle comment visibility
  const toggleComments = (postId) => {
    setOpenComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  // Handle like action with optimistic update
  const handleLike = async (postId, isLiked) => {
    try {
      // Call parent handler that uses the API
      await onLike(postId, isLiked);
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  return (
    <div className="feed-container">
      {posts?.map((post, index) => (
        <div
          key={post._id || index}
          className="post-wrapper"
          // Attach the ref to the last post for infinite scrolling
          ref={index === posts.length - 1 ? lastPostRef : null}
        >
          <header className="post-header">
            <div className="user-info">
              <img src={post.user.profilePicture || "/default-avatar.png"} alt={post.user.Username || "User"} className="user-avatar" />
              <div className="post-meta">
                <h3 className="user-name">{post.user.Username || "User"}</h3>
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
            <button className="more-options">
              <FaEllipsisH />
            </button>
          </header>

          <div className="post-container">
            {post.isRepost ? (
              <RepostContent post={post} />
            ) : (
              <PostContent post={post} />
            )}
          </div>

          <div className="action-bar">
            <button
              className={`action-btn ${post.isLikedByUser ? 'active' : ''}`}
              onClick={() => handleLike(post._id, !post.isLikedByUser)}
            >
              {post.isLikedByUser ? <FaThumbsUp /> : <FaRegThumbsUp />} Like
              {post.likes?.length > 0 && <span className="count">({post.likes.length})</span>}
            </button>
            <button
              className="action-btn"
              onClick={() => toggleComments(post._id)}
            >
              <FaComment /> Comment

              {post.comments?.length > 0 && <span className="count">({post.comments.length})</span>}
            </button>
            <button
              className="action-btn"
              onClick={() => onShare(post._id)}
            >
              <FaShare /> Repost
            </button>
            <button className="action-btn">
              <FaPaperPlane /> Send
            </button>
          </div>

          {/* Comment section - only shown when opened */}
          {openComments[post._id] && (
            <CommentSection
              postId={post._id}
              comments={post.comments || []}
              onAddComment={onComment}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Feed;
