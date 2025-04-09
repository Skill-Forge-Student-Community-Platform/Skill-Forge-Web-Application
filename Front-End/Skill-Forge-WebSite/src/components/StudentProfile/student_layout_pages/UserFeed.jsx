import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import postServices from '../../../services/postServices';
import { useAuthStore } from '../../../store/authStore';

const UserFeed = ({ userId, isLimitedView = true, basePath = '' }) => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const isCurrentUser = currentUser && currentUser._id === userId;

  const getCorrectPath = (path) => {
    if (basePath) return `${basePath}/${path}`;

    const roleType = currentUser?.role?.charAt(0).toUpperCase() + currentUser?.role?.slice(1);
    return `/${roleType}/${currentUser?._id}/${path}`;
  };

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setIsLoading(true);
        const mockPosts = [
          {
            id: '1',
            userId,
            caption: 'Just finished my latest project! Check it out on my profile.',
            image: 'https://via.placeholder.com/600x400',
            createdAt: new Date().toISOString(),
            likes: 24,
            comments: 5
          },
          {
            id: '2',
            userId,
            caption: 'Learning new skills every day. Excited about the future!',
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            likes: 15,
            comments: 3
          },
          {
            id: '3',
            userId,
            caption: 'Attended an amazing workshop today. So much to learn!',
            image: 'https://via.placeholder.com/600x400',
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            likes: 32,
            comments: 7
          }
        ];

        setTimeout(() => {
          setPosts(mockPosts);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching user posts:', error);
        setError('Failed to load posts. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId]);

  const handleViewAllPosts = () => {
    navigate(getCorrectPath('profile/posts'));
  };

  const handleCreatePost = () => {
    navigate(getCorrectPath('home'));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleLikePost = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
      )
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Posts</h2>
        </div>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Posts</h2>
        </div>
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Posts</h2>
        </div>
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500">
            {isCurrentUser
              ? "You haven't created any posts yet."
              : "This user hasn't created any posts yet."}
          </p>
          {isCurrentUser && (
            <button
              className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              onClick={handleCreatePost}
            >
              Create Your First Post
            </button>
          )}
        </div>
      </div>
    );
  }

  const displayPosts = isLimitedView ? posts.slice(0, 2) : posts;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Posts</h2>
        {isLimitedView && posts.length > 2 && (
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors text-sm"
            onClick={handleViewAllPosts}
          >
            View All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {displayPosts.map((post) => (
          <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden">
            {post.image && (
              <div className="w-full h-64 bg-gray-200">
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <p className="text-gray-800 mb-2">{post.caption}</p>
              <p className="text-gray-500 text-sm mb-4">{formatDate(post.createdAt)}</p>

              <div className="flex items-center gap-4">
                <button
                  className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors"
                  onClick={() => handleLikePost(post.id)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <span>{post.likes}</span>
                </button>

                <button className="flex items-center gap-1 text-gray-600 hover:text-blue-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                  </svg>
                  <span>{post.comments || 0}</span>
                </button>

                {isCurrentUser && (
                  <button className="flex items-center gap-1 text-gray-600 hover:text-red-500 transition-colors ml-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {isLimitedView && posts.length > 2 && (
        <button
          className="w-full mt-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
          onClick={handleViewAllPosts}
        >
          View All Posts
        </button>
      )}
    </div>
  );
};

export default UserFeed;
