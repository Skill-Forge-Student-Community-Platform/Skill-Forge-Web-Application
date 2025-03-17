import React from 'react';
import { X } from 'lucide-react';

const SkillsInterestsStep = ({
  formData,
  handleChange,
  newSkill,
  setNewSkill,

  addSkill,
  removeSkill,
  newInterest,
  setNewInterest,
  addInterest,
  removeInterest
}) => {
  return (
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

      <div className="mb-6">
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
          {['Beginner', 'Intermediate', 'Advanced'].map(level => (
            <div key={level} className="flex items-center">
              <input
                type="radio"
                id={`experience-${level}`}
                name="experienceLevel"
                value={level}
                checked={formData.experienceLevel === level}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-[#0a66c2] focus:ring-[#0a66c2]"
              />
              <label htmlFor={`experience-${level}`} className="text-gray-700">{level}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkillsInterestsStep;
