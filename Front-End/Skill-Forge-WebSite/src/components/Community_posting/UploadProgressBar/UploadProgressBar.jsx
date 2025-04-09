import React from 'react';
import './UploadProgressBar.css';

const UploadProgressBar = ({
  progress = 0,
  isUploading = false,
  onCancel,
  error = null,
  isDarkMode = false
}) => {
  if (!isUploading && !error) return null;

  const progressText = progress < 100
    ? `Uploading... ${Math.round(progress)}%`
    : 'Processing...';

  return (
    <div className={`upload-progress-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {isUploading && (
        <>
          <div className="upload-info">
            <span className="progress-value">{progressText}</span>
            <button
              className="cancel-upload"
              onClick={onCancel}
              aria-label="Cancel upload"
            >
              Cancel
            </button>
          </div>
          <div className="progress-bar-outer">
            <div
              className="progress-bar-inner"
              style={{ width: `${progress}%` }}
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </>
      )}

      {error && (
        <div className="upload-error" role="alert">
          Error: {error}
        </div>
      )}

      {progress === 100 && !error && (
        <div className="upload-success" role="status">
          Upload complete! Processing your post...
        </div>
      )}
    </div>
  );
};

export default UploadProgressBar;
