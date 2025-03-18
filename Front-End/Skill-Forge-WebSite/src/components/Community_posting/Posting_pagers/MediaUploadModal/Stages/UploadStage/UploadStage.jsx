import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaPlus, FaTimes, FaEdit } from 'react-icons/fa';
import '../shared/Stages.css';
import './UploadStage.css';

const UploadStage = ({ onComplete, selectedFiles: existingFiles, onEditFile }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Ensure existingFiles is always an array
    if (Array.isArray(existingFiles) && existingFiles.length > 0) {
      setSelectedFiles(existingFiles);
    } else {
      setSelectedFiles([]);
    }
  }, [existingFiles]);

  // Compress image function
  const compressImage = (file) => {
    return new Promise((resolve) => {
      // Skip compression for non-image files
      if (!file.type.startsWith('image/')) {
        resolve(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Create canvas for compression
          const canvas = document.createElement('canvas');

          // Calculate new dimensions (max 1200px)
          let width = img.width;
          let height = img.height;
          const maxSize = 1200;

          if (width > height && width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          } else if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with reduced quality (0.7)
          canvas.toBlob((blob) => {
            // Create a new file from the blob
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            // Add these for debugging
            console.log(`Compressed ${file.name} from ${file.size} to ${compressedFile.size} bytes`);

            resolve(compressedFile);
          }, 'image/jpeg', 0.7);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setIsProcessing(true);

    try {
      const validFiles = acceptedFiles.filter(file => {
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        return isImage || isVideo;
      });

      if (validFiles.length > 0) {
        // Process and compress images before adding
        const processedFiles = await Promise.all(validFiles.map(compressImage));

        const newFiles = [...selectedFiles, ...processedFiles];
        setSelectedFiles(newFiles);
        onComplete(newFiles, false);
      }
    } catch (error) {
      console.error("Error processing files:", error);
    } finally {
      setIsProcessing(false);
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
      {isProcessing && <div className="processing-overlay">Processing files...</div>}

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
