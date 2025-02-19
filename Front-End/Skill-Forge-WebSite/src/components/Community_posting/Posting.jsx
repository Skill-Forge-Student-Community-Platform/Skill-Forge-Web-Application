import React, { useState, useEffect } from "react";
import "./Posting.css";
import { FaImages, FaCalendarAlt, FaNewspaper, FaGlobe, FaUserFriends, FaUserSlash, FaUserPlus } from "react-icons/fa";
import PostModal from "./Posting_pagers/PostModal/PostModal";
import EventModal from "./Posting_pagers/EventModal/EventModal";
import ArticleModal from "./Posting_pagers/ArticleModal/ArticleModal";
import PrivacyModal from "./Posting_pagers/PrivacyModal/PrivacyModal";
import MediaUploadModal from './Posting_pagers/MediaUploadModal/MediaUploadModal';
import Feed from './Feed/Feed';

function Posting() {
  const [activeModal, setActiveModal] = useState(null);
  const [user, setUser] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [privacy, setPrivacy] = useState("Friends"); // Changed default from "Public" to "Friends"
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [tempMedia, setTempMedia] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (activeModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [activeModal]);

  const closeWindow = () => {
    setActiveModal(null);
    setText("");
    setMedia([]);
    setIsDisabled(true);
    setEventDetails(null);
    setTempMedia([]); // Clear temp media when closing
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    setIsDisabled(e.target.value.trim() === "" && media.length === 0);
  };

  const handleCreateEvent = () => {
    setEventDetails({
      coverImage: null,
      type: "Online",
      name: "",
      timezone: "(UTC+05:30) Chennai, Kolkata, Mumbai, New Delhi",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      externalLink: "",
      description: "",
      speakers: ""
    });
    setActiveModal("event");
  };

  const handleMediaUpload = (mediaData) => {
    console.log('Received media data:', mediaData); // Debug log
    setMedia(mediaData);
    setIsDisabled(false);
    setActiveModal("post"); // Ensure this line executes
    setTempMedia([]); // Clear temp media after successful upload
  };

  const handleClearMedia = () => {
    setMedia([]); // Clear media array
    setIsDisabled(text.trim() === ''); // Update disabled state based on text only
  };

  const handleModalClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      closeWindow();
    }
  };

  const openMediaModal = (existingMedia = []) => {
    // Don't open modal if there are existing media files
    if (media.length > 0) return;

    setTempMedia(Array.isArray(existingMedia) ? existingMedia : []);
    setActiveModal("media");
  };

  const createPost = (text, media, privacy) => {
    const mediaData = media.media ? {
      layout: media.layout,
      media: media.media.map(item => {
        // Create URL for File objects
        const url = item instanceof File ? URL.createObjectURL(item) :
                   item.file instanceof File ? URL.createObjectURL(item.file) :
                   item.url || item.file?.url;
        return {
          type: item.type || (item instanceof File ? item.type.startsWith('image/') ? 'image' : 'video' :
                item.file?.type?.startsWith('image/') ? 'image' : 'video'),
          url: url,
          file: item instanceof File ? item : item.file
        };
      })
    } : null;

    const newPost = {
      id: Date.now(),
      userName: user?.name || "Guest",
      userImage: user?.profilePicture || "default-avatar.png",
      timestamp: new Date(),
      privacyIcon: getPrivacyIcon(privacy),
      text,
      media: mediaData,
      isRepost: false
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    closeWindow();
  };

  // Function to get privacy icon component based on privacy setting
  const getPrivacyIcon = (privacy) => {
    // This matches the logic in PostModal.jsx
    switch (privacy) {
      case 'Public': return <FaGlobe />;
      case 'Friends': return <FaUserFriends />;
      case 'Friends except...': return <FaUserSlash />;
      case 'Specific friends': return <FaUserPlus />;
      default: return <FaGlobe />;
    }
  };

  return (
    <div className="community-posting">
      <div className="post-input-container">
        <div className="input-row">
          <img src={user ? user.profilePicture : "default-avatar.png"} alt="Profile" className="user-icon" />
          <input
            type="text"
            placeholder="What do you want to talk about?"
            onClick={() => setActiveModal("post")}
            readOnly
          />
        </div>
        <div className="post-icons">
          <span
            className={`action-icon media ${media.length > 0 ? 'disabled' : ''}`}
            onClick={() => media.length === 0 && setActiveModal("media")}
          >
            <FaImages title="Photos/Videos" />
            <span className="icon-text">Photos/Videos</span>
          </span>
          <span className="action-icon event" onClick={handleCreateEvent}>
            <FaCalendarAlt title="Create Event" />
            <span className="icon-text">Event</span>
          </span>
          <span className="action-icon article" onClick={() => setActiveModal("article")}>
            <FaNewspaper title="Write Article" />
            <span className="icon-text">Article</span>
          </span>
        </div>
      </div>

      {activeModal && (
        <div className="modal-overlay" onClick={handleModalClick}>
          {showPrivacyModal ? (
            <PrivacyModal
              closeWindow={closeWindow}
              setShowPrivacyModal={setShowPrivacyModal}
              privacy={privacy}
              setPrivacy={setPrivacy}
            />
          ) : activeModal === "media" ? (
            <MediaUploadModal
              closeWindow={closeWindow}
              onMediaSelect={handleMediaUpload}
              setActiveModal={setActiveModal}
              existingMedia={tempMedia} // Pass existing media
            />
          ) : activeModal === "post" ? (
            <PostModal
              closeWindow={closeWindow}
              text={text}
              handleTextChange={handleTextChange}
              privacy={privacy}
              setShowPrivacyModal={setShowPrivacyModal}
              isDisabled={isDisabled}
              user={user}
              media={{ ...media, onClear: handleClearMedia }}
              openMediaModal={openMediaModal}
              onPost={() => createPost(text, media, privacy)}
            />
          ) : activeModal === "event" ? (
            <EventModal
              closeWindow={closeWindow}
              eventDetails={eventDetails}
              setEventDetails={setEventDetails}
            />
          ) : activeModal === "article" ? (
            <ArticleModal closeWindow={closeWindow} />
          ) : null}
        </div>
      )}

      <Feed posts={posts} />
    </div>
  );
}

export default Posting;
