import mongoose from "mongoose";
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
      console.log(`Processing ${media.files.length} media files for upload...`);
      const processedFiles = [];

      for (const file of media.files) {
        try {
          console.log(`Processing file: ${file.type} - ${file.url?.substring(0, 30)}...`);

          if (file.url && file.url.startsWith('data:')) {
            console.log("Uploading base64 media to Cloudinary...");
            // Extract MIME type from data URL for better type detection
            const mimeMatch = file.url.match(/^data:([^;]+);/);
            const detectedType = mimeMatch ? mimeMatch[1] : null;

            // Determine image vs video from MIME type or use provided type
            let mediaType = file.type;
            if (!mediaType && detectedType) {
              mediaType = detectedType.startsWith('image/') ? 'image' :
                         detectedType.startsWith('video/') ? 'video' : 'image';
            } else if (!mediaType) {
              mediaType = 'image'; // Default to image if no type info available
            }

            // It's a base64 image that needs to be uploaded to cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.url, {
              folder: "skill-forge/posts",
              resource_type: mediaType === 'video' ? 'video' : 'auto',
            });

            console.log("✅ Cloudinary upload successful:", {
              publicId: uploadResult.public_id,
              url: uploadResult.secure_url,
              type: mediaType,
              resource_type: uploadResult.resource_type,
              format: uploadResult.format,
              size: uploadResult.bytes
            });

            processedFiles.push({
              url: uploadResult.secure_url,
              type: uploadResult.resource_type === 'video' ? 'video' : 'image',
              altText: file.altText || ""
            });
          } else {
            // URL is already a valid link
            console.log("Using existing URL:", file.url);

            // Normalize type to ensure schema validation passes
            let mediaType = file.type;
            if (mediaType && (mediaType.startsWith('image/') || mediaType.startsWith('video/'))) {
              mediaType = mediaType.startsWith('image/') ? 'image' : 'video';
            } else if (!mediaType) {
              // Try to guess from URL
              const ext = file.url.split('.').pop().toLowerCase();
              const imgExts = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'];
              const videoExts = ['mp4', 'webm', 'ogg', 'mov', 'avi'];

              if (imgExts.includes(ext)) mediaType = 'image';
              else if (videoExts.includes(ext)) mediaType = 'video';
              else mediaType = 'image'; // Default
            }

            processedFiles.push({
              url: file.url,
              type: mediaType,
              altText: file.altText || ""
            });
          }
        } catch (uploadError) {
          console.error("❌ Error uploading file to Cloudinary:", uploadError);
          throw new Error("Failed to upload media: " + uploadError.message);
        }
      }

      media.files = processedFiles;
      console.log("✅ All media files processed successfully:", JSON.stringify(processedFiles, null, 2));
    }

    // Create new post
    console.log("Creating new post in database...");
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
    console.log(`✅ Post successfully saved to database with ID: ${newPost._id}`);

    // Populate user data for the response
    const populatedPost = await Post.findById(newPost._id)
      .populate("user", "-password")
      .populate("comments.user", "-password");

    console.log("Post created successfully with media:",
      populatedPost.media ? JSON.stringify(populatedPost.media, null, 2) : "No media");

    // Emit socket event for real-time updates
    io.emit('newPost', populatedPost);

    console.log("✅ Post creation complete. Emitting socket event and sending response.");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      post: populatedPost
    });
  } catch (error) {
    console.error("❌ Error in createPost controller:", error);
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
 * Like or unlike a comment
 * @route POST /api/posts/:postId/comments/:commentId/like
 * @access Private
 */
export const likeUnlikeComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Find the comment (could be a nested reply)
    const findCommentById = (comments, id) => {
      for (const comment of comments) {
        if (comment._id.toString() === id) {
          return comment;
        }
      }
      return null;
    };

    const comment = findCommentById(post.comments, commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // Initialize likes array if it doesn't exist
    if (!comment.likes) {
      comment.likes = [];
    }

    // Check if user already liked the comment
    const likeIndex = comment.likes.findIndex(id => id.toString() === userId);
    const isLiked = likeIndex !== -1;

    if (isLiked) {
      // Unlike comment
      comment.likes.splice(likeIndex, 1);
    } else {
      // Like comment
      comment.likes.push(userId);

      // Create notification if comment is not by current user
      if (comment.user.toString() !== userId) {
        const newNotification = new Notification({
          from: userId,
          to: comment.user,
          type: "commentLike",
          post: postId,
          message: comment.text.substring(0, 50) + (comment.text.length > 50 ? "..." : "")
        });
        await newNotification.save();
      }
    }

    await post.save();

    // Emit socket event for real-time updates
    io.emit('commentLiked', {
      postId,
      commentId,
      userId,
      liked: !isLiked,
      likeCount: comment.likes.length
    });

    res.status(200).json({
      success: true,
      message: isLiked ? "Comment unliked successfully" : "Comment liked successfully",
      liked: !isLiked,
      likeCount: comment.likes.length
    });
  } catch (error) {
    console.error("Error in likeUnlikeComment controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing comment like/unlike",
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
    const { text, parentId } = req.body;
    const userId = req.user.id;

    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Create comment with proper fields
    const comment = {
      _id: new mongoose.Types.ObjectId(), // Generate a new ID
      text,
      user: userId,
      parentId: parentId || null, // Handle replies
      createdAt: new Date(),
      likes: []
    };

    // Add comment to post
    post.comments.push(comment);
    await post.save();

    // Populate the new comment with user data for the response
    const updatedPost = await Post.findById(postId)
      .populate({
        path: "comments.user",
        select: "-password"
      });

    // Find the newly added comment in the populated post
    const newComment = updatedPost.comments.find(c =>
      c._id.toString() === comment._id.toString());

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

    // Also notify parent comment author if this is a reply and not the same user
    if (parentId) {
      const parentComment = post.comments.find(c => c._id.toString() === parentId);
      if (parentComment && parentComment.user.toString() !== userId) {
        const newNotification = new Notification({
          from: userId,
          to: parentComment.user,
          type: "reply",
          post: postId,
          message: text.substring(0, 50) + (text.length > 50 ? "..." : "")
        });
        await newNotification.save();
      }
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
 * Delete a comment
 * @route DELETE /api/posts/:postId/comments/:commentId
 * @access Private
 */
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Find the comment
    const commentIndex = post.comments.findIndex(c => c._id.toString() === commentId);
    if (commentIndex === -1) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    const comment = post.comments[commentIndex];

    // Check if user is authorized to delete the comment
    // (either comment owner or post owner)
    if (comment.user.toString() !== userId && post.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment"
      });
    }

    // Find and remove all replies to this comment as well
    const commentAndRepliesIds = [commentId];
    post.comments.forEach(c => {
      if (c.parentId && c.parentId.toString() === commentId) {
        commentAndRepliesIds.push(c._id.toString());
      }
    });

    // Remove comment and all its replies
    post.comments = post.comments.filter(c =>
      !commentAndRepliesIds.includes(c._id.toString()));

    await post.save();

    // Delete associated notifications
    await Notification.deleteMany({
      $or: [
        { type: "comment", post: postId },
        { type: "commentLike", post: postId },
        { type: "reply", post: postId }
      ]
    });

    // Emit socket event
    io.emit('commentDeleted', {
      postId,
      commentIds: commentAndRepliesIds
    });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully"
    });
  } catch (error) {
    console.error("Error in deleteComment controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting comment",
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

/**
 * Get all posts for admin
 * @route GET /api/posts/all
 * @access Admin only
 */
export const getAllPosts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "-password")
      .populate("comments.user", "-password");

    const totalPosts = await Post.countDocuments();

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
    console.error("Error in getAllPosts controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching all posts",
      error: error.message
    });
  }
};

/**
 * Get posts liked by a specific user
 * @route GET /api/posts/likes/:userId
 * @access Private
 */
export const getLikedPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Get user to check their liked posts
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Find posts that this user has liked
    const posts = await Post.find({ likes: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "-password")
      .populate("comments.user", "-password");

    const totalPosts = await Post.countDocuments({ likes: userId });

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
    console.error("Error in getLikedPosts controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching liked posts",
      error: error.message
    });
  }
};

/**
 * Get posts only from followed users
 * @route GET /api/posts/following
 * @access Private
 */
export const getFollowingPosts = async (req, res) => {
  try {
    const userId = req.user.id;

    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    // Get user to access following list
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.following.length) {
      return res.status(200).json({
        success: true,
        posts: [],
        message: "You are not following anyone yet",
        pagination: {
          total: 0,
          page: parseInt(page),
          pages: 0
        }
      });
    }

    const posts = await Post.find({
      user: { $in: user.following },
      $or: [
        { privacy: "Public" },
        { privacy: "Friends" }
      ]
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate("user", "-password")
    .populate("comments.user", "-password");

    const totalPosts = await Post.countDocuments({
      user: { $in: user.following },
      $or: [
        { privacy: "Public" },
        { privacy: "Friends" }
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
    console.error("Error in getFollowingPosts controller:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching following posts",
      error: error.message
    });
  }
};
