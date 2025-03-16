import React, { useEffect, useRef } from 'react';
import { FaTimes, FaGlobe, FaImages, FaPlusCircle, FaCaretDown, FaUserFriends, FaUserSlash, FaUserPlus } from 'react-icons/fa';
import ProfileAvatar from '../../../Home_page/Home_components/ProfileAvatar';
import './PostModal.css';
import '../shared/ModalStyles.css';
import SingleLayout from '../MediaUploadModal/Stages/Grid_Layouts/SingleLayout';
import TwoGridVertical from '../MediaUploadModal/Stages/Grid_Layouts/TwoGridVertical';
import TwoGridHorizontal from '../MediaUploadModal/Stages/Grid_Layouts/TwoGridHorizontal';
import ThreeGridVertical from '../MediaUploadModal/Stages/Grid_Layouts/ThreeGridVertical';
import ThreeGridMasonry from '../MediaUploadModal/Stages/Grid_Layouts/ThreeGridMasonry';
import FourGridHorizontal from '../MediaUploadModal/Stages/Grid_Layouts/FourGridHorizontal';
import FourGridVertical from '../MediaUploadModal/Stages/Grid_Layouts/FourGridVertical';
import FourGridSquare from '../MediaUploadModal/Stages/Grid_Layouts/FourGridSquare';
import FiveGridHorizontal from '../MediaUploadModal/Stages/Grid_Layouts/FiveGridHorizontal';
import FiveGridVertical from '../MediaUploadModal/Stages/Grid_Layouts/FiveGridVertical';

const PostModal = ({
  closeWindow,
  text,
  handleTextChange,
  privacy,
  setShowPrivacyModal,
  isDisabled,
  user,
  media,
  openMediaModal,
  onPost
}) => {
  const textareaRef = useRef(null);

  const handleTextAreaChange = (e) => {
    handleTextChange(e);

    // Auto-adjust height
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset height first
    textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
  };

  // Initialize height on component mount or text change
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  // Add check for existing media
  const hasExistingMedia = media?.media && media.media.length > 0;

  const handleClearMedia = () => {
    // Add this prop and handler in parent component
    if (media?.onClear) {
      media.onClear();
    }
  };

  const handleAddMoreMedia = () => {
    if (media?.media) {
      openMediaModal(media.media); // Pass existing media files
    } else {
      openMediaModal();
    }
  };

  const renderMediaGrid = () => {
    if (!media?.media || !media?.layout) return null;

    return (
      <div className="post-media-grid">
        <button
          className="clear-media-btn"
          onClick={handleClearMedia}
          title="Remove all media"
        >
          <FaTimes />
        </button>
        {renderLayout()}
        <div className="media-grid-overlay">
          <div className="media-grid-controls">
            <button className="add-media-btn" onClick={handleAddMoreMedia}>
              <FaPlusCircle /> Add photos/videos
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderLayout = () => {
    switch (media.layout) {
      case 'single':
        return <SingleLayout media={media.media} />;
      case 'twoVertical':
        return <TwoGridVertical media={media.media} />;
      case 'twoHorizontal':
        return <TwoGridHorizontal media={media.media} />;
      case 'threeVertical':
        return <ThreeGridVertical media={media.media} />;
      case 'threeMasonry':
        return <ThreeGridMasonry media={media.media} />;
      case 'fourHorizontal':
        return <FourGridHorizontal media={media.media} />;
      case 'fourVertical':
        return <FourGridVertical media={media.media} />;
      case 'fourSquare':
        return <FourGridSquare media={media.media} />;
      case 'fiveHorizontal':
        return <FiveGridHorizontal media={media.media} />;
      case 'fiveVertical':
        return <FiveGridVertical media={media.media} />;
      default:
        return null;
    }
  };

  const getPrivacyIcon = () => {
    switch (privacy) {
      case 'Public':
        return <FaGlobe />;
      case 'Friends':
        return <FaUserFriends />;
      case 'Friends except...':
        return <FaUserSlash />;
      case 'Specific friends':
        return <FaUserPlus />;
      default:
        return <FaGlobe />;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call the parent's onPost function to handle post creation
    onPost();

    // Note: Don't call closeWindow() here anymore - it's handled in the parent component
  };

  return (
    <div className="modal-content" data-modal="post">
      <div className="modal-header">
        <h1>Create a Post</h1>
        <button className="close-btn" onClick={closeWindow}><FaTimes /></button>
      </div>

      <div className="modal-content-scroll">
        <div className="modal-user-info">
          <ProfileAvatar
            staticImageUrl={user?.profilePicture}
            userId={user?._id} // Pass user ID if available
            size="small"
            showLevel={false}
            showMembershipTag={false}
            className="post-modal-avatar"
          />
          <div className='user-info-container'>
            <p className="user-name">{user ? user.name : "Guest"}</p>
            <button className="privacy-selector" onClick={() => setShowPrivacyModal(true)}>
              {getPrivacyIcon()}
              <span>{privacy}</span>
              <FaCaretDown />
            </button>
          </div>
        </div>

        <div className="post-content-scrollable">
          <textarea
            ref={textareaRef}
            placeholder="What's on your mind..? lakshan"
            value={text}
            onChange={handleTextAreaChange}
            rows={1}
          />

          <div className="media-content-section">
            {renderMediaGrid()}
          </div>
        </div>

        <div className="modal-actions">
          <button
            className={`file-upload-btn ${hasExistingMedia ? 'disabled' : ''}`}
            onClick={hasExistingMedia ? null : openMediaModal}
            title={hasExistingMedia ? "Clear existing media to upload new files" : "Upload photos/videos"}
          >
            <FaImages />
          </button>
          {/* add more features later */}
        </div>
      </div>

      <div className="modal-footer">
        <button
          className="primary-btn"
          disabled={isDisabled}
          onClick={handleSubmit}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default PostModal;
