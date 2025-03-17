import React, { useState } from 'react';
import { formatPostTime } from '../../../../utils/timeUtils';
import './RepostContent.css';

const RepostContent = ({ post }) => {
  const [expanded, setExpanded] = useState(false);

  const renderMedia = (media) => {
    if (!media || !media.layout) return null;

    return (
      <div className={`media-grid ${media.layout}`}>
        {media.media.map((item, index) => (
          <div key={index} className="media-item">
            {item.type === 'image' ? (
              <img src={item.url} alt="" />
            ) : (
              <video src={item.url} controls />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="repost-content">
      {post.text && <p className="repost-text">{post.text}</p>}
      <div className={`original-post ${expanded ? 'expanded' : ''}`}>
        <div className="original-poster-info">
          <img src={post.originalPost.userImage} alt="" className="user-avatar-small" />
          <div className="original-post-meta">
            <span className="original-user-name">{post.originalPost.userName}</span>
            <div className="post-details">
              <span className="post-time">{formatPostTime(post.originalPost.timestamp)}</span>
              <span className="privacy-icon">{post.originalPost.privacyIcon}</span>
            </div>
          </div>
        </div>
        <div className={`original-content ${!expanded ? 'collapsed' : ''}`}>
          {post.originalPost.text && (
            <p className="original-text">{post.originalPost.text}</p>
          )}
          {post.originalPost.media && renderMedia(post.originalPost.media)}
        </div>
        {!expanded && (
          <button className="see-more" onClick={() => setExpanded(true)}>
            See more
          </button>
        )}
      </div>
    </div>
  );
};

export default RepostContent;
