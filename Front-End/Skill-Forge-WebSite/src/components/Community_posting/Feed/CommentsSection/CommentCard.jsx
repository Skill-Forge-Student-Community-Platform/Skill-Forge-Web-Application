import React, { useState, useRef, useEffect } from 'react';
import { formatPostTime } from '../../../../utils/timeUtils';
import {
  FaThumbsUp, FaRegThumbsUp, FaReply, FaEllipsisH, FaSmile,
  FaEdit, FaTrash, FaFlag, FaCopy, FaEyeSlash, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import ReplyComment from './ReplyComment';
import Picker from 'emoji-picker-react';
import './CommentCard.css';

const CommentCard = ({
  comment,
  postId, // Add the missing postId prop here
  onReply,
  onLike,
  onDelete,
  onEdit,
  currentUserId,
  postAuthorId,
  onHideComment
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [liked, setLiked] = useState(comment.likes?.includes(currentUserId) || false);
  const [likeCount, setLikeCount] = useState(comment.likes?.length || 0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [showAllReplies, setShowAllReplies] = useState(false);

  const optionsRef = useRef(null);
  const emojiRef = useRef(null);
  const replyInputRef = useRef(null);
  const editInputRef = useRef(null);

  const isOwner = currentUserId === comment.user._id;
  const isAuthor = comment.user._id === postAuthorId;

  // Display only the most recent 2 replies initially
  const displayedReplies = showAllReplies
    ? comment.replies
    : (comment.replies?.slice(-2) || []);

  const hasHiddenReplies = !showAllReplies && (comment.replies?.length > 2);

  useEffect(() => {
    // Close emoji picker and options menu when clicking outside
    const handleOutsideClick = (event) => {
      if (showEmoji && emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }

      if (showOptions && optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showEmoji, showOptions]);

  useEffect(() => {
    // Auto focus on input when editing or replying
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
    if (showReplyForm && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [isEditing, showReplyForm]);

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    // Pass the current comment's ID as the parentId for the reply
    onReply(comment._id, replyText);

    setReplyText('');
    setShowReplyForm(false);
    setShowEmoji(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editText.trim() || editText === comment.text) {
      setIsEditing(false);
      setEditText(comment.text);
      return;
    }

    onEdit(comment._id, editText);
    setIsEditing(false);
  };

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));
    onLike(comment._id, newLiked);
  };

  const handleEmojiClick = (event, emojiObject) => {
    if (isEditing) {
      setEditText(prev => prev + emojiObject.emoji);
    } else {
      setReplyText(prev => prev + emojiObject.emoji);
    }
  };

  return (
    <div className="comment-wrapper main-comment-wrapper">
      <div className="comment main-comment">
        <img
          src={comment.user.profilePicture || "/default-avatar.png"}
          alt="User"
          className="comment-avatar"
        />
        <div className="comment-content">
          <div className="comment-header">
            <div className="comment-user-info">
              <div className="name-badge-container">
                <span className="comment-author">{comment.user.Username || "User"}</span>
                {isAuthor && <span className="author-badge">Author</span>}
              </div>
              <small className="user-profession">
                {comment.user.profession || comment.user.university || comment.user.company || "Member"}
              </small>
            </div>

            <div className="comment-meta">
              <span className="comment-time">{formatPostTime(comment.createdAt)}</span>

              <div className="comment-options" ref={optionsRef}>
                <button
                  className="comment-options-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptions(!showOptions);
                  }}
                >
                  <FaEllipsisH />
                </button>

                {showOptions && (
                  <div className="comment-options-dropdown">
                    {isOwner && (
                      <>
                        <button
                          className="comment-option-item"
                          onClick={() => {
                            setIsEditing(true);
                            setShowOptions(false);
                          }}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="comment-option-item"
                          onClick={() => {
                            onDelete(postId, comment._id);
                            setShowOptions(false);
                          }}
                        >
                          <FaTrash /> Delete
                        </button>
                      </>
                    )}
                    <button
                      className="comment-option-item"
                      onClick={() => {
                        navigator.clipboard.writeText(comment.text);
                        setShowOptions(false);
                      }}
                    >
                      <FaCopy /> Copy text
                    </button>
                    {!isOwner && (
                      <>
                        <button
                          className="comment-option-item"
                          onClick={() => {
                            alert('Comment reported');
                            setShowOptions(false);
                          }}
                        >
                          <FaFlag /> Report
                        </button>
                        <button
                          className="comment-option-item"
                          onClick={() => {
                            onHideComment(comment._id);
                            setShowOptions(false);
                          }}
                        >
                          <FaEyeSlash /> I don't like this
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {isEditing ? (
            <form className="edit-form" onSubmit={handleEditSubmit}>
              <textarea
                ref={editInputRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="edit-input"
              />
              <div className="emoji-container" ref={emojiRef}>
                <button
                  type="button"
                  className="emoji-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowEmoji(!showEmoji);
                  }}
                >
                  <FaSmile />
                </button>
                {showEmoji && (
                  <div className="emoji-picker-container">
                    <Picker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>
              <div className="edit-actions">
                <button
                  type="button"
                  className="cancel-edit-btn"
                  onClick={() => {
                    setIsEditing(false);
                    setEditText(comment.text);
                    setShowEmoji(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-edit-btn"
                  disabled={!editText.trim() || editText === comment.text}
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <p className="comment-text">{comment.text}</p>
          )}

          <div className="comment-actions">
            <button
              className={`comment-action-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              {liked ? <FaThumbsUp /> : <FaRegThumbsUp />}
              {likeCount > 0 && <span className="like-count">{likeCount}</span>}
            </button>

            <button
              className="comment-action-btn"
              onClick={() => setShowReplyForm(!showReplyForm)}
            >
              <FaReply /> Reply
              {comment.replies?.length > 0 ?
                <span className="reply-count">({comment.replies.length})</span> : null
              }
            </button>
          </div>

          {showReplyForm && (
            <form className="reply-form" onSubmit={handleReplySubmit}>
              <div className="reply-input-container">
                <input
                  ref={replyInputRef}
                  type="text"
                  placeholder="Write a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="reply-input"
                />
                <div className="reply-actions">
                  <div className="emoji-container" ref={emojiRef}>
                    <button
                      type="button"
                      className="emoji-btn"
                      onClick={() => setShowEmoji(!showEmoji)}
                    >
                      <FaSmile />
                    </button>
                    {showEmoji && (
                      <div className="emoji-picker-container">
                        <Picker onEmojiClick={handleEmojiClick} />
                      </div>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="reply-submit-btn"
                    disabled={!replyText.trim()}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Render replies if any */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="comment-replies">
          {hasHiddenReplies && (
            <button
              className="show-previous-replies"
              onClick={() => setShowAllReplies(true)}
            >
              <FaChevronDown /> See previous replies ({comment.replies.length - 2})
            </button>
          )}

          {displayedReplies.map((reply) => (
            <ReplyComment
              key={`reply-${reply._id || Math.random().toString(36)}`}
              reply={reply}
              postId={postId}
              onReply={onReply}
              onLike={onLike}
              onDelete={onDelete}
              onEdit={onEdit}
              onHideComment={onHideComment}
              currentUserId={currentUserId}
              isPostAuthor={currentUserId === postAuthorId}
              postAuthorId={postAuthorId}
            />
          ))}

          {showAllReplies && comment.replies.length > 2 && (
            <button
              className="show-less-replies"
              onClick={() => setShowAllReplies(false)}
            >
              <FaChevronUp /> Hide previous replies
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
