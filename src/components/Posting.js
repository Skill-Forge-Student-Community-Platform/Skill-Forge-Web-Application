import React, { useState } from "react";
import "./Posting.css"; // Assuming the styles are here
import { FaThumbsUp, FaComment, FaShare ,FaUser ,FaEllipsisH } from "react-icons/fa"; // Import icons
import { AiOutlineClose, AiOutlineFileImage, AiOutlineVideoCamera } from 'react-icons/ai';

function Posting() {
  const [post, setPost] = useState([]);
  const [text, setText] = useState("");
  const [newWindow, setWindow] = useState(false);
  const [media, setMedia] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // Tracks the selected post for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility

  function openNewWindow() {
    setWindow(true);
  }

  function handlePost() {
    setPost((e) => [
      ...e,
      { text: text, file: media.length > 0 ? media : [] }, // Ensure file is always an array
    ]);
    setMedia([]);
    setText("");
    closeWindow();
  }

  function closeWindow() {
    setWindow(false);
    setText("");
  }

  function handleFile(e) {
    const selectedFiles = Array.from(e.target.files);
    setMedia((v) => [...v, ...selectedFiles]);
  }

  function handleImageClick(post) {
    setSelectedPost(post);
    setIsModalOpen(true);
  }

  function handleVideoClick(post) {
    setSelectedPost(post)
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedPost(null);
  }

  return (
    <>
      {!newWindow ? (
        <div className="post-input-container">
        <FaUser className="user-icon" />
        <input
          type="text"
          placeholder="Start a post"
          onClick={openNewWindow}
        />
      </div>
      
      ) : (
        <div className="modal-overlay">
          <div className="modal-content">
            <h1>Create a Post</h1>
            <button className="close-btn" onClick={closeWindow}>
              <AiOutlineClose />
            </button>
            <input
              type="text"
              placeholder="Write Post Description here"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <label htmlFor="image-upload" style={{ cursor: 'pointer', marginRight: '10px' }}>
              <AiOutlineFileImage size={24} /> Images
            </label>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFile}
              style={{ display: 'none' }} // Hide the default input
            />
            <label htmlFor="video-upload" style={{ cursor: 'pointer' }}>
              <AiOutlineVideoCamera size={24} />  Video
            </label>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              onChange={handleFile}
              style={{ display: 'none' }} // Hide the default input
            />
            <button onClick={handlePost}>Post</button>
          </div>
        </div>
      )}

<div className="posts-container">
  {post?.map((item, i) => (
    <div key={i} className="post-card">
      <FaEllipsisH />
      <p>{item.text}</p>
      <div className="media-container">
        {/* Main Image/Video Container */}
        <div className="main-media-container">
          {item.file && item.file[0]?.type.startsWith("image/") ? (
            <img
              src={URL.createObjectURL(item.file[0])}
              alt="Main Post"
              className="main-image"
              
              onClick={() => handleImageClick(item)} // Open modal or larger view
            />
          ) : item.file && item.file[0]?.type.startsWith("video/") ? (
            <video
              src={URL.createObjectURL(item.file[0])}
              controls
              className="main-video"
              onClick={() => handleVideoClick(item)} // Open modal or larger view
            />
          ) : null}

          {/* Number of Additional Images */}
          {item.file?.length > 1 && (
            <div className="number-indicator">
              +{item.file.length - 1}
            </div>
          )}
        </div>

        {/* Sidebar with Additional Images */}
        {item.file?.length > 1 && (
          <div className="sidebar">
            {item.file.slice(1, 3).map((file, j) => (
              <div key={j} className="sidebar-item">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Additional image ${j + 1}`}
                    className="sidebar-image"
                    
                    onClick={() => handleImageClick(item)} // Open modal or larger view
                  />
                ) : file.type.startsWith("video/") ? (
                  <video
                    src={URL.createObjectURL(file)}
                    controls
                    className="sidebar-video"
                    onClick={() => handleVideoClick(file)}
                  />
                ) : null}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Post Interaction Icons */}
      <div className="icon-container">
        <span>
          <FaThumbsUp /> Like
        </span>
        <span>
          <FaComment /> Comment
        </span>
        <span>
          <FaShare /> Share
        </span>
      </div>
    </div>
  ))}
</div>

      {isModalOpen && selectedPost?.file && (
        <div className="popup-overlay" onClick={closeModal}>
          <div className="popup-container" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
            <AiOutlineClose />
            </button>
            <div className="slider-container">
              {selectedPost.file.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt="Slider"
                  className="slider-image"
                />
              ))}
            </div>
            <p className="description">{selectedPost.text}</p>
            <div className="icon-container">
              <span>
                <FaThumbsUp /> Like
              </span>
              <span>
                <FaComment /> Comment
              </span>
              <span>
                <FaShare /> Share
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Posting;
