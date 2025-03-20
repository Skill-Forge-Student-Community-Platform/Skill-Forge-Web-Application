import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaPlus, FaTimes, FaEdit } from 'react-icons/fa';
import '../shared/Stages.css';
import './UploadStage.css';

const UploadStage = ({ onComplete, selectedFiles: existingFiles, onEditFile }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(() => {
    // Ensure existingFiles is always an array
    if (Array.isArray(existingFiles) && existingFiles.length > 0) {
      setSelectedFiles(existingFiles);
    } else {
      setSelectedFiles([]);
    }
  }, [existingFiles]);

  const onDrop = useCallback((acceptedFiles) => {
    const validFiles = acceptedFiles.filter(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      return isImage || isVideo;
    });

    if (validFiles.length > 0) {
      const newFiles = [...selectedFiles, ...validFiles];
      setSelectedFiles(newFiles);
      onComplete(newFiles, false);
    }
  }, [selectedFiles, onComplete]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png'],
      'video/*': ['.mp4', '.mov']
    },
    maxSize: 20971520, // 20MB
    multiple: true
  });

  const removeFile = (index) => {
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updatedFiles);
    onComplete(updatedFiles, false); // Pass updated files to parent
  };

  const handleNext = () => {
    if (selectedFiles.length > 0) {
      // Pass true to indicate moving to integration stage
      onComplete(selectedFiles, true);
    }
  };

  const handleEditFile = (file, index) => {
    onEditFile(file, index);
  };

  return (
    <div className="upload-stage">
      {selectedFiles.length === 0 ? (
        <div
          {...getRootProps()}
          className={`dropzone ${isDragActive ? 'active' : ''}`}
        >
          <input {...getInputProps()} />
          <FaCloudUploadAlt size={48} />
          <p className="primary-text">
            {isDragActive ? "Drop files here" : "Drag and drop media files here"}
          </p>
          <p className="secondary-text">or</p>
          <button className="upload-button">
            UPLOAD FROM COMPUTER
          </button>
          <p className="helper-text">
            Supported formats: JPG, PNG, MP4, MOV
            <br />
            Maximum file size: 20MB
          </p>
        </div>
      ) : (
        <div className="selected-files-container">
          <div className="scrollable-content">
            <div className="files-grid">
              {selectedFiles.map((file, index) => (
                <div key={index} className="file-preview">
                  {file.type.startsWith('image/') ? (
                    <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                  ) : (
                    <video src={URL.createObjectURL(file)} />
                  )}
                  <div className="file-preview-actions">
                    <button
                      className="edit-file-btn"
                      onClick={() => handleEditFile(file, index)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="remove-file-btn"
                      onClick={() => removeFile(index)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                </div>
              ))}
              <div {...getRootProps()} className="add-more-btn">
                <input {...getInputProps()} />
                <FaPlus />
                <span>Add More</span>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="primary-btn"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadStage;
