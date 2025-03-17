import React from 'react';

const ContactSocialStep = ({
  formData,
  handleChange,
  handleSocialLinkChange
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Contact & Social Links
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
          <input
            type="tel"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
            placeholder="Your mobile number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Backup Email</label>
          <input
            type="email"
            name="backupEmail"
            value={formData.backupEmail}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
            placeholder="Backup email address"
          />
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="privacyMode"
            name="privacyMode"
            checked={formData.privacyMode}
            onChange={handleChange}
            className="h-4 w-4 text-[#0a66c2] focus:ring-[#0a66c2] rounded"
          />
          <label htmlFor="privacyMode" className="ml-2 text-gray-700">
            Enable Privacy Mode (Hide profile from public searches)
          </label>
        </div>
      </div>

      <h4 className="text-md font-semibold text-gray-800 mb-4">Social Media Links</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
          <input
            type="url"
            value={formData.socialLinks.linkedin}
            onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
            placeholder="https://linkedin.com/in/username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
          <input
            type="url"
            value={formData.socialLinks.github}
            onChange={(e) => handleSocialLinkChange('github', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
            placeholder="https://github.com/username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
          <input
            type="url"
            value={formData.socialLinks.twitter}
            onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
            placeholder="https://twitter.com/username"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Personal Website</label>
          <input
            type="url"
            value={formData.socialLinks.website}
            onChange={(e) => handleSocialLinkChange('website', e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
            placeholder="https://yourwebsite.com"
          />
        </div>
      </div>

      {/* Terms acceptance section removed */}
    </div>
  );
};

export default ContactSocialStep;
