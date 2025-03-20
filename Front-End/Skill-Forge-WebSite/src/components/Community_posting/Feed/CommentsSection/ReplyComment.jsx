import React, { useState, useRef, useEffect } from 'react';
import { formatPostTime } from '../../../../utils/timeUtils';
import {
  FaThumbsUp, FaRegThumbsUp, FaReply, FaEllipsisH, FaSmile,
  FaEdit, FaTrash, FaFlag, FaCopy, FaEyeSlash
} from 'react-icons/fa';
import Picker from 'emoji-picker-react';
import ProfileAvatar from '../../../Home_page/Home_components/ProfileAvatar';
import './ReplyComment.css';

const ReplyComment = ({
  reply,
  postId,
  onReply,
  onLike,
  onDelete,
  onEdit,
  currentUserId,
  postAuthorId,
  onHideComment,
  isPostAuthor
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [liked, setLiked] = useState(reply.likes?.includes(currentUserId) || false);
  const [likeCount, setLikeCount] = useState(reply.likes?.length || 0);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(reply.text);
  const [isReplyFocused, setIsReplyFocused] = useState(false);

  const optionsRef = useRef(null);
  const emojiRef = useRef(null);
  const replyInputRef = useRef(null);
  const editInputRef = useRef(null);

  const isOwner = currentUserId === reply.user._id;
  const isAuthor = reply.user._id === postAuthorId;

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

    onReply(reply._id, replyText);
    setReplyText('');
    setShowReplyForm(false);
    setShowEmoji(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!editText.trim() || editText === reply.text) {
      setIsEditing(false);
      setEditText(reply.text);
      return;
    }

    onEdit(reply._id, editText);
    setIsEditing(false);
  };

  const handleLike = () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : Math.max(0, prev - 1));
    onLike(postId, reply._id, newLiked);
  };

  const handleEmojiClick = (event, emojiObject) => {
    if (isEditing) {
      setEditText(prev => prev + emojiObject.emoji);
    } else {
      setReplyText(prev => prev + emojiObject.emoji);
    }
  };

  return (
    <div className="reply-comment">
      <div className="reply-connector"></div>
      <div className="comment nested-comment">
        <ProfileAvatar
          userId={reply.user?._id}
          staticImageUrl={reply.user?.profilePicture || "/default-avatar.png"}
          customAltText={reply.user?.Username || "User"}
          size="micro"
          showLevel={false}
          showMembershipTag={false}
          className="comment-avatar"
        />
        <div className="reply-content">
          <div className="comment-header">
            <div className="comment-user-info">
              <div className="name-badge-container">
                <span className="comment-author">{reply.user.Username || "User"}</span>
                {isAuthor && <span className="author-badge">Author</span>}
              </div>
              <small className="user-profession">
                {reply.user.profession || reply.user.university || reply.user.company || "Member"}
              </small>
            </div>

            <div className="comment-meta">
              <span className="comment-time">{formatPostTime(reply.createdAt)}</span>

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
                            onDelete(postId, reply._id);
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
                        navigator.clipboard.writeText(reply.text);
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
                            onHideComment(reply._id);
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
                    setEditText(reply.text);
                    setShowEmoji(false);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="save-edit-btn"
                  disabled={!editText.trim() || editText === reply.text}
                >
                  Save
                </button>
              </div>
            </form>
          ) : (
            <p className="comment-text">{reply.text}</p>
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
            </button>
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
  );
};

export default ReplyComment;
