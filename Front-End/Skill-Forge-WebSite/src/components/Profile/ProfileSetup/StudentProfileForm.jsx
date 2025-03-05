import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Upload, X, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuthStore } from '../../../store/authStore';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api/auth";

const StudentProfileForm = () => {
  console.log('StudentProfileForm component mounted');
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, updateProfile } = useAuthStore();  // Change from updateUser to updateProfile

  useEffect(() => {
    console.log('StudentProfileForm rendered with user:', user);
  }, [user]);

  const [formData, setFormData] = useState({
    education: '',
    school: '',
    graduationYear: new Date().getFullYear(),
    bio: '',
    skills: [],
    interests: [],
    profilePicture: null,
    socialLinks: {
      linkedin: '',
      github: '',
      twitter: '',
      website: ''
    }
  });

  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
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

  // Add new skill
  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  // Remove skill
  const removeSkill = (skillToRemove) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  // Add new interest
  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  // Remove interest
  const removeInterest = (interestToRemove) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(interest => interest !== interestToRemove)
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

      console.log("Submitting student profile data...");

      // Use the updateProfile method from authStore
      const response = await updateProfile(profileFormData);
      console.log("Profile update successful:", response);

      toast.success('Student profile created successfully!');

      // Properly format the role for the URL (capitalize first letter)
      const role = user.role.charAt(0).toUpperCase() + user.role.slice(1);

      // Navigate to the proper role-specific home URL
      const targetUrl = `/${role}/${user._id}/home`;
      console.log(`Navigation to role-specific home: ${targetUrl}`);

      // Use replace: true to prevent going back to the profile setup page
      navigate(targetUrl, { replace: true });
    } catch (error) {
      console.error('Profile update error:', error);
      const errorMsg = error.message || 'Failed to update profile. Please try again.';
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
              Complete Your Student Profile
            </h2>
            <p className="text-blue-100 mt-1">
              Tell us more about yourself to personalize your learning experience.
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
                <span>Upload Profile Picture</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Form Sections */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Education Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Education Level</label>
                  <select
                    name="education"
                    value={formData.education}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    required
                  >
                    <option value="">Select Education Level</option>
                    <option value="High School">High School</option>
                    <option value="Associate's">Associate's Degree</option>
                    <option value="Bachelor's">Bachelor's Degree</option>
                    <option value="Master's">Master's Degree</option>
                    <option value="Doctorate">Doctorate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">School/University</label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="Your school or university"
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                <input
                  type="number"
                  name="graduationYear"
                  min="1950"
                  max="2050"
                  value={formData.graduationYear}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all h-32 resize-none"
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                ></textarea>
                <p className="text-xs text-gray-500 mt-1 text-right">
                  {formData.bio.length}/500 characters
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Skills & Interests
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    className="w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="Add a skill (e.g., JavaScript, Design)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="bg-[#0a66c2] hover:bg-[#084b8a] text-white px-4 py-2 rounded-r-md transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-[#e7f3ff] text-[#0a66c2] rounded-full px-3 py-1 text-sm flex items-center border border-[#0a66c2]/20"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 text-[#0a66c2] hover:text-[#084b8a]"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Interests</label>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newInterest}
                    onChange={(e) => setNewInterest(e.target.value)}
                    className="w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="Add an interest (e.g., Machine Learning, UX)"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addInterest();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addInterest}
                    className="bg-[#0a66c2] hover:bg-[#084b8a] text-white px-4 py-2 rounded-r-md transition-colors"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.interests.map((interest, index) => (
                    <div
                      key={index}
                      className="bg-[#f5faff] text-[#0a66c2] rounded-full px-3 py-1 text-sm flex items-center border border-[#0a66c2]/20"
                    >
                      {interest}
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="ml-2 text-[#0a66c2] hover:text-[#084b8a]"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                Social Links
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.socialLinks.linkedin}
                    onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                  <input
                    type="url"
                    value={formData.socialLinks.github}
                    onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="https://github.com/yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
                  <input
                    type="url"
                    value={formData.socialLinks.twitter}
                    onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
                  <input
                    type="url"
                    value={formData.socialLinks.website}
                    onChange={(e) => handleSocialLinkChange('website', e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                    placeholder="https://yourdomain.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#0a66c2] hover:bg-[#084b8a] text-white font-medium py-3 px-4 rounded-md flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Complete Profile Setup</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentProfileForm;
