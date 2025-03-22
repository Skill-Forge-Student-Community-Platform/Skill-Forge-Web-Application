import React from 'react';
import { Upload, X } from 'lucide-react';

const BasicInfoStep = ({
  formData,
  handleChange,
  handleProfilePictureUpload,
  removeProfilePicture,
  imagePreview,
  errors,
  newExpertise,
  setNewExpertise,
  addExpertise,
  removeExpertise
}) => {
  return (
    <div className="space-y-6">
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

      {/* Basic Organization Info */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Basic Organization Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Name*</label>
            <input
              type="text"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${
                errors.organizationName ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all`}
              placeholder="Your organization name"
              required
            />
            {errors.organizationName && (
              <p className="mt-1 text-sm text-red-600">{errors.organizationName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Industry*</label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${
                errors.industry ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all`}
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
            {errors.industry && (
              <p className="mt-1 text-sm text-red-600">{errors.industry}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Position*</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              errors.position ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all`}
            placeholder="e.g., CEO, Training Manager, Workshop Facilitator"
            required
          />
          {errors.position && (
            <p className="mt-1 text-sm text-red-600">{errors.position}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Organizer Type*</label>
          <select
            name="organizerType"
            value={formData.organizerType}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              errors.organizerType ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all`}
            required
          >
            <option value="">Select Type</option>
            <option value="Individual">Individual</option>
            <option value="Student Club">Student Club</option>
            <option value="University">University</option>
            <option value="Company">Company</option>
            <option value="NGO">NGO</option>
          </select>
          {errors.organizerType && (
            <p className="mt-1 text-sm text-red-600">{errors.organizerType}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className={`w-full px-3 py-2 rounded-md border ${
              errors.bio ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all h-32 resize-none`}
            placeholder="Tell us about your organization..."
            maxLength={1000}
          ></textarea>
          <p className={`text-xs ${formData.bio.length > 1000 ? 'text-red-500' : 'text-gray-500'} mt-1 text-right`}>
            {formData.bio.length}/1000 characters
          </p>
          {errors.bio && (
            <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
          )}
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
              className="bg-purple-100 text-purple-800 rounded-full px-3 py-1 text-sm flex items-center"
            >
              {item}
              <button
                type="button"
                onClick={() => removeExpertise(item)}
                className="ml-2 text-purple-800 hover:text-purple-600"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        {formData.expertise.length === 0 && (
          <p className="text-sm text-gray-500 mt-2">Add at least one area of expertise to help participants find your events.</p>
        )}
      </div>
    </div>
  );
};

export default BasicInfoStep;
