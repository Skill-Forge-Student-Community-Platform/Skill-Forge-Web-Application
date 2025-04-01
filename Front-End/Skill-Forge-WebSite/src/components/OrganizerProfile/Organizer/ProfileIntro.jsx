import React, { useState, useEffect } from 'react';

import { FaPencilAlt, FaLinkedin, FaFacebook, FaTwitter, FaInstagram, FaGlobe, FaLaptop, FaTags, FaMapPin, FaStar, FaPhone, FaEnvelope } from 'react-icons/fa';
import './ProfileIntro.css';

const ProfileIntro = ({ userId, isOwnProfile, bio, roleData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedBio, setEditedBio] = useState(bio || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Update editedBio when bio prop changes
  useEffect(() => {
    setEditedBio(bio || '');
  }, [bio]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditedBio(bio || '');
    setIsEditing(false);
    setError(null);
  };

  const handleSaveBio = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (editedBio.length > 1000) {
        setError('Bio cannot exceed 1000 characters');
        setIsSaving(false);
        return;
      }

      // API call to save the bio - this would be implemented in your services
      // await userAPI.updateUserProfile({ bio: editedBio });

      // For demo, just log and simulate a delay
      console.log('Saving bio:', editedBio);
      await new Promise(resolve => setTimeout(resolve, 800));

      setIsEditing(false);
    } catch (err) {
      setError('Failed to save bio. Please try again.');
      console.error('Error saving bio:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Format social link to display name
  const formatSocialPlatform = (url) => {
    if (!url) return null;

    try {
      const hostname = new URL(url).hostname;
      if (hostname.includes('linkedin')) return 'LinkedIn';
      if (hostname.includes('facebook')) return 'Facebook';
      if (hostname.includes('twitter')) return 'Twitter';
      if (hostname.includes('instagram')) return 'Instagram';
      return 'Website';
    } catch (err) {
      return 'Website';
    }
  };

  // Get social links from role data
  const socialLinks = roleData?.socialLinks || {};
  const expertise = roleData?.expertise || [];
  const preferredEventTypes = roleData?.preferredEventTypes || [];

  return (
    <div className="organizer-intro-container">
      <div className="organizer-intro-card">
        <div className="organizer-intro-header">
          <h2 className="organizer-intro-title">About</h2>
          {isOwnProfile && !isEditing && (
            <button className="organizer-intro-edit-btn" onClick={handleEditClick}>
              <FaPencilAlt className="organizer-intro-edit-icon" />
            </button>
          )}
        </div>

        {/* Bio Section */}
        <div className="organizer-bio-section">
          {isEditing ? (
            <div className="organizer-bio-edit">
              <textarea
                className="organizer-bio-textarea"
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                placeholder="Describe your organization..."
                rows={5}
                maxLength={1000}
                disabled={isSaving}
              ></textarea>

              <div className="organizer-bio-char-count">
                <span className={editedBio.length > 900 ? "organizer-char-warning" : ""}>
                  {editedBio.length}/1000
                </span>
              </div>

              {error && (
                <div className="organizer-bio-error">{error}</div>
              )}

              <div className="organizer-bio-actions">
                <button
                  className="organizer-bio-save"
                  onClick={handleSaveBio}
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                <button
                  className="organizer-bio-cancel"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="organizer-bio-text">
              {bio || "No bio available"}
            </p>
          )}
        </div>

        {/* Organization Details */}
        <div className="organizer-details-section">
          {roleData?.organizationName && (
            <div className="organizer-detail-row">
              <FaLaptop className="organizer-detail-icon" />
              <div className="organizer-detail-content">
                <span className="organizer-detail-label">Organization</span>
                <span className="organizer-detail-value">{roleData.organizationName}</span>
              </div>
            </div>
          )}

          {roleData?.industry && (
            <div className="organizer-detail-row">
              <FaMapPin className="organizer-detail-icon" />
              <div className="organizer-detail-content">
                <span className="organizer-detail-label">Industry</span>
                <span className="organizer-detail-value">{roleData.industry}</span>
              </div>
            </div>
          )}

          {roleData?.position && (
            <div className="organizer-detail-row">
              <FaStar className="organizer-detail-icon" />
              <div className="organizer-detail-content">
                <span className="organizer-detail-label">Position</span>
                <span className="organizer-detail-value">{roleData.position}</span>
              </div>
            </div>
          )}

          {roleData?.contactEmail && (
            <div className="organizer-detail-row">
              <FaEnvelope className="organizer-detail-icon" />
              <div className="organizer-detail-content">
                <span className="organizer-detail-label">Contact Email</span>
                <a href={`mailto:${roleData.contactEmail}`} className="organizer-detail-value organizer-detail-link">
                  {roleData.contactEmail}
                </a>
              </div>
            </div>
          )}

          {roleData?.contactPhone && (
            <div className="organizer-detail-row">
              <FaPhone className="organizer-detail-icon" />
              <div className="organizer-detail-content">
                <span className="organizer-detail-label">Contact Phone</span>
                <a href={`tel:${roleData.contactPhone}`} className="organizer-detail-value organizer-detail-link">
                  {roleData.contactPhone}
                </a>
              </div>
            </div>
          )}

          {roleData?.website && (
            <div className="organizer-detail-row">
              <FaGlobe className="organizer-detail-icon" />
              <div className="organizer-detail-content">
                <span className="organizer-detail-label">Website</span>
                <a href={roleData.website} target="_blank" rel="noopener noreferrer" className="organizer-detail-value organizer-detail-link">
                  {roleData.website}
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Areas of Expertise */}
        {expertise.length > 0 && (
          <div className="organizer-expertise-section">
            <h3 className="organizer-section-title">
              <FaTags className="organizer-section-icon" />
              Areas of Expertise
            </h3>
            <div className="organizer-tags">
              {expertise.map((item, index) => (
                <span key={index} className="organizer-tag">{item}</span>
              ))}
            </div>
          </div>
        )}

        {/* Preferred Event Types */}
        {preferredEventTypes.length > 0 && (
          <div className="organizer-event-types-section">
            <h3 className="organizer-section-title">
              <FaLaptop className="organizer-section-icon" />
              Preferred Event Types
            </h3>
            <div className="organizer-tags">
              {preferredEventTypes.map((item, index) => (
                <span key={index} className="organizer-tag organizer-event-tag">{item}</span>
              ))}
            </div>
          </div>
        )}

        {/* Social Links */}
        {Object.values(socialLinks).some(link => link) && (
          <div className="organizer-social-section">
            <h3 className="organizer-section-title">Follow Us</h3>
            <div className="organizer-social-links">
              {socialLinks.linkedin && (
                <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="organizer-social-link linkedin">
                  <FaLinkedin />
                </a>
              )}
              {socialLinks.facebook && (
                <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="organizer-social-link facebook">
                  <FaFacebook />
                </a>
              )}
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="organizer-social-link twitter">
                  <FaTwitter />
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="organizer-social-link instagram">
                  <FaInstagram />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileIntro;
