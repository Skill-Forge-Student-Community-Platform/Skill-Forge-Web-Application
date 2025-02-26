import React, { useState, useEffect } from 'react';
import './Feed.css';
import { FaEllipsisH, FaThumbsUp, FaComment, FaShare, FaPaperPlane } from 'react-icons/fa';
import { formatPostTime } from '../../../utils/timeUtils';
import PostContent from './PostContent';
import RepostContent from './RepostContent';

const Feed = ({ posts }) => {
  // New state to trigger re-render every second
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 10000); // Update every second
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="feed-container">
      {posts?.map((post, index) => (
        <div key={index} className="post-wrapper">
          <header className="post-header">
            <div className="user-info">
              <img src={post.userImage} alt={post.userName} className="user-avatar" />
              <div className="post-meta">
                <h3 className="user-name">{post.userName}</h3>
                <div className="post-details">
                  <span className="post-time">{formatPostTime(post.timestamp)}</span>
                  <span className="privacy-icon">{post.privacyIcon}</span>
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
            <button className="action-btn">
              <FaThumbsUp /> Like
            </button>
            <button className="action-btn">
              <FaComment /> Comment
            </button>
            <button className="action-btn">
              <FaShare /> Repost
            </button>
            <button className="action-btn">
              <FaPaperPlane /> Send
            </button>
          </div>
        </div>
      ))}
    </div>

  );
};

export default Feed;
