import React, { useState } from 'react';
import ImageRender from './ImageRender';
import './PostContent.css';

const PostContent = ({ post }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderText = () => {
    if (!post.text) return null;

    const lines = post.text.split('\n');
    const shouldShowMore = lines.length > 2;

    if (!shouldShowMore) {
      return <p className="post-text">{post.text}</p>;
    }

    const previewText = lines.slice(0, 2).join('\n');
    const displayText = isExpanded ? post.text : previewText;

    return (
      <div className="post-text-container">
        <p className="post-text">
          {displayText}
          {shouldShowMore && (
            <button
              className="toggle-text-btn"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? ' Show less' : '... See more'}
            </button>
          )}
        </p>
      </div>
    );
  };

  return (
    <div className="post-content">
      {renderText()}
      <ImageRender media={post.media} />
    </div>
  );
};

export default PostContent;
