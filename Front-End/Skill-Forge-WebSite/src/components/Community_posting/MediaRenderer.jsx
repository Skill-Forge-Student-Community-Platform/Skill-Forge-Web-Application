import React from 'react';

const MediaRenderer = ({ file, url, type, isPreview = false }) => {
  // Get media URL from props or file
  const getMediaUrl = () => {
    if (url) return url;
    if (file && file.url) return file.url;
    if (file instanceof File) return URL.createObjectURL(file);
    return null;
  };

  // Determine if media is image based on type string
  const isImage = () => {
    if (typeof type === 'string') {
      return type === 'image' || type.startsWith('image/');
    }
    if (file && file.type) {

      return file.type === 'image' || file.type.startsWith('image/');
    }
    // Default to image
    return true;
  };

  const mediaUrl = getMediaUrl();
  if (!mediaUrl) {
    console.error("Cannot render media - no URL available", { file, url, type });
    return <div className="media-error">Media not available</div>;
  }

  return (
    <div className="media-renderer">
      {isImage() ? (
        <img
          src={mediaUrl}
          alt={file?.altText || "Media content"}
          className={`media-item ${isPreview ? 'preview' : ''}`}
        />
      ) : (
        <video
          src={mediaUrl}
          controls={!isPreview}
          muted={isPreview}
          className={`media-item ${isPreview ? 'preview' : ''}`}
        />
      )}
    </div>
  );
};

export default MediaRenderer;
