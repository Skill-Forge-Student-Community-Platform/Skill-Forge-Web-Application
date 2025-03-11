import { io } from "../../../index.js";

export const socketHandlers = {
  /**
   * Emit event when a new post is created
   * @param {Object} post - The newly created post object
   */
  emitNewPost: (post) => {
    io.emit('newPost', post);
  },

  /**
   * Emit event when a post is liked or unliked
   * @param {String} postId - ID of the post
   * @param {String} userId - ID of the user performing the action
   * @param {Boolean} liked - Whether the post is liked or unliked
   */

  emitPostLiked: (postId, userId, liked) => {
    io.emit('postLiked', { postId, userId, liked });
  },

  /**
   * Emit event when a comment is added to a post
   * @param {String} postId - ID of the post
   * @param {Object} comment - The newly created comment object
   */
  emitNewComment: (postId, comment) => {
    io.emit('postCommented', { postId, comment });
  },

  /**
   * Emit event when a post is deleted
   * @param {String} postId - ID of the deleted post
   */
  emitPostDeleted: (postId) => {
    io.emit('postDeleted', postId);
  },

  /**
   * Emit a direct notification to a specific user
   * @param {String} userId - ID of the user to notify
   * @param {Object} notification - Notification data
   */
  emitUserNotification: (userId, notification) => {
    io.to(`user:${userId}`).emit('notification', notification);
  }
};
