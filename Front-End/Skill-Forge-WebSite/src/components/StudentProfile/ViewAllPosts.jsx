import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PostSection.css";

const ViewAllPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // ✅ Default Posts (Always displayed)
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

    // ✅ Retrieve saved posts from localStorage
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];

    // ✅ Ensure default posts are included
    const combinedPosts = [...defaultPosts, ...savedPosts];

    // ✅ Store the combined list in state
    setPosts(combinedPosts);
  }, []);

  return (
    <div className="post-section">
      <h2>All Posts</h2>
      <div className="post-container">
        {posts.map((post, index) => (
          <div key={index} className="post-card">
            <img src={post.image} alt="Post" />
            <p>{post.caption}</p>
          </div>
        ))}
      </div>

      <button className="view-posts-btn" onClick={() => navigate("/")}>
        Back to Profile
      </button>
    </div>
  );
};

export default ViewAllPosts;
