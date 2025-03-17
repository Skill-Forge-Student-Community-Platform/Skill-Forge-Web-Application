import React, { useState } from 'react';
import { FaGlobe, FaUserFriends, FaUserSlash, FaUserPlus, FaTimes } from 'react-icons/fa';
import './ShareModal.css';
import PostContent from '../../Feed/Post/PostContent';

const ShareModal = ({ closeWindow, postToShare, onShare, user }) => {
  const [text, setText] = useState('');
  const [privacy, setPrivacy] = useState('Friends');
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handlePrivacyChange = (newPrivacy) => {
    setPrivacy(newPrivacy);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onShare(postToShare._id, text, privacy);
      closeWindow();
    } catch (error) {
      console.error('Share failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-window share-modal">
      <div className="modal-header">
        <h2>Share Post</h2>
        <button className="close-btn" onClick={closeWindow}>
          <FaTimes />
        </button>
      </div>

      <div className="modal-content">
        <div className="share-input-container">
          <img
            src={user.profilePicture || "/default-avatar.png"}
            alt={user.name}
            className="user-avatar"
          />
          <div className="share-input-content">
            <div className="privacy-selector">
              <button
                className={`privacy-btn ${privacy === 'Public' ? 'active' : ''}`}
                onClick={() => handlePrivacyChange('Public')}
              >
                <FaGlobe /> Public
              </button>
              <button
                className={`privacy-btn ${privacy === 'Friends' ? 'active' : ''}`}
                onClick={() => handlePrivacyChange('Friends')}
              >
                <FaUserFriends /> Friends
              </button>
              <button
                className={`privacy-btn ${privacy === 'Friends except...' ? 'active' : ''}`}
                onClick={() => handlePrivacyChange('Friends except...')}
              >
                <FaUserSlash /> Friends except...
              </button>
              <button
                className={`privacy-btn ${privacy === 'Specific friends' ? 'active' : ''}`}
                onClick={() => handlePrivacyChange('Specific friends')}
              >
                <FaUserPlus /> Specific friends
              </button>
            </div>

            <textarea
              className="share-text-area"
              placeholder="What do you want to say about this post?"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>
        </div>

        <div className="original-post-preview">
          <h4>Original post by {postToShare.user.Username || "User"}</h4>
          <div className="post-preview-content">
            <PostContent post={postToShare} isPreview={true} />
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button
          className="share-post-btn"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sharing..." : "Share Now"}
        </button>
      </div>
    </div>
  );
};

export default ShareModal;
