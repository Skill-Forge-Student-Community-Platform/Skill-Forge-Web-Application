import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Ensure useNavigate is imported
import "./PostSection.css";

const PostSection = () => {
  const navigate = useNavigate(); // ✅ Hook for navigation
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // ✅ Default Posts (Always Displayed)
    const defaultPosts = [
      {
        caption: "Had an amazing day at the AI conference!",
        image: process.env.PUBLIC_URL + "/images/ai.webp",
      },
      {
        caption: "Excited to share my new project on blockchain tech!",
        image: process.env.PUBLIC_URL + "/images/blockchain.png",
      },
    ];

    // ✅ Get saved posts from localStorage
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];

    // ✅ Combine default + saved posts
    const combinedPosts = [...defaultPosts, ...savedPosts];

    setPosts(combinedPosts);
  }, []);

  return (
    <div className="post-section">
      <h2>Post Section</h2>
      <div className="post-container">
        {posts.map((post, index) => (
          <div key={index} className="post-card">
            <img src={post.image} alt="Post" />
            <p>{post.caption}</p>
          </div>
        ))}
      </div>

      {/* ✅ Buttons: Create Post & View All Posts */}
      <div className="post-buttons">
        <button className="post-btn" onClick={() => navigate("/create-post")}>
          Create a Post
        </button>
        <button className="post-btn" onClick={() => navigate("/view-posts")}>
          View All Posts
        </button>
      </div>
    </div>
  );
};

export default PostSection;
