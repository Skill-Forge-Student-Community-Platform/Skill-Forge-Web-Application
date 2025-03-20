import React, { useState, useRef, useEffect } from 'react';
import { formatPostTime } from '../../../../utils/timeUtils';
import {
  FaThumbsUp, FaRegThumbsUp, FaReply, FaEllipsisH, FaSmile,
  FaEdit, FaTrash, FaFlag, FaCopy, FaEyeSlash, FaChevronDown, FaChevronUp,
} from 'react-icons/fa';
import Picker from 'emoji-picker-react';
import ReplyComment from './ReplyComment';
import ProfileAvatar from '../../../Home_page/Home_components/ProfileAvatar';
import './CommentCard.css';

const CommentCard = ({
  comment,
  postId,
  onReply,
  onLike,
  onDelete,
  onEdit,
  onHideComment,
  currentUserId,
  postAuthorId
}) => {
  // Local state
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [liked, setLiked] = useState(comment.likes?.includes(currentUserId) || false);
  const [likeCount, setLikeCount] = useState(comment.likes?.length || 0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [isReplyFocused, setIsReplyFocused] = useState(false);

  // References
  const optionsRef = useRef(null);
  const emojiRef = useRef(null);
  const replyInputRef = useRef(null);
  const editInputRef = useRef(null);

  // Check permissions
  const isOwner = currentUserId === comment.user._id;
  const isPostAuthor = comment.user._id === postAuthorId;
  const hasReplies = comment.replies && comment.replies.length > 0;

  // Handle outside clicks
  useEffect(() => {
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

  // Auto focus on inputs
  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
    if (showReplyForm && replyInputRef.current) {
      replyInputRef.current.focus();
    }
  }, [isEditing, showReplyForm]);

  // Handle reply submission
  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    onReply(comment._id, replyText);
    setReplyText('');
    setShowReplyForm(false);
    setShowReplies(true);
    setShowEmoji(false);
  };

  // Handle edit submission
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

  // Handle like action
  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));
    onLike(postId, comment._id, newLiked);
  };

  // Handle emoji selection
  const handleEmojiClick = (event, emojiObject) => {
    if (isEditing) {
      setEditText(prev => prev + emojiObject.emoji);
    } else {
      setReplyText(prev => prev + emojiObject.emoji);
    }
  };

  // Toggle reply form visibility
  const toggleReplyForm = () => {
    setShowReplyForm(prev => !prev);
    if (!showReplyForm) {
      // Automatically show replies when opening reply form
      setShowReplies(true);
    }
  };

  return (
    <div className="main-comment-wrapper">
      <div className="main-comment">
        <div className="comment">
          <ProfileAvatar
            userId={comment.user?._id}
            staticImageUrl={comment.user?.profilePicture || "/default-avatar.png"}
            customAltText={comment.user?.Username || "User"}
            size="micro"
            showLevel={false}
            showMembershipTag={false}
            className="comment-avatar"
          />
          <div className="comment-content">
            <div className="comment-header">
              <div className="comment-user-info">
                <div className="name-badge-container">
                  <span className="comment-author">{comment.user.Username || "User"}</span>
                  {isPostAuthor && <span className="author-badge">Author</span>}
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
                            className="comment-option-item text-danger"
                            onClick={() => {
                              onDelete(postId, comment._id);
                              setShowOptions(false);
                            }}
                          >
                            <FaTrash /> Delete
                          </button>
                          <div className="menu-divider"></div>
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
                onClick={toggleReplyForm}
              >
                <FaReply /> Reply
              </button>
              {hasReplies && (
                <button
                  className="comment-action-btn show-replies"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {showReplies ? (
                    <>
                      <FaChevronUp /> Hide replies
                    </>
                  ) : (
                    <>
                      <FaChevronDown /> Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </>
                  )}
                </button>
              )}
            </div>

            {showReplyForm && (
              <form className="reply-form" onSubmit={handleReplySubmit}>
                <div className={`reply-input-container ${replyText.trim() || isReplyFocused ? 'expanded' : ''}`}>
                  <input
                    ref={replyInputRef}
                    type="text"
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onFocus={() => setIsReplyFocused(true)}
                    onBlur={() => setIsReplyFocused(false)}
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
                    {(replyText.trim() || isReplyFocused) && (
                      <button
                        type="submit"
                        className="reply-submit-btn"
                        disabled={!replyText.trim()}
                      >
                        Reply
                      </button>
                    )}
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Replies section */}
      {hasReplies && showReplies && (
        <div className="comment-replies">
          {comment.replies.map((reply) => (
            <ReplyComment
              key={reply._id}
              reply={reply}
              postId={postId}
              onReply={onReply}
              onLike={onLike}
              onDelete={onDelete}
              onEdit={onEdit}
              currentUserId={currentUserId}
              postAuthorId={postAuthorId}
              onHideComment={onHideComment}
              isPostAuthor={isPostAuthor}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
