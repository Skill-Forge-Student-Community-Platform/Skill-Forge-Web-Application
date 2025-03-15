import React from 'react';

const MediaRenderer = ({ file, url, type, isPreview = false }) => {
  // Get media URL from props or file
  const getMediaUrl = () => {
    if (url) return url;
    if (file && file.url) return file.url;
    if (file instanceof File) return URL.createObjectURL(file);
    return null;
  };

  // Enhanced logic to determine if media is image based on type string
  const isImage = () => {
    if (typeof type === 'string') {
      return type === 'image' || type.startsWith('image/');
    }
    if (file && file.type) {
      return file.type === 'image' || file.type.startsWith('image/');
    }
    // Check URL for common image extensions as fallback
    const mediaUrl = getMediaUrl();
    if (mediaUrl) {
      const ext = mediaUrl.split('.').pop().toLowerCase();
      const imgExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'];
      if (imgExts.includes(ext)) return true;
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
          onError={(e) => {
            console.error(`Failed to load image: ${mediaUrl}`);
            e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
          }}
        />
      ) : (
        <video
          src={mediaUrl}
          controls={!isPreview}
          muted={isPreview}
          className={`media-item ${isPreview ? 'preview' : ''}`}
          onError={(e) => {
            console.error(`Failed to load video: ${mediaUrl}`);
            e.target.style.display = 'none';
          }}
        />
      )}
    </div>
  );
};

export default MediaRenderer;
