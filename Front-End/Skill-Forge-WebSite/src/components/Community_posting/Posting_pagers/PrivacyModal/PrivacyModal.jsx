import React from 'react';
import { FaTimes, FaArrowLeft, FaGlobe, FaUserFriends, FaUserSlash, FaUserPlus } from 'react-icons/fa';
import './PrivacyModal.css';
import '../shared/ModalStyles.css';

const PrivacyModal = ({ closeWindow, setShowPrivacyModal, privacy, setPrivacy }) => {
  const privacyOptions = [
    {
      icon: <FaGlobe />,
      label: "Public",
      title: "Anyone on Skill Forge",

    },
    {
      icon: <FaUserFriends />,
      label: "Friends",
      title: "Your friends on Skill Forge",

    },
    {
      icon: <FaUserSlash />,
      label: "Friends except...",
      title: "Don't show to some friends",

    },
    {
      icon: <FaUserPlus />,
      label: "Specific friends",
      title: "Only show to some friends",
    }
  ];

  const handleDone = () => {
    setShowPrivacyModal(false);
  };

  return (
    <div className="modal-content" data-modal="privacy">
      <div className="modal-header">
        <button className="back-btn" onClick={() => setShowPrivacyModal(false)}>
          <FaArrowLeft />
        </button>
        <h1>Post Audience</h1>
        <button className="close-btn" onClick={closeWindow}><FaTimes /></button>
      </div>

      <div className="modal-content-scroll">
        <div className="user-privacy-container">
        <div className="privacy-info">
          <h2>Who can see your post?</h2>
          <p>Your post will show up in Feed, on your profile, and in search results.</p>
          <p className="privacy-note">Your default audience is set to Friends, but you can change the audience of this specific post.</p>
        </div>

        <div className="privacy-options">
          {privacyOptions.map((option, index) => (
            <div
              key={index}
              className={`privacy-option ${privacy === option.label ? 'selected' : ''}`}
              onClick={() => setPrivacy(option.label)}
            >
              <div className="privacy-option-content">
                <div className="privacy-icon-wrapper">
                  {option.icon}
                </div>
                <div className="privacy-text">
                  <h3>{option.label}</h3>
                  <p>{option.title}</p>
                </div>
                <div className="radio-button">
                  <div className="radio-inner"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>

      <div className="modal-footer">
        <button className="done-btn" onClick={handleDone}>Done</button>
      </div>
    </div>
  );
};

export default PrivacyModal;
