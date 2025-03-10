import React, { useState } from 'react';
import { formatPostTime } from '../../../utils/timeUtils';
import './CommentSection.css';

const CommentSection = ({ postId, comments = [], onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onAddComment(postId, newComment);
      setNewComment(''); // Clear input on success
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="comment-section">
      {/* Render existing comments */}
      <div className="comments-list">
        {comments.map((comment, index) => (
          <div key={comment._id || index} className="comment">
            <img
              src={comment.user.profilePicture || "/default-avatar.png"}
              alt="User"
              className="comment-avatar"
            />
            <div className="comment-content">

              <div className="comment-header">
                <span className="comment-author">{comment.user.Username || "User"}</span>
                <span className="comment-time">{formatPostTime(comment.createdAt)}</span>
              </div>
              <p className="comment-text">{comment.text}</p>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* New comment form */}
      <form className="comment-form" onSubmit={handleSubmit}>
        <img
          src={"/default-avatar.png"}
          alt="User"
          className="comment-avatar"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="comment-submit-btn"
          disabled={!newComment.trim() || isSubmitting}
        >
          {isSubmitting ? '...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CommentSection;
