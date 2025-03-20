import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllPostsPage.css"; // ✅ Create a new CSS file for styling

const AllPostsPage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // ✅ Fetch all posts from localStorage
    const savedPosts = JSON.parse(localStorage.getItem("posts")) || [];
    setPosts(savedPosts);
  }, []);

  return (
    <div className="all-posts-container">
      <h2>All Posts</h2>

      {/* ✅ Display all posts */}
      <div className="all-posts-grid">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div key={index} className="post-card">
              <img src={post.image} alt="Post" />
              <p>{post.caption}</p>
            </div>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </div>

      {/* ✅ Back Button */}
      <button className="back-btn" onClick={() => navigate("/")}>
        Back to Profile
      </button>
    </div>
  );
};

export default AllPostsPage;
