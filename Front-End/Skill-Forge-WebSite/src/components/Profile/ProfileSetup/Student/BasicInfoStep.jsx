import React from 'react';
import { X, Upload } from 'lucide-react';

const BasicInfoStep = ({ formData, handleChange, handleProfilePictureUpload, removeProfilePicture, imagePreview }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Basic Information
      </h3>

      {/* Profile Picture */}
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

      {/* Full Name */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name<span className="text-red-500">*</span></label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
          placeholder="Your full name"
          required
        />
      </div>

      {/* Date of Birth */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
        />
      </div>

      {/* Bio */}
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
  );
};

export default BasicInfoStep;
