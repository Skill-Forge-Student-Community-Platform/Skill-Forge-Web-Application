import React from 'react';

import { FaTimes } from 'react-icons/fa';
import './UploadProgressBar.css';

const UploadProgressBar = ({ progress, isUploading, onCancel, error }) => {
  // Don't render if not uploading and no error
  if (!isUploading && !error) return null;

  return (
    <div className={`upload-progress-container ${error ? 'error' : ''}`}>
      <div className="upload-progress-content">
        <div className="upload-progress-info">
          <span className="upload-status">
            {error ? 'Upload failed' :
             progress >= 100 ? 'Post created successfully!' :
             `Uploading post... ${Math.round(progress)}%`}
          </span>
          {isUploading && (
            <button className="upload-cancel-btn" onClick={onCancel} aria-label="Cancel upload">
              <FaTimes />
            </button>
          )}
        </div>
        {!error && isUploading && (
          <div className="upload-progress-bar-container">
            <div
              className="upload-progress-bar"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadProgressBar;
