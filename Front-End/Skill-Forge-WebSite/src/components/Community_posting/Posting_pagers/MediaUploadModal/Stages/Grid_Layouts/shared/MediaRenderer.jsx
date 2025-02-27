import React from 'react';

const MediaRenderer = ({ file, url }) => {
  const getMediaUrl = () => {
    if (url) return url;
    if (!file) return null;

    if (file instanceof File) {
      return URL.createObjectURL(file);
    }

    return file.url || null;
  };

  const mediaUrl = getMediaUrl();
  if (!mediaUrl) return null;

  const isImage = (file instanceof File && file.type.startsWith('image/')) ||
                 (file?.type?.startsWith('image/')) ||
                 mediaUrl.match(/\.(jpg|jpeg|png|gif)$/i);

  return isImage ? (
    <img src={mediaUrl} alt="Media content" loading="lazy" />
  ) : (
    <video src={mediaUrl} controls preload="metadata" />
  );
};

export default MediaRenderer;
