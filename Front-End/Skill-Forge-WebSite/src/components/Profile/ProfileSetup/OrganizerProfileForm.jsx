import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Upload, X, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/auth";

const OrganizerProfileForm = () => {
  console.log('OrganizerProfileForm component mounted');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateProfile } = useAuthStore();

  useEffect(() => {
    console.log('OrganizerProfileForm rendered with user:', user);
  }, [user]);

  const [formData, setFormData] = useState({
    organizationName: '',
    industry: '',
    position: '',
    bio: '',
    expertise: [],
    contactEmail: user?.email || '',
    contactPhone: '',
    website: '',
    socialLinks: {
      linkedin: '',
      facebook: '',
      twitter: '',
      instagram: ''
    },
    profilePicture: null
  });

  const [newExpertise, setNewExpertise] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  // Handle basic form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle social links changes
  const handleSocialLinkChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, [platform]: value }
    }));
  };

  // Add new expertise
  const addExpertise = () => {
    if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise('');
    }
  };

  // Remove expertise
  const removeExpertise = (expertiseToRemove) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(item => item !== expertiseToRemove)
    }));
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePicture: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove profile picture
  const removeProfilePicture = () => {
    setFormData(prev => ({ ...prev, profilePicture: null }));
    setImagePreview(null);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create form data object for file upload
      const profileFormData = new FormData();

      // Add profile picture if exists
      if (formData.profilePicture) {
        profileFormData.append('profilePicture', formData.profilePicture);
      }

      // Add other form data as JSON
      const dataToSend = { ...formData };
      delete dataToSend.profilePicture; // Remove file from JSON data
      profileFormData.append('profileData', JSON.stringify(dataToSend));

      console.log("Submitting organizer profile data...");

      // Use the updateProfile method from authStore
      const response = await updateProfile(profileFormData);
      console.log("Organizer profile update successful:", response);

      toast.success('Organization profile created successfully!');

      // Properly format the role for the URL (capitalize first letter)
      const role = user.role.charAt(0).toUpperCase() + user.role.slice(1);

      // Navigate to the proper role-specific home URL
      const targetUrl = `/${role}/${user._id}/home`;
      console.log(`Navigation to role-specific home: ${targetUrl}`);

      // Use replace: true to prevent going back to the profile setup page
      navigate(targetUrl, { replace: true });
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMsg = error.message || 'Failed to create profile. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f3f2ef]">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-[#0a66c2] p-6">
            <h2 className="text-2xl font-bold text-white">
              Complete Your Organizer Profile
            </h2>
            <p className="text-blue-100 mt-1">
              Set up your organization profile to start creating workshops and events.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative mb-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Profile Preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#0a66c2]"
                    />
                    <button
                      type="button"
                      onClick={removeProfilePicture}
                      className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white shadow-md hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-300">
                    <Upload size={36} className="text-gray-400" />
                  </div>
                )}
              </div>
              <label className="cursor-pointer bg-[#0a66c2] hover:bg-[#084b8a] text-white px-4 py-2 rounded-md transition-colors inline-flex items-center gap-2 shadow-md">
                <Upload size={18} />
                <span>Upload Organization Logo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Organization Information */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Organization Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                  <input
                    type="text"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="Your organization name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <select
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    required
                  >
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Education">Education</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="Arts">Arts & Entertainment</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Nonprofit">Nonprofit</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Position</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                  placeholder="e.g., CEO, Training Manager, Workshop Facilitator"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all h-32 resize-none"
                  placeholder="Tell us about your organization..."
                  maxLength={1000}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {formData.bio.length}/1000 characters
                </p>
              </div>
            </div>

            {/* Expertise Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Areas of Expertise
              </h3>
              <div className="flex mb-2">
                <input
                  type="text"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  className="w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                  placeholder="Add an expertise (e.g., Web Development, Leadership)"
                />
                <button
                  type="button"
                  onClick={addExpertise}
                  className="bg-[#0a66c2] hover:bg-[#084b8a] text-white px-4 rounded-r-md transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.expertise.map((item, index) => (
                  <div
                    key={index}
                    className="bg-purple-600/30 text-purple-300 rounded-full px-3 py-1 text-sm flex items-center"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeExpertise(item)}
                      className="ml-2 text-purple-300 hover:text-white"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="contact@yourorganization.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="Your phone number"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="https://www.yourorganization.com"
                  />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Social Media
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="https://linkedin.com/company/your-org"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Facebook</label>
                  <input
                    type="url"
                    value={formData.socialLinks.facebook}
                    onChange={(e) => handleSocialLinkChange('facebook', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="https://facebook.com/your-org"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="https://twitter.com/your-org"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
                  <input
                    type="url"
                    value={formData.socialLinks.instagram}
                    onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="https://instagram.com/your-org"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0a66c2] hover:bg-[#084b8a] text-white font-bold py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizerProfileForm;
