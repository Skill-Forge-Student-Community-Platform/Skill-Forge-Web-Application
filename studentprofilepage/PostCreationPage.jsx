import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostCreationPage.css";

const PostCreationPage = () => {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!caption.trim() && !image) return;

    // ✅ Get existing posts
    const existingPosts = JSON.parse(localStorage.getItem("posts")) || [];

    // ✅ Create new post
    const newPost = {
      caption,
      image,
    };

    // ✅ Save to localStorage
    localStorage.setItem("posts", JSON.stringify([newPost, ...existingPosts]));

    navigate("/"); // ✅ Redirect to Profile Page
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="post-creation-container">
      <h2>Create a Post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {image && <img src={image} alt="Preview" className="preview-image" />}
        <div className="button-group">
          <button type="submit">Post</button>
          <button type="button" className="cancel-btn" onClick={() => navigate("/")}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default PostCreationPage;
