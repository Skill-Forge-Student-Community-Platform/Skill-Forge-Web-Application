import React, { useState, useEffect } from 'react';
import './Feed.css';
import PostTemplate from './Post/PostTemplate';
import LightBox from './ImageRendering/LightBox';
import UploadProgressBar from '../UploadProgressBar/UploadProgressBar';
import { FaUserPlus, FaBell, FaGlobe, FaCalendarAlt, FaSyncAlt } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import postServices from '../../../services/postServices';

const Feed = ({
  posts,
  onLike,
  onComment,
  onShare,
  onDelete,
  onEdit,
  onSavePost,
  onChangePrivacy,
  onUnfollow,
  onNotInterested,
  onInterested,
  onReportPost,
  onDeleteComment,
  currentUserId,
  lastPostRef,
  // Upload progress props
  uploadProgress,
  isUploading,
  uploadError,
  onCancelUpload,
  // Loading state
  isLoading = false,
  // New props for refresh functionality
  onRefresh,
  lastUpdated
}) => {
  // Track media preview state
  const [mediaPreview, setMediaPreview] = useState({
    open: false,
    post: null,
    mediaIndex: 0,
    media: []
  });

  // Track active tab
  const [activeTab, setActiveTab] = useState('all');

  // Track if new posts are available
  const [newPostsAvailable, setNewPostsAvailable] = useState(false);

  // Store last check time for new posts
  const [lastCheckTime, setLastCheckTime] = useState(Date.now());

  // Filter posts based on active tab
  const filteredPosts = activeTab === 'all'
    ? posts
    : posts?.filter(post => post.type === 'event');

  // Check for new posts periodically
  useEffect(() => {
    const checkForNewPosts = async () => {
      try {
        // This would typically be an API call to check for new posts
        // For now, we'll simulate by checking if lastUpdated is more recent than lastCheckTime
        if (lastUpdated && new Date(lastUpdated).getTime() > lastCheckTime) {
          setNewPostsAvailable(true);
        }
      } catch (error) {
        console.error('Error checking for new posts:', error);
      }
    };

    const interval = setInterval(checkForNewPosts, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [lastUpdated, lastCheckTime]);

  // Handle refresh/load new posts
  const handleLoadNewPosts = () => {
    if (onRefresh) {
      onRefresh();
      setNewPostsAvailable(false);
      setLastCheckTime(Date.now());
      toast.success("Feed updated with latest posts");
    }
  };

  // Handle media click to open lightbox
  const handleMediaClick = (post, mediaIndex) => {
    if (post.media && post.media.files && post.media.files.length > 0) {
      setMediaPreview({
        open: true,
        post: post,
        mediaIndex: mediaIndex || 0,
        media: post.media.files
      });
    }
  };

  // Close media preview
  const closeMediaPreview = () => {
    setMediaPreview({
      open: false,
      post: null,
      mediaIndex: 0,
      media: []
    });
  };

  // Navigate media in lightbox
  const prevMedia = () => {
    setMediaPreview(prev => ({
      ...prev,
      mediaIndex: prev.mediaIndex === 0 ? prev.media.length - 1 : prev.mediaIndex - 1
    }));
  };

  const nextMedia = () => {
    setMediaPreview(prev => ({
      ...prev,
      mediaIndex: (prev.mediaIndex + 1) % prev.media.length
    }));
  };

  // Check if current user is post owner
  const isPostOwner = (post) => {
    if (!post || !post.user) return false;
    return currentUserId && post.user._id === currentUserId;
  };

  // Handle like/unlike comment with proper API integration
  const handleLikeComment = async (postId, commentId, isLiked) => {
    try {
      // Use the postServices to handle the API call
      const response = await postServices.likeComment(postId, commentId);
      toast.success(response.liked ? "Comment liked" : "Comment unliked");
      return response;
    } catch (error) {
      toast.error("Failed to update comment like");
      console.error("Comment like error:", error);
    }
  };

  return (
    <div className="feed-container">
      {/* Upload Progress Bar */}
      <UploadProgressBar
        progress={uploadProgress}
        isUploading={isUploading}
        onCancel={onCancelUpload}
        error={uploadError}
      />

      {/* Feed Header with Tabs */}
      <div className="feed-header">
        <div className="feed-tabs">
          <button
            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
             <span>All Posts</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
             <span>Events</span>
          </button>
        </div>
      </div>

      {/* New Posts Notification Button */}
      {newPostsAvailable && (
        <button className="new-posts-button" onClick={handleLoadNewPosts}>
          <FaSyncAlt /> New posts available
        </button>
      )}


      {/* Empty Feed State */}
      {!isLoading && (!filteredPosts || filteredPosts.length === 0) && (
        <div className="empty-feed">
          <div className="empty-feed-card" data-type={activeTab === 'all' ? 'posts' : 'events'}>
            <div className="empty-feed-icon">
              {activeTab === 'all' ? <FaUserPlus /> : <FaCalendarAlt />}
            </div>
            <h2>
              {activeTab === 'all'
                ? "Your feed is empty"
                : "No events found"}
            </h2>
            <p>
              {activeTab === 'all'
                ? "Start connecting with friends and fill up your community with interesting posts."
                : "There are currently no events to display. Check back later."}
            </p>

          </div>
        </div>
      )}

      {/* Render Posts */}
      <div className="posts-container">
        {filteredPosts?.map((post, index) => (
          <PostTemplate
            key={post._id || index}
            post={post}
            currentUserId={currentUserId}
            isLastPost={index === filteredPosts.length - 1}
            lastPostRef={lastPostRef}
            onLike={onLike}
            onComment={onComment}
            onShare={onShare}
            onDelete={onDelete}
            onEdit={onEdit}
            onSavePost={onSavePost}
            onChangePrivacy={onChangePrivacy}
            onUnfollow={onUnfollow}
            onNotInterested={onNotInterested}
            onInterested={onInterested}
            onReportPost={onReportPost}
            onDeleteComment={onDeleteComment}
            onMediaClick={handleMediaClick}
          />
        ))}
      </div>

      {/* Media Lightbox */}
      {mediaPreview.open && (
        <LightBox
          media={mediaPreview.media}
          currentIndex={mediaPreview.mediaIndex}
          post={mediaPreview.post}
          onClose={closeMediaPreview}
          onPrev={prevMedia}
          onNext={nextMedia}
          onLike={onLike}
          onComment={onComment}
          onShare={onShare}
          onDelete={isPostOwner(mediaPreview.post) ? onDelete : null}
          currentUserId={currentUserId}
        />
      )}
    </div>
  );
};

export default Feed;
