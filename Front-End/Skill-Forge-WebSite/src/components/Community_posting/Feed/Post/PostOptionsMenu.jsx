import React, { useState, useRef, forwardRef } from 'react';
import {
  FaEdit,
  FaTrash,
  FaBookmark,
  FaRegBookmark,
  FaGlobe,
  FaUserFriends,
  FaUserSlash,
  FaUserPlus,
  FaUserMinus,
  FaThumbsUp,
  FaThumbsDown,
  FaFlag,
  FaLink,
  FaChevronRight,
  FaChevronLeft,
  FaLock
} from 'react-icons/fa';
import './PostOptionsMenu.css';

const PostOptionsMenu = forwardRef(({
  post,
  isPostOwner,
  onEditPost,
  onDeletePost,
  onSavePost,
  onChangePrivacy,
  onUnfollow,
  onInterested,
  onNotInterested,
  onReportPost,
  onCopyLink
}, menuRef) => {
  // State to track if privacy submenu is open
  const [showPrivacySubmenu, setShowPrivacySubmenu] = useState(false);

  // Helper to copy post URL to clipboard
  const handleCopyLink = () => {
    // Generate a post URL - you might need to adjust this based on your routing
    const postUrl = `${window.location.origin}/post/${post._id}`;

    try {
      navigator.clipboard.writeText(postUrl);
      onCopyLink(true);
    } catch (err) {
      console.error("Failed to copy link:", err);
      onCopyLink(false);
    }
  };

  // Toggle privacy submenu
  const togglePrivacySubmenu = (e) => {
    e.stopPropagation();
    setShowPrivacySubmenu(!showPrivacySubmenu);
  };

  // Stop propagation to prevent closing when clicking inside the menu
  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className="post-options-menu-container"
      ref={menuRef}
      onClick={handleMenuClick}
    >
      {/* Backdrop for mobile that closes menu when clicked */}
      {showPrivacySubmenu && <div className="menu-backdrop" onClick={togglePrivacySubmenu}></div>}

      {showPrivacySubmenu ? (
        /* Privacy Submenu */
        <div className="post-options-menu privacy-submenu">
          <div className="submenu-header">
            <button onClick={togglePrivacySubmenu} className="back-button">
              <FaChevronLeft />
            </button>
            <span>Privacy Settings</span>
          </div>

          <button
            className={`menu-item ${post.privacy === 'Public' ? 'active' : ''}`}
            onClick={() => {
              onChangePrivacy(post._id, 'Public');
              setShowPrivacySubmenu(false);
            }}
          >
            <FaGlobe className="menu-icon" />
            <div className="menu-text">
              <div>Public</div>
              <small>Anyone can see this post</small>
            </div>
          </button>

          <button
            className={`menu-item ${post.privacy === 'Friends' ? 'active' : ''}`}
            onClick={() => {
              onChangePrivacy(post._id, 'Friends');
              setShowPrivacySubmenu(false);
            }}
          >
            <FaUserFriends className="menu-icon" />
            <div className="menu-text">
              <div>Friends</div>
              <small>Only your connections can see this</small>
            </div>
          </button>

          <button
            className={`menu-item ${post.privacy === 'Friends except...' ? 'active' : ''}`}
            onClick={() => {
              onChangePrivacy(post._id, 'Friends except...');
              setShowPrivacySubmenu(false);
            }}
          >
            <FaUserSlash className="menu-icon" />
            <div className="menu-text">
              <div>Friends except...</div>
              <small>Hide from specific connections</small>
            </div>
          </button>

          <button
            className={`menu-item ${post.privacy === 'Specific friends' ? 'active' : ''}`}
            onClick={() => {
              onChangePrivacy(post._id, 'Specific friends');
              setShowPrivacySubmenu(false);
            }}
          >
            <FaUserPlus className="menu-icon" />
            <div className="menu-text">
              <div>Specific friends</div>
              <small>Choose who can see this</small>
            </div>
          </button>

          <button
            className={`menu-item ${post.privacy === 'Only me' ? 'active' : ''}`}
            onClick={() => {
              onChangePrivacy(post._id, 'Only me');
              setShowPrivacySubmenu(false);
            }}
          >
            <FaLock className="menu-icon" />
            <div className="menu-text">
              <div>Only me</div>
              <small>Only you can see this post</small>
            </div>
          </button>
        </div>
      ) : (
        /* Main Menu */
        <div className="post-options-menu main-menu">
          {/* Owner-only options */}
          {isPostOwner && (
            <>
              <button
                className="menu-item"
                onClick={() => onEditPost(post)}
              >
                <FaEdit className="menu-icon" />
                <span>Edit post</span>
              </button>

              <button
                className="menu-item text-danger"
                onClick={() => onDeletePost(post._id)}
              >
                <FaTrash className="menu-icon" />
                <span>Delete post</span>
              </button>

              <div className="menu-divider"></div>

              <button
                className="menu-item with-arrow"
                onClick={togglePrivacySubmenu}
              >
                <div className="menu-content">
                  {post.privacy === 'Public' ? <FaGlobe className="menu-icon" /> :
                   post.privacy === 'Friends' ? <FaUserFriends className="menu-icon" /> :
                   post.privacy === 'Friends except...' ? <FaUserSlash className="menu-icon" /> :
                   post.privacy === 'Specific friends' ? <FaUserPlus className="menu-icon" /> :
                   <FaLock className="menu-icon" />}
                  <div className="menu-text">
                    <div>Privacy</div>
                    <small>{post.privacy}</small>
                  </div>
                </div>
                <FaChevronRight className="arrow-icon" />
              </button>

              <div className="menu-divider"></div>
            </>
          )}

          {/* Common options for all users */}
          <button
            className="menu-item"
            onClick={() => onSavePost(post._id, post.isSaved)}
          >
            {post.isSaved ? (
              <>
                <FaBookmark className="menu-icon active" />
                <span>Unsave post</span>
              </>
            ) : (
              <>
                <FaRegBookmark className="menu-icon" />
                <span>Save post</span>
              </>
            )}
          </button>

          <button

            className="menu-item"
            onClick={handleCopyLink}
          >
            <FaLink className="menu-icon" />
            <span>Copy link</span>
          </button>

          {!isPostOwner && (
            <>
              <div className="menu-divider"></div>

              <button
                className="menu-item"
                onClick={() => onInterested(post._id)}
              >
                <FaThumbsUp className="menu-icon active" />
                <span>Show more like this</span>
              </button>

              <button
                className="menu-item"
                onClick={() => onNotInterested(post._id)}
              >
                <FaThumbsDown className="menu-icon" />
                <span>Show less like this</span>
              </button>

              <button
                className="menu-item"
                onClick={() => onUnfollow(post.user._id)}
              >
                <FaUserMinus className="menu-icon" />
                <span>Unfollow {post.user.Username || 'user'}</span>
              </button>

              <button
                className="menu-item text-danger"
                onClick={() => onReportPost(post._id)}
              >
                <FaFlag className="menu-icon" />
                <span>Report post</span>
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
});

export default PostOptionsMenu;
