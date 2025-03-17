import React from 'react';

const OrganizationDetailsStep = ({ formData, handleChange, errors }) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Organization Details
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Provide additional information about your organization to help participants understand your background and expertise.
        </p>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className={`w-full px-3 py-2 rounded-md border ${
                  errors.website ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all`}
                placeholder="https://www.yourorganization.com"
              />
              {errors.website && (
                <p className="mt-1 text-sm text-red-600">{errors.website}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Vision & Mission</label>
            <textarea
              name="vision"
              value={formData.vision || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all h-24 resize-none"
              placeholder="Share your organization's vision and mission (optional)"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Year Founded</label>
              <input
                type="number"
                name="yearFounded"
                value={formData.yearFounded || ''}
                onChange={handleChange}
                min="1900"
                max={new Date().getFullYear()}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                placeholder="e.g., 2010"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Organization Size</label>
              <select
                name="orgSize"
                value={formData.orgSize || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
              >
                <option value="">Select Size (Optional)</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1001-5000">1001-5000 employees</option>
                <option value="5001-10000">5001-10000 employees</option>
                <option value="10001+">10001+ employees</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizationDetailsStep;
