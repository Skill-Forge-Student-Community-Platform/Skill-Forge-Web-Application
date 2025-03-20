import React from 'react';

const EducationStep = ({ formData, handleChange }) => {
  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Education Details
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Education Level<span className="text-red-500">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">School/University<span className="text-red-500">*</span></label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year<span className="text-red-500">*</span></label>
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Field of Study</label>
          <input
            type="text"
            name="fieldOfStudy"
            value={formData.fieldOfStudy}

            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
            placeholder="e.g., Computer Science"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Year of Study</label>
          <select
            name="yearOfStudy"
            value={formData.yearOfStudy}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
          >
            <option value="">Select Year of Study</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
          <input
            type="text"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
            placeholder="Your student ID number"
          />
        </div>
      </div>
    </div>
  );
};

export default EducationStep;
