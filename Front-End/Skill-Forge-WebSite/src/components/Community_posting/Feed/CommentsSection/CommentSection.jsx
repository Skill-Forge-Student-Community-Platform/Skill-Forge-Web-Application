import React, { useState, useRef, useEffect } from 'react';
import { formatPostTime } from '../../../../utils/timeUtils';
import {
  FaThumbsUp, FaRegThumbsUp, FaReply, FaEllipsisH, FaSmile,
  FaEdit, FaTrash, FaFlag, FaCopy, FaEyeSlash, FaChevronDown, FaChevronUp,
  FaTimes, FaCheck, FaChevronLeft, FaChevronRight, FaCaretDown
} from 'react-icons/fa';
import './CommentSection.css';
import Picker from 'emoji-picker-react';
import CommentCard from './CommentCard';
import ProfileAvatar from '../../../Home_page/Home_components/ProfileAvatar';
import { useAuthStore } from '../../../../store/authStore';

const QuickReplies = ({ onSelectReply }) => {
  const quickReplies = [
    "Great point!",
    "Thanks for sharing!",
    "I agree with you",
    "Interesting perspective",
    "Could you elaborate more?",
    "This is helpful",
    "Well said!",
    "Congratulations!",
    "That's impressive",
    "Good question",
    "I learned something new"
  ];

  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollPosition = () => {
    const el = scrollRef.current;
    if (!el) return;

    setShowLeftArrow(el.scrollLeft > 0);
    setShowRightArrow(el.scrollLeft < (el.scrollWidth - el.clientWidth - 10));
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollPosition);
      // Check initial scroll position
      checkScrollPosition();

      return () => el.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  const scrollLeft = () => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="quick-replies-container">
      {showLeftArrow && (
        <button className="quick-reply-scroll-btn scroll-left" onClick={scrollLeft}>
          <FaChevronLeft />
        </button>
      )}

      <div className="quick-replies-scroll" ref={scrollRef}>
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            className="quick-reply-pill"
            onClick={() => onSelectReply(reply)}
          >
            {reply}
          </button>
        ))}
      </div>

      {showRightArrow && (
        <button className="quick-reply-scroll-btn scroll-right" onClick={scrollRight}>
          <FaChevronRight />
        </button>
      )}
    </div>
  );
};

const CommentSection = ({
  postId,
  comments = [],
  onAddComment,
  onLikeComment,
  onDeleteComment,
  onEditComment,
  currentUserId,
  postAuthorId
}) => {
  // Add auth store to get current user
  const { user } = useAuthStore();

  // State for comment input
  const [newComment, setNewComment] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [commentFilter, setCommentFilter] = useState('Most Relevant');
  const [showFilters, setShowFilters] = useState(false);

  const [visibleCommentsCount, setVisibleCommentsCount] = useState(5);

  // References for outside click handling
  const inputRef = useRef(null);
  const emojiRef = useRef(null);
  const filterRef = useRef(null);

  // Handle outside clicks to close emoji picker and filter dropdown
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (showEmoji && emojiRef.current && !emojiRef.current.contains(event.target)) {
        setShowEmoji(false);
      }

      if (showFilters && filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [showEmoji, showFilters]);

  // Focus on input when emoji is selected
  useEffect(() => {
    if (inputRef.current && showEmoji) {
      inputRef.current.focus();
    }
  }, [showEmoji]);

  // Processing comments to build a nested structure
  const processComments = (comments) => {
    // Create a map of top-level comments and their replies
    const commentMap = {};
    const topLevelComments = [];

    // First, identify top-level comments and create map entries
    comments.forEach(comment => {
      const id = comment._id.toString();

      // Initialize comment in map with replies array
      commentMap[id] = {
        ...comment,
        replies: []
      };

      // If it's a top-level comment, add to our list
      if (!comment.parentId) {
        topLevelComments.push(commentMap[id]);
      }
    });

    // Process replies - find their parents and add to replies array
    comments.forEach(comment => {
      if (comment.parentId) {
        const parentId = comment.parentId.toString();
        // If parent exists in our map, add this comment as a reply
        if (commentMap[parentId]) {
          commentMap[parentId].replies.push(commentMap[comment._id.toString()]);
        } else {
          // If parent not found, treat as top-level (data inconsistency fallback)
          topLevelComments.push(commentMap[comment._id.toString()]);
        }
      }
    });

    return topLevelComments;
  };

  // Process comments to create nested structure
  const processedComments = processComments(comments);

  // Filter and sort processed comments
  const filteredComments = [...processedComments].sort((a, b) => {
    if (commentFilter === 'Most Relevant') {
      // Combine likes count and replies count for relevance
      const aRelevance = (a.likes?.length || 0) + (a.replies?.length || 0);
      const bRelevance = (b.likes?.length || 0) + (b.replies?.length || 0);
      return bRelevance - aRelevance;
    } else if (commentFilter === 'Most Recent') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (commentFilter === 'All Comments') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // Get visible comments based on count
  const visibleComments = filteredComments.slice(0, visibleCommentsCount);
  const hasMoreComments = filteredComments.length > visibleCommentsCount;

  // Handle adding a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      await onAddComment(postId, newComment);
      setNewComment('');
      setShowEmoji(false);
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  // Handle emoji selection
  const handleEmojiClick = (event, emojiObject) => {
    setNewComment(prev => prev + emojiObject.emoji);
    inputRef.current?.focus();
  };

  // Handle quick reply selection
  const handleQuickReplySelect = (reply) => {
    setNewComment(reply);
    inputRef.current?.focus();
  };

  // Handle loading more comments
  const loadMoreComments = () => {
    setVisibleCommentsCount(prev => prev + 5);
  };

  // Handle reply to a comment
  const handleReplyToComment = async (parentCommentId, replyText) => {
    try {
      // Make the API call to add the reply with the parent comment ID
      const response = await onAddComment(postId, replyText, parentCommentId);

      if (response && response.success) {
        console.log("Reply added successfully");
      }
    } catch (error) {
      console.error("Error adding reply:", error);
    }
  };

  // Handle hiding a comment
  const handleHideComment = (commentId) => {
    // Implementation would depend on your app's requirements
    console.log("Hide comment", commentId);
    // Could update a user preferences store or filter comments locally
  };

  return (
    <div className="comment-section">
      {/* Filter section */}
      <div className="filter-section">
        <div className="comment-count">
          <h3>{comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}</h3>
        </div>
        <div className="comment-filter" ref={filterRef}>
          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {commentFilter} <FaCaretDown />
          </button>
          {showFilters && (
            <div className="filter-options">
              {['Most Relevant', 'Most Recent', 'All Comments'].map(filter => (
                <button
                  key={filter}
                  className={`filter-option ${commentFilter === filter ? 'active' : ''}`}
                  onClick={() => {
                    setCommentFilter(filter);
                    setShowFilters(false);
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick replies section */}
      <QuickReplies onSelectReply={handleQuickReplySelect} />

      {/* Add comment form - replace img with ProfileAvatar */}
      <form className="comment-form" onSubmit={handleCommentSubmit}>
        <ProfileAvatar
          userId={currentUserId}
          size="micro"
          showLevel={false}
          showMembershipTag={false}
          className="comment-avatar"
          staticImageUrl={user?.profilePicture || "/default-avatar.png"}
        />
        <div className="comment-input-container">
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="comment-input"
          />
          <div className="input-actions">
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
              className="comment-submit-btn"
              disabled={!newComment.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </form>

      {/* Comments list */}
      <div className="comments-list">
        {visibleComments.length > 0 ? (
          visibleComments.map(comment => (
            <CommentCard
              key={comment._id || Math.random().toString(36)}
              comment={comment}
              postId={postId}
              onReply={handleReplyToComment}
              onLike={onLikeComment}
              onDelete={onDeleteComment}
              onEdit={onEditComment}
              onHideComment={handleHideComment}
              currentUserId={currentUserId}
              postAuthorId={postAuthorId}
            />
          ))
        ) : (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>

      {/* Load more button */}
      {hasMoreComments && (
        <button
          className="load-more-comments"
          onClick={loadMoreComments}
        >
          <FaChevronDown /> Load more comments
        </button>
      )}
    </div>
  );
};

export default CommentSection;
