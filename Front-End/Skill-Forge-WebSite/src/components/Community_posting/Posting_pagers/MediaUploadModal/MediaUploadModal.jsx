import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import UploadStage from './Stages/UploadStage/UploadStage';
import ProcessingStage from './Stages/ProcessingStage/ProcessingStage';
import IntegrationStage from './Stages/IntegrationStage/IntegrationStage';

// Helper function to generate preview URLs
const generatePreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

const STAGES = {
  UPLOAD: 'upload',
  PROCESSING: 'processing',
  INTEGRATION: 'integration'
};

const MediaUploadModal = ({ closeWindow, onMediaSelect, setActiveModal, existingMedia = [] }) => {
  const [currentStage, setCurrentStage] = useState(STAGES.UPLOAD);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [processedMedia, setProcessedMedia] = useState([]);
  const [editingFileIndex, setEditingFileIndex] = useState(null);

  const openMediaModal = () => {
    // Reset to upload stage and keep existing media
    setCurrentStage(STAGES.UPLOAD);
    if (existingMedia?.length > 0) {
      setSelectedMedia(existingMedia);
    }
  };

  useEffect(() => {
    // Ensure existingMedia is always an array
    if (Array.isArray(existingMedia) && existingMedia.length > 0) {
      setSelectedMedia(existingMedia);
    } else {
      setSelectedMedia([]);
    }
  }, [existingMedia]);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => {
      // Generate a preview URL for immediate display
      const previewUrl = generatePreviewUrl(file);

      return {
        file: file, // Store the actual file
        url: previewUrl, // Provide a URL for preview
        type: file.type, // Keep the original MIME type
        altText: ""
      };
    });

    setSelectedMedia([...selectedMedia, ...newMedia]);
  };

  const handleMediaSelect = (files, proceed) => {
    setSelectedMedia(files); // Don't combine with existingMedia here
    if (proceed) {
      setProcessedMedia(files);
      setCurrentStage(STAGES.INTEGRATION);
    }
  };

  const handleEditFile = (file, index) => {
    setEditingFileIndex(index);
    setSelectedMedia(prev => [...prev]);
    setCurrentStage(STAGES.PROCESSING);
  };

  const handleProcessingComplete = (processedFile) => {
    if (editingFileIndex !== null) {
      setSelectedMedia(prev => {
        const updated = [...prev];
        updated[editingFileIndex] = processedFile;
        return updated;
      });
      setEditingFileIndex(null);
      setCurrentStage(STAGES.UPLOAD);
    }
  };

  const handleIntegrationComplete = (finalMedia) => {
    closeWindow();

    // Ensure we're sending the raw file objects for later upload
    // plus any information needed for preview
    const processedMedia = {
      ...finalMedia,
      media: finalMedia.media.map(file => {
        // If it's already a File object, just pass it through
        if (file instanceof File) {
          return file;
        }

        // If it has file property that's a File, use that
        if (file.file instanceof File) {
          return file.file;
        }

        // Otherwise return the original item (should have url)
        return file;
      })
    };

    onMediaSelect(processedMedia);
  };

  // Removed unused handleConfirm function that referenced undefined selectedLayout

  const renderStage = () => {
    switch (currentStage) {
      case STAGES.UPLOAD:
        return (
          <UploadStage
            onComplete={handleMediaSelect}
            selectedFiles={selectedMedia}  // Pass the selectedMedia as prop
            onEditFile={handleEditFile}
          />
        );
      // case STAGES.PROCESSING:
      //   return (
      //     <ProcessingStage
      //       media={[selectedMedia[editingFileIndex]]}
      //       onComplete={handleProcessingComplete}
      //       onBack={() => setCurrentStage(STAGES.UPLOAD)}
      //       singleFileMode={true}
      //     />
      //   );
      case STAGES.INTEGRATION:
        return (
          <IntegrationStage
            media={processedMedia}
            onComplete={handleIntegrationComplete}
            onBack={() => setCurrentStage(STAGES.UPLOAD)}
          />
        );
      default:
        return null;
    }
  };

  const modalContent = (
    <div
      className="modal-content"
      data-modal="media"
      data-stage={currentStage}
      data-has-files={selectedMedia.length > 0 ? "true" : "false"}
    >
      <div className="modal-header">
        <h1>Upload Media</h1>
        <button className="close-btn" onClick={closeWindow}>
          <FaTimes />
        </button>
      </div>
      <div className="modal-content-scroll">
        {renderStage()}
      </div>
    </div>
  );

  return modalContent;
};

export default MediaUploadModal;
