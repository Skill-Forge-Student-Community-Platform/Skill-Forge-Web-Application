import React, { useState } from 'react';
import ImageRender from '../ImageRendering/ImageRender';
import './PostContent.css';

const PostContent = ({ post, onMediaClick }) => {
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
              onClick={(e) => {
                e.stopPropagation(); // Prevent double-click propagation
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? ' Show less' : '... See more'}
            </button>
          )}
        </p>
      </div>
    );
  };

  // Pass onMediaClick to ImageRender component
  return (
    <div
      className="post-content"
      onDoubleClick={(e) => {
        if (post.media && post.media.files && post.media.files.length > 0) {
          e.stopPropagation();
          console.log("Double click on post content");
          onMediaClick && onMediaClick(0, true);
        }
      }}
    >
      {renderText()}
      <ImageRender
        media={post.media}
        onDoubleClick={(index) => {
          console.log("Double click on image", index);
          onMediaClick && onMediaClick(index, true);
        }}
      />
    </div>
  );
};

export default PostContent;
