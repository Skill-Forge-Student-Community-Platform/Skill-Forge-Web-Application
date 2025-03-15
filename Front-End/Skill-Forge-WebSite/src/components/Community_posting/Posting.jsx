import React, { useState, useEffect, useRef } from "react";
import "./Posting.css";
import { FaImages, FaCalendarAlt, FaNewspaper, FaGlobe, FaUserFriends, FaUserSlash, FaUserPlus } from "react-icons/fa";
import { toast } from 'react-hot-toast'; // Assuming you're using react-hot-toast
import io from "socket.io-client"; // Import Socket.IO client
import PostModal from "./Posting_pagers/PostModal/PostModal";
import EventModal from "./Posting_pagers/EventModal/EventModal";
import ArticleModal from "./Posting_pagers/ArticleModal/ArticleModal";
import PrivacyModal from "./Posting_pagers/PrivacyModal/PrivacyModal";
import MediaUploadModal from './Posting_pagers/MediaUploadModal/MediaUploadModal';
import ShareModal from './Posting_pagers/ShareModal/ShareModal'; // Import the new ShareModal
import Feed from './Feed/Feed';
import Profile_pic from "../../Assets/test-profile-pic.jpg";
import postServices from '../../services/postServices';
import { compressImage, processVideo } from '../../utils/imageCompression';

// Add user as a prop to your component
function Posting({ user }) {
  const [activeModal, setActiveModal] = useState(null);
  const [eventDetails, setEventDetails] = useState(null);
  const [text, setText] = useState("");
  const [media, setMedia] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [privacy, setPrivacy] = useState("Friends");
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [tempMedia, setTempMedia] = useState([]);

  // Posts state with loading and error handling
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // New states for upload progress tracking
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  // For handling upload cancellation
  const cancelUploadRef = useRef(false);

  // Default profile picture as fallback
  const defaultProfilePic = Profile_pic;

  // Use authenticated user data or fall back to default values
  const userData = {
    name: user?.Username || user?.name || "User",
    profilePicture: user?.profilePicture || defaultProfilePic
  };

  // Socket state
  const [socket, setSocket] = useState(null);

  // State for share modal
  const [postToShare, setPostToShare] = useState(null);

  // Last post ref for infinite scrolling
  const lastPostRef = useRef(null);
  const observerRef = useRef(null);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [page]);

  // Set up Socket.IO connection
  useEffect(() => {
    // Connect to the Socket server
    const socketInstance = io(process.env.REACT_APP_SOCKET_URL || "http://localhost:5000");
    setSocket(socketInstance);

    // Socket event handlers
    socketInstance.on("connect", () => {
      console.log("Socket connected");
    });

    socketInstance.on("newPost", (post) => {
      if (!user || post.user._id !== user._id) { // Don't duplicate your own posts
        setPosts(prev => [post, ...prev]);
        toast.info(`New post from ${post.user.Username || 'someone'}`);
      }
    });

    socketInstance.on("postLiked", ({ postId, userId, liked }) => {
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            isLikedByUser: user && userId === user._id ? liked : post.isLikedByUser,
            likes: liked
              ? [...(post.likes || []), userId]
              : (post.likes || []).filter(id => id !== userId)
          };
        }
        return post;
      }));
    });

    socketInstance.on("postCommented", ({ postId, comment }) => {
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: [...(post.comments || []), comment]
          };
        }
        return post;
      }));
    });

    // Add handler for comment deletion events
    socketInstance.on("commentDeleted", ({ postId, commentIds }) => {
      console.log("Comment deleted event received:", { postId, commentIds });

      // Update posts by filtering out deleted comments
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          return {
            ...post,
            comments: (post.comments || []).filter(comment =>
              !commentIds.includes(comment._id.toString())
            )
          };
        }
        return post;
      }));
    });

    // Clean up on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting && hasMore && !isLoading) {
        loadMorePosts();
      }
    }, { threshold: 0.5 });

    if (lastPostRef.current) {
      observerRef.current.observe(lastPostRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [posts.length, hasMore, isLoading]);

  useEffect(() => {
    if (activeModal) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [activeModal]);

  // Function to fetch posts from API
  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await postServices.getFeedPosts(page);

      if (page === 1) {
        setPosts(response.posts);
      } else {
        setPosts(prev => [...prev, ...response.posts]);
      }

      // Check if there are more posts to load
      setHasMore(page < response.pagination.pages);

    } catch (err) {
      setError(err.message || "Failed to fetch posts");
      toast.error(err.message || "Failed to fetch posts");
    } finally {
      setIsLoading(false);
    }
  };

  // Load more posts
  const loadMorePosts = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const closeWindow = () => {
    setActiveModal(null);
    setText("");
    setMedia([]);
    setIsDisabled(true);
    setEventDetails(null);
    setTempMedia([]);
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
    setMedia(mediaData);
    setIsDisabled(false);
    setActiveModal("post");
    setTempMedia([]);
  };

  const handleClearMedia = () => {
    setMedia([]);
    setIsDisabled(text.trim() === '');
  };

  const handleModalClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      closeWindow();
    }
  };

  const openMediaModal = (existingMedia = []) => {
    if (media.length > 0) return;
    setTempMedia(Array.isArray(existingMedia) ? existingMedia : []);
    setActiveModal("media");
  };

  const handleCancelUpload = () => {
    if (isUploading) {
      cancelUploadRef.current = true;
      setIsUploading(false);
      setUploadProgress(0);
      toast.info("Upload cancelled");
    }
  };

  // Create new post using API - optimized version with progress
  const handleCreatePost = async () => {
    try {
      // Reset cancel flag
      cancelUploadRef.current = false;

      // Skip if no content
      if (!text.trim() && (!media || media.length === 0) && !eventDetails) {
        toast.error("Please add some text, media, or event details");
        return;
      }

      // *** Important: Close modal immediately when starting upload ***
      closeWindow();

      // Indicate upload starting
      setIsUploading(true);
      setUploadProgress(0);
      setUploadError(null);

      // Initialize mediaData to null
      let mediaData = null;

      // Check if we have media to process
      if (media && media.media && Array.isArray(media.media) && media.media.length > 0) {
        try {
          const totalFiles = media.media.length;
          console.log(`Processing ${totalFiles} media files...`);
          setUploadProgress(5); // Start with 5% progress

          // Process files with optimized approach - compress images, process in parallel batches
          const processedFiles = [];
          const startTime = Date.now();

          // Process files in batches of 2 for better performance
          const batchSize = 2;
          const batches = Math.ceil(media.media.length / batchSize);

          for (let i = 0; i < batches; i++) {
            if (cancelUploadRef.current) {
              throw new Error("Upload cancelled by user");
            }

            const start = i * batchSize;
            const end = Math.min((i + 1) * batchSize, media.media.length);
            const batchItems = media.media.slice(start, end);

            // Process this batch in parallel
            const batchPromises = batchItems.map(async (item, itemIndex) => {
              const index = start + itemIndex;
              let processedItem = null;

              // If it's a File object, compress and convert to base64
              if (item instanceof File) {
                if (item.type.startsWith('image/')) {
                  // Compress image
                  const base64Data = await compressImage(item, {
                    maxWidth: 1600,
                    maxHeight: 1600,
                    quality: 0.85
                  });

                  processedItem = {
                    url: base64Data,
                    type: 'image',
                    altText: ""
                  };
                } else if (item.type.startsWith('video/')) {
                  // Process video
                  const videoData = await processVideo(item);
                  processedItem = {
                    url: videoData,
                    type: 'video',
                    altText: ""
                  };
                }
              }
              // If it already has a URL
              else if (item.url) {
                processedItem = {
                  url: item.url,
                  type: item.type || guessFileTypeFromURL(item.url),
                  altText: item.altText || ""
                };
              }
              // If it has a file property that's a File object
              else if (item.file instanceof File) {
                if (item.file.type.startsWith('image/')) {
                  const base64Data = await compressImage(item.file, {
                    maxWidth: 1600,
                    maxHeight: 1600,
                    quality: 0.85
                  });

                  processedItem = {
                    url: base64Data,
                    type: 'image',
                    altText: item.altText || ""
                  };
                } else if (item.file.type.startsWith('video/')) {
                  const videoData = await processVideo(item.file);
                  processedItem = {
                    url: videoData,
                    type: 'video',
                    altText: item.altText || ""
                  };
                }
              }

              return processedItem;
            });

            // Wait for all files in this batch to process
            const batchResults = await Promise.all(batchPromises);
            processedFiles.push(...batchResults.filter(Boolean));

            // Update progress - media processing is 50% of total progress
            const progressValue = 5 + ((i + 1) / batches) * 45;
            setUploadProgress(progressValue);
          }

          if (processedFiles.length > 0) {
            mediaData = {
              layout: media.layout || "single",
              files: processedFiles
            };

            const processingTime = Date.now() - startTime;
            console.log(`Media processed successfully in ${processingTime}ms:`, processedFiles.length);
          }
        } catch (processError) {
          if (cancelUploadRef.current) {
            setIsUploading(false);
            return; // Silent return on cancellation
          }

          console.error("Error processing media:", processError);
          setUploadError("Failed to process media files");
          setIsUploading(false);
          toast.error("Failed to process media files");
          return;
        }
      }

      if (cancelUploadRef.current) {
        setIsUploading(false);
        return;
      }

      // Update progress before sending to server
      setUploadProgress(50);

      // Prepare post data with properly formatted media
      const postData = {
        text: text.trim(),
        privacy,
        media: mediaData,
        postType: eventDetails ? "event" : "post",
        eventDetails: eventDetails || undefined
      };

      console.log("Submitting post data with media:", mediaData ? mediaData.files.length : 0);

      // Submit post to API
      setUploadProgress(75); // Server receiving data
      const response = await postServices.createPost(postData);

      // Set progress to 100% when complete
      setUploadProgress(100);

      // Add new post to state - ensure we prepend to show newest first
      setPosts(prevPosts => [response.post, ...prevPosts]);

      // Emit socket event if available
      if (socket && socket.connected) {
        socket.emit('createPost', response.post);
      }

      // Keep progress bar visible briefly for success feedback
      setTimeout(() => {
        if (!cancelUploadRef.current) {
          setIsUploading(false);
        }
      }, 1500);

      // Show success message
      toast.success("Post created successfully!");

    } catch (err) {
      if (cancelUploadRef.current) {
        return; // Silent return on cancellation
      }

      const errorMessage = typeof err === 'object' ? err.message || 'Post creation failed' : String(err);
      setUploadError(errorMessage);
      toast.error(errorMessage);
      console.error("Post creation error:", err);

      // Reset upload state after showing error
      setTimeout(() => {
        setIsUploading(false);
        setUploadError(null);
      }, 3000);
    }
  };

  // Helper function to convert File object to data URL
  const convertFileToDataURL = (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error("No file provided"));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  // Helper function to guess file type from URL
  const guessFileTypeFromURL = (url) => {
    if (!url) return 'image'; // Default to image
    const extension = url.split('.').pop().toLowerCase();

    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
    const videoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];

    if (imageExtensions.includes(extension)) return 'image';
    if (videoExtensions.includes(extension)) return 'video';

    return 'image'; // Default to image if unknown
  };

  const handleLikePost = async (postId) => {
    try {
      const response = await postServices.likePost(postId);

      // Update posts with optimistic UI update
      setPosts(prevPosts => prevPosts.map(post =>
        post._id === postId ? {
          ...post,
          isLikedByUser: response.liked,
          likes: response.liked
            ? [...(post.likes || []), user.id]
            : (post.likes || []).filter(id => id !== user.id)
        } : post
      ));

    } catch (error) {
      toast.error("Failed to update like");
      console.error("Like error:", error);
    }
  };

  const handleAddComment = async (postId, commentText) => {
    try {
      const response = await postServices.addComment(postId, commentText);

      // Update posts state with new comment
      setPosts(prevPosts => prevPosts.map(post =>
        post._id === postId ? {
          ...post,
          comments: [...(post.comments || []), response.comment]
        } : post
      ));

    } catch (error) {
      toast.error("Failed to add comment");
      console.error("Comment error:", error);
    }
  };

  const handleSharePost = async (postId) => {
    try {
      // Find the post to share
      const postToShare = posts.find(post => post._id === postId);
      if (postToShare) {
        setPostToShare(postToShare);
        setActiveModal("share");
      } else {
        toast.error("Post not found");
      }
    } catch (error) {
      toast.error("Failed to prepare share");
      console.error("Share error:", error);
    }
  };

  // Finalize share submission
  const finalizeShare = async (postId, text, privacy) => {
    try {
      const response = await postServices.sharePost(postId, text, privacy);

      // Add new shared post to state
      setPosts(prevPosts => [response.post, ...prevPosts]);

      // Emit socket event if available
      if (socket) {
        socket.emit("sharePost", response.post);
      }

      toast.success("Post shared successfully!");
      closeWindow();
    } catch (error) {
      toast.error("Failed to share post");
      console.error("Share error:", error);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await postServices.deletePost(postId);

      // Remove deleted post from state
      setPosts(prevPosts => prevPosts.filter(post => post._id !== postId));

      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
      console.error("Delete error:", error);
    }
  };

  // Add a new handler for comment deletion
  const handleDeleteComment = async (postId, commentId) => {
    try {
      // Call the API to delete the comment
      await postServices.deleteComment(postId, commentId);

      // Update local state immediately to provide optimistic UI update
      setPosts(prev => prev.map(post => {
        if (post._id === postId) {
          // Filter out the deleted comment and any replies to it
          const updatedComments = post.comments.filter(comment => {
            const isTargetComment = comment._id === commentId;
            const isReplyToTarget = comment.parentId === commentId;
            return !(isTargetComment || isReplyToTarget);
          });

          return {
            ...post,
            comments: updatedComments
          };
        }
        return post;
      }));

      toast.success("Comment deleted successfully");
    } catch (error) {
      toast.error("Failed to delete comment");
      console.error("Delete comment error:", error);
    }
  };

  return (
    <div className="community-posting">
      <div className="post-input-container">

        <div className="input-row">
          <img src={userData.profilePicture} alt="Profile" className="user-icon" />
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
          {/* <span className="action-icon article" onClick={() => setActiveModal("article")}>
            <FaNewspaper title="Write Article" />
            <span className="icon-text">Article</span>
          </span> */}
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
              existingMedia={tempMedia}
            />
          ) : activeModal === "post" ? (
            <PostModal
              closeWindow={closeWindow}
              text={text}
              handleTextChange={handleTextChange}
              privacy={privacy}
              setShowPrivacyModal={setShowPrivacyModal}
              isDisabled={isDisabled}
              user={userData}
              media={{ ...media, onClear: handleClearMedia }}
              openMediaModal={openMediaModal}
              onPost={handleCreatePost}
            />
          ) : activeModal === "event" ? (
            <EventModal
              closeWindow={closeWindow}
              eventDetails={eventDetails}
              setEventDetails={setEventDetails}
            />
          ) : activeModal === "article" ? (
            <ArticleModal closeWindow={closeWindow} />
          ) : activeModal === "share" ? (
            <ShareModal
              closeWindow={closeWindow}
              postToShare={postToShare}

              onShare={finalizeShare}
              user={userData}
            />
          ) : null}
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchPosts}>Try Again</button>
        </div>
      )}

      {/* Feed with loading state */}
      {isLoading && page === 1 ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          <Feed
            posts={posts}
            onLike={handleLikePost}
            onComment={handleAddComment}
            onShare={handleSharePost}
            onDelete={handleDeletePost}
            onDeleteComment={handleDeleteComment} // Pass the deletion handler
            lastPostRef={lastPostRef} // Pass the ref for the last post
            currentUserId={user?._id} // Pass the current user ID
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            uploadError={uploadError}
            onCancelUpload={handleCancelUpload}
          />

          {/* Load more button */}
          {hasMore && (
            <div className="load-more">
              <button
                onClick={loadMorePosts}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Load More"}
              </button>
            </div>
          )}

          {isLoading && page > 1 && (
            <div className="loading-more">Loading more posts...</div>
          )}
        </>
      )}
    </div>
  );
}

export default Posting;
