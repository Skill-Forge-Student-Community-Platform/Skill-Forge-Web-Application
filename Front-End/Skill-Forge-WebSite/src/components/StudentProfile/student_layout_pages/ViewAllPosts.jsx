import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PostSection.css";
import postServices from "../../../services/postServices";

const ViewAllPosts = ({ posts = [], userId, isOwnProfile = false }) => {
  const navigate = useNavigate();
  const [loadedPosts, setLoadedPosts] = useState(posts);
  const [isLoading, setIsLoading] = useState(posts.length === 0);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If posts are already provided, use them
    if (posts.length > 0) {
      setLoadedPosts(posts);
      return;
    }

    // Otherwise fetch from API
    const fetchUserPosts = async () => {
      try {
        setIsLoading(true);
        const response = await postServices.getUserPosts(userId);
        setLoadedPosts(response.data.posts || []);
      } catch (error) {
        console.error("Error fetching user posts:", error);
        setError("Failed to load posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId, posts]);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Navigate back to the profile page
  const handleBackToProfile = () => {
    const path = isOwnProfile ? `/profile` : `/student/${userId}`;
    navigate(path);
  };

  // Handle like post (would be connected to API in production)
  const handleLikePost = (postId) => {
    // In a real implementation, you would call an API
    console.log(`Liked post ${postId}`);
    // Then update the state
    setLoadedPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
      )
    );
  };

  if (isLoading) {
    return (
      <div className="post-section">
        <div className="section-header">
          <h2>{isOwnProfile ? "My Posts" : "User Posts"}</h2>
          <button className="back-button" onClick={handleBackToProfile}>
            Back to Profile
          </button>
        </div>
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-section">
        <div className="section-header">
          <h2>{isOwnProfile ? "My Posts" : "User Posts"}</h2>
          <button className="back-button" onClick={handleBackToProfile}>
            Back to Profile
          </button>
        </div>
        <div className="error-message">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="post-section">
      <div className="section-header">
        <h2>{isOwnProfile ? "My Posts" : "User Posts"}</h2>
        <button className="back-button" onClick={handleBackToProfile}>
          Back to Profile
        </button>
      </div>

      {loadedPosts.length === 0 ? (
        <div className="no-posts">
          <p>{isOwnProfile ? "You haven't created any posts yet." : "This user hasn't created any posts yet."}</p>
          {isOwnProfile && (
            <button
              className="create-post-btn"
              onClick={() => navigate("/home")}
            >
              Create Your First Post
            </button>
          )}
        </div>
      ) : (
        <div className="post-container">
          {loadedPosts.map((post) => (
            <div key={post.id} className="post-card">
              {post.image && <img src={post.image} alt="Post" className="post-image" />}
              <div className="post-content">
                <p className="post-caption">{post.caption}</p>
                {post.createdAt && (
                  <p className="post-date">{formatDate(post.createdAt)}</p>
                )}
                <div className="post-interactions">
                  <button
                    className="post-like-btn"
                    onClick={() => handleLikePost(post.id)}
                  >
                    ❤️ {post.likes || 0}
                  </button>
                  <button className="post-comment-btn">💬 Comment</button>
                  {isOwnProfile && (
                    <button className="post-delete-btn">🗑️ Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewAllPosts;
