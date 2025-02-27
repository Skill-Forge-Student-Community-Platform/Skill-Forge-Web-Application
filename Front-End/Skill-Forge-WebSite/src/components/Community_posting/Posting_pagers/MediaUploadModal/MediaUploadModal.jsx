import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import UploadStage from './Stages/UploadStage/UploadStage';
import ProcessingStage from './Stages/ProcessingStage/ProcessingStage';
import IntegrationStage from './Stages/IntegrationStage/IntegrationStage';


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
    onMediaSelect(finalMedia);
  };

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
