import Post from "../models/post.js";
import { User } from "../../User-Authentication/models/User.js";
import Notification from "../../Notifications/models/Notification.js";
import { v2 as cloudinary } from "cloudinary";
import { io } from "../../../index.js"; // Import the io instance

/**
 * Create a new post
 * @route POST /api/posts/create
 * @access Private
 */
export const createPost = async (req, res) => {
  try {
    console.log("Received post creation request:", JSON.stringify(req.body, null, 2));
    console.log("User info from token:", req.user);

    const { text, privacy, postType } = req.body;
    let { media, eventDetails, articleDetails } = req.body;
    const userId = req.user.id;

    // Validate at least one content field exists
    if (!text && !media && !eventDetails?.name && !articleDetails?.title) {
      console.log("Missing content in post");
      return res.status(400).json({
        success: false,
        message: "Post must have text, media, or event/article details"
      });
    }

    // Handle media uploads if present
    if (media && media.files && media.files.length > 0) {
      const processedFiles = [];

      for (const file of media.files) {
        try {
          if (file.url && file.url.startsWith('data:')) {
            console.log("Processing base64 image");
            // It's a base64 image that needs to be uploaded to cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.url, {
              folder: "skill-forge/posts",
            });

            processedFiles.push({
              url: uploadResult.secure_url,
              type: file.type,
              altText: file.altText || ""
            });
          } else {
            // URL is already a valid link
            console.log("Using existing URL:", file.url);
            processedFiles.push(file);
          }
        } catch (uploadError) {
          console.error("Error uploading file to Cloudinary:", uploadError);
          throw new Error("Failed to upload media: " + uploadError.message);
        }
      }

      media.files = processedFiles;
    }

    // Create new post
    const newPost = new Post({
      user: userId,
      text,
      media,
      postType: postType || "post",
      privacy: privacy || "Public",
      eventDetails: postType === "event" ? eventDetails : undefined,
      articleDetails: postType === "article" ? articleDetails : undefined
    });

    await newPost.save();

    // Populate user data for the response
    const populatedPost = await Post.findById(newPost._id)
      .populate("user", "-password")
      .populate("comments.user", "-password");

    // Emit socket event for real-time updates
    io.emit('newPost', populatedPost);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost
    });
  } catch (error) {
    console.error("Error in createPost controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating post",
      error: error.message
    });
  }
};

/**
 * Get posts for user feed
 * @route GET /api/posts/feed
 * @access Private
 */
export const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Get user to access following list
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Include user's own posts and posts from followed users
    const followedUsers = [...user.following, userId];

    const posts = await Post.find({
      $or: [
        { user: { $in: followedUsers } },
        { privacy: "Public" }
      ]
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("user", "-password")
    .populate("comments.user", "-password");

    // Get total count for pagination
    const totalPosts = await Post.countDocuments({
      $or: [
        { user: { $in: followedUsers } },
        { privacy: "Public" }
      ]
    });

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        total: totalPosts,
        page: parseInt(page),
        pages: Math.ceil(totalPosts / limit)
      }
    });
  } catch (error) {
    console.error("Error in getFeedPosts controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching feed posts",
      error: error.message
    });
  }
};

/**
 * Get posts by user ID
 * @route GET /api/posts/user/:userId
 * @access Private
 */
export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Get target user to check relationship
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Get current user to check following status
    const currentUser = await User.findById(currentUserId);

    // Determine which posts to show based on privacy and relationship
    let postQuery = { user: userId };

    // If not viewing own posts, apply privacy filters
    if (userId !== currentUserId) {
      const isFollowing = currentUser.following.includes(userId);

      if (isFollowing) {
        // Show public and friends posts
        postQuery = {
          user: userId,
          privacy: { $in: ["Public", "Friends"] }
        };
      } else {
        // Only show public posts
        postQuery = {
          user: userId,
          privacy: "Public"
        };
      }
    }

    const posts = await Post.find(postQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "-password")
      .populate("comments.user", "-password");

    const totalPosts = await Post.countDocuments(postQuery);

    res.status(200).json({
      success: true,
      posts,
      pagination: {
        total: totalPosts,
        page: parseInt(page),
        pages: Math.ceil(totalPosts / limit)
      }
    });
  } catch (error) {
    console.error("Error in getUserPosts controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching user posts",
      error: error.message
    });
  }
};

/**
 * Like or unlike a post
 * @route POST /api/posts/:postId/like
 * @access Private
 */
export const likeUnlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Check if user already liked the post
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      // Unlike post
      await Post.updateOne(
        { _id: postId },
        { $pull: { likes: userId } }
      );

      await User.updateOne(
        { _id: userId },
        { $pull: { likedPosts: postId } }
      );

      // Emit socket event
      io.emit('postLiked', {
        postId,
        userId,
        liked: false
      });

      res.status(200).json({
        success: true,
        message: "Post unliked successfully",
        liked: false
      });
    } else {
      // Like post
      await Post.updateOne(
        { _id: postId },
        { $push: { likes: userId } }
      );

      await User.updateOne(
        { _id: userId },
        { $push: { likedPosts: postId } }
      );

      // Create notification if post is not by current user
      if (post.user.toString() !== userId) {
        const newNotification = new Notification({
          from: userId,
          to: post.user,
          type: "like",
          post: postId
        });
        await newNotification.save();
      }

      // Emit socket event
      io.emit('postLiked', {
        postId,
        userId,
        liked: true
      });

      res.status(200).json({
        success: true,
        message: "Post liked successfully",
        liked: true
      });
    }
  } catch (error) {
    console.error("Error in likeUnlikePost controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing like/unlike",
      error: error.message
    });
  }
};

/**
 * Add comment to post
 * @route POST /api/posts/:postId/comment
 * @access Private
 */
export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Add comment
    const comment = {
      text,
      user: userId,
      createdAt: new Date()
    };

    post.comments.push(comment);
    await post.save();

    // Populate the new comment with user data
    const updatedPost = await Post.findById(postId)
      .populate("comments.user", "-password");

    const newComment = updatedPost.comments[updatedPost.comments.length - 1];

    // Create notification if post is not by current user
    if (post.user.toString() !== userId) {
      const newNotification = new Notification({
        from: userId,
        to: post.user,
        type: "comment",
        post: postId,
        message: text.substring(0, 50) + (text.length > 50 ? "..." : "")
      });
      await newNotification.save();
    }

    // Emit socket event
    io.emit('postCommented', {
      postId,
      comment: newComment
    });

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment
    });
  } catch (error) {
    console.error("Error in addComment controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while adding comment",
      error: error.message
    });
  }
};

/**
 * Delete a post
 * @route DELETE /api/posts/:postId
 * @access Private
 */
export const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Check if user is post owner
    if (post.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this post"
      });
    }

    // Delete any media from Cloudinary
    if (post.media && post.media.files && post.media.files.length > 0) {
      for (const file of post.media.files) {
        if (file.url && file.url.includes('cloudinary')) {
          // Extract public_id from cloudinary URL
          const publicId = file.url.split('/').slice(-1)[0].split('.')[0];
          try {
            await cloudinary.uploader.destroy(`skill-forge/posts/${publicId}`);
          } catch (err) {
            console.error("Error deleting file from Cloudinary:", err);
            // Continue with post deletion even if cloudinary deletion fails
          }
        }
      }
    }

    // Delete post
    await Post.findByIdAndDelete(postId);

    // Delete associated notifications
    await Notification.deleteMany({ post: postId });

    // Emit socket event
    io.emit('postDeleted', postId);

    res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    });
  } catch (error) {
    console.error("Error in deletePost controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting post",
      error: error.message
    });
  }
};

/**
 * Share (repost) a post
 * @route POST /api/posts/:postId/share
 * @access Private
 */
export const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text, privacy } = req.body;
    const userId = req.user.id;

    // Find the original post
    const originalPost = await Post.findById(postId);
    if (!originalPost) {
      return res.status(404).json({ success: false, message: "Original post not found" });
    }

    // Create new repost
    const repost = new Post({
      user: userId,
      text: text,
      isRepost: true,
      originalPost: postId,
      privacy: privacy || "Public",
      postType: "post"
    });

    await repost.save();

    // Update share count on original post
    await Post.findByIdAndUpdate(
      postId,
      {
        $inc: { "shares.count": 1 },
        $push: { "shares.users": userId }
      }
    );

    // Create notification for original post author
    if (originalPost.user.toString() !== userId) {
      const newNotification = new Notification({
        from: userId,
        to: originalPost.user,
        type: "share",
        post: postId
      });
      await newNotification.save();
    }

    // Populate the new repost with user data
    const populatedRepost = await Post.findById(repost._id)
      .populate("user", "-password")
      .populate("originalPost")
      .populate("originalPost.user", "-password");

    // Emit socket event
    io.emit('newPost', populatedRepost);

    res.status(201).json({
      success: true,
      message: "Post shared successfully",
      post: populatedRepost
    });
  } catch (error) {
    console.error("Error in sharePost controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while sharing post",
      error: error.message
    });
  }
};
