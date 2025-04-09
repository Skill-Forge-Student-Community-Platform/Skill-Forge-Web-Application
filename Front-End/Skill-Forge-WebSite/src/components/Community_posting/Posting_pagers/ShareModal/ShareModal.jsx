import React, { useState, useRef, useEffect } from 'react';
import { FaGlobe, FaUserFriends, FaUserSlash, FaUserPlus, FaTimes, FaCaretDown } from 'react-icons/fa';
import '../shared/ModalStyles.css';
import './ShareModal.css';
import RepostContent from '../../Feed/Post/RepostContent';
import ProfileAvatar from '../../../Home_page/Home_components/ProfileAvatar';

const ShareModal = ({ closeWindow, postToShare, onShare, user }) => {
  const [text, setText] = useState('');
  const [privacy, setPrivacy] = useState('Friends');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef(null);

  // Auto-resize textarea as content changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]);

  const handlePrivacyChange = (newPrivacy) => {
    setPrivacy(newPrivacy);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);

    // Auto-adjust height
    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onShare(postToShare._id, text, privacy);
      // closeWindow will be called by the parent component after success
    } catch (error) {
      console.error('Share failed:', error);
      setIsSubmitting(false); // Make sure to reset state if error occurs
    }
  };

  // Get privacy icon based on selected privacy setting
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

  return (
    <div className="modal-content" data-modal="share">
      <div className="modal-header">
        <h1>Share Post</h1>
        <button className="close-btn" onClick={closeWindow}><FaTimes /></button>
      </div>

      <div className="modal-content-scroll">
        <div className="share-user-info">
          <ProfileAvatar
            staticImageUrl={user?.profilePicture}
            userId={user?._id}
            size="small"
            showLevel={false}
            showMembershipTag={false}
            className="share-avatar"
          />
          <div className='share-user-info-container'>
            <p className="share-user-name">{user ? user.name : "Guest"}</p>
            <div className="share-privacy-selector">
              {getPrivacyIcon()}
              <span>{privacy}</span>
              <FaCaretDown />
            </div>
          </div>
        </div>

        <div className="share-content-scrollable">
          <textarea
            ref={textareaRef}
            placeholder="What do you want to say about this post?"
            value={text}
            onChange={handleTextChange}
            rows={1}
            className="share-textarea"
          />

          <div className="share-preview-section">
            {/* Use RepostContent to display the original post */}
            <div className="share-repost-container">
              {postToShare &&
                <RepostContent
                  post={{
                    originalPost: postToShare,
                    text: null // No additional text for preview
                  }}
                  isPreview={true}
                />
              }
            </div>
          </div>
        </div>

        {/* Privacy options section */}
        <div className="share-privacy-options-section">
          <div className="share-privacy-options-header">Share with:</div>
          <div className="share-privacy-options-buttons">
            <button
              className={`share-privacy-option-btn ${privacy === 'Public' ? 'active' : ''}`}
              onClick={() => handlePrivacyChange('Public')}
              title="Anyone can see this shared post"
            >
              <FaGlobe /> <span>Public</span>
            </button>
            <button
              className={`share-privacy-option-btn ${privacy === 'Friends' ? 'active' : ''}`}
              onClick={() => handlePrivacyChange('Friends')}
              title="Only your friends can see this shared post"
            >
              <FaUserFriends /> <span>Friends</span>
            </button>
            <button
              className={`share-privacy-option-btn ${privacy === 'Friends except...' ? 'active' : ''}`}
              onClick={() => handlePrivacyChange('Friends except...')}
              title="Don't show to some friends"
            >
              <FaUserSlash /> <span>Friends except...</span>
            </button>
            <button
              className={`share-privacy-option-btn ${privacy === 'Specific friends' ? 'active' : ''}`}
              onClick={() => handlePrivacyChange('Specific friends')}
              title="Only show to selected friends"
            >
              <FaUserPlus /> <span>Specific friends</span>
            </button>
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button className="cancel-btn" onClick={closeWindow} disabled={isSubmitting}>
          Cancel
        </button>
        <button
          className="primary-btn"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="spinner-icon"></span>
              Sharing...
            </>
          ) : (
            "Share Now"
          )}
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
