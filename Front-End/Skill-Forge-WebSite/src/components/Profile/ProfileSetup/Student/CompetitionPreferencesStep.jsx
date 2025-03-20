import React from 'react';
import { X } from 'lucide-react';

// Predefined options for competition interests and types
const COMPETITION_INTEREST_OPTIONS = [
  "Hackathons",
  "Coding Challenges",
  "Design Competitions",
  "Case Studies",
  "Business Pitches",
  "Data Science Competitions",
  "Capture The Flag (CTF)",
  "Game Development",
  "UI/UX Competitions",
  "Research Presentations",
  "Innovation Challenges",
  "Robotics Competitions",
  "AI/ML Projects"
];

const COMPETITION_TYPE_OPTIONS = [
  "Individual",
  "Team-Based",
  "Corporate Sponsored",
  "Academic",

  "Open Source",
  "Industry Specific",
  "Interdisciplinary",
  "Global",
  "Local/Regional",
  "Virtual",
  "In-Person",
  "Hybrid"
];

const CompetitionPreferencesStep = ({
  formData,
  handleChange,
  handleCheckboxChange,
  newCompetitionInterest,
  setNewCompetitionInterest,
  addCompetitionInterest,
  removeCompetitionInterest,
  newCompetitionType,
  setNewCompetitionType,
  addCompetitionType,
  removeCompetitionType
}) => {
  // Handle selection from dropdown
  const handleInterestSelect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !formData.competitionInterests.includes(selectedValue)) {
      setNewCompetitionInterest(selectedValue);
    }
  };

  // Handle selection from dropdown
  const handleTypeSelect = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue && !formData.preferredCompetitionTypes.includes(selectedValue)) {
      setNewCompetitionType(selectedValue);
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
        Competition & Event Preferences
      </h3>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Competition Interests</label>
        <div className="flex flex-col mb-2 space-y-2">
          <div className="flex">
            <select
              className="w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
              onChange={handleInterestSelect}
              value=""
            >
              <option value="" disabled>
                Select a competition interest
              </option>
              {COMPETITION_INTEREST_OPTIONS.filter(
                option => !formData.competitionInterests.includes(option)
              ).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                if (newCompetitionInterest) addCompetitionInterest();
              }}
              disabled={!newCompetitionInterest}
              className="bg-[#0a66c2] hover:bg-[#084b8a] text-white px-4 py-2 rounded-r-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          <div className="flex items-center">
            <input
              type="text"
              value={newCompetitionInterest}
              onChange={(e) => setNewCompetitionInterest(e.target.value)}
              className="w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
              placeholder="Or type a custom interest"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCompetitionInterest();
                }
              }}
            />
            <button
              type="button"
              onClick={addCompetitionInterest}
              className="bg-[#0a66c2] hover:bg-[#084b8a] text-white px-4 py-2 rounded-r-md transition-colors"
            >
              Add
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.competitionInterests.map((item, index) => (
            <div
              key={index}
              className="bg-[#e7f3ff] text-[#0a66c2] rounded-full px-3 py-1 text-sm flex items-center border border-[#0a66c2]/20"
            >
              {item}
              <button
                type="button"
                onClick={() => removeCompetitionInterest(item)}
                className="ml-2 text-[#0a66c2] hover:text-[#084b8a]"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {formData.competitionInterests.length === 0 && (
            <p className="text-sm text-gray-500 italic">No competition interests selected</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Competition Types</label>
        <div className="flex flex-col mb-2 space-y-2">
          <div className="flex">
            <select
              className="w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
              onChange={handleTypeSelect}
              value=""
            >
              <option value="" disabled>
                Select a competition type
              </option>
              {COMPETITION_TYPE_OPTIONS.filter(
                option => !formData.preferredCompetitionTypes.includes(option)
              ).map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => {
                if (newCompetitionType) addCompetitionType();
              }}
              disabled={!newCompetitionType}
              className="bg-[#0a66c2] hover:bg-[#084b8a] text-white px-4 py-2 rounded-r-md transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          <div className="flex">
            <input
              type="text"
              value={newCompetitionType}
              onChange={(e) => setNewCompetitionType(e.target.value)}
              className="w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
              placeholder="Or type a custom competition type"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCompetitionType();
                }
              }}
            />
            <button
              type="button"
              onClick={addCompetitionType}
              className="bg-[#0a66c2] hover:bg-[#084b8a] text-white px-4 py-2 rounded-r-md transition-colors"
            >
              Add
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {formData.preferredCompetitionTypes.map((item, index) => (
            <div
              key={index}
              className="bg-[#f5faff] text-[#0a66c2] rounded-full px-3 py-1 text-sm flex items-center border border-[#0a66c2]/20"
            >
              {item}
              <button
                type="button"
                onClick={() => removeCompetitionType(item)}
                className="ml-2 text-[#0a66c2] hover:text-[#084b8a]"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {formData.preferredCompetitionTypes.length === 0 && (
            <p className="text-sm text-gray-500 italic">No competition types selected</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">Hackathon Team Preference</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['Solo', 'Team-based', 'Open to Collaboration'].map(pref => (
            <div key={pref} className="flex items-center">
              <input
                type="radio"
                id={`team-${pref}`}
                name="hackathonTeamPreference"
                value={pref}
                checked={formData.hackathonTeamPreference === pref}
                onChange={handleChange}
                className="mr-2 h-4 w-4 text-[#0a66c2] focus:ring-[#0a66c2]"
              />
              <label htmlFor={`team-${pref}`} className="text-gray-700">{pref}</label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Preferred Notifications</label>
        <div className="space-y-2">
          {['Email', 'SMS', 'Push'].map(type => (
            <div key={type} className="flex items-center">
              <input
                type="checkbox"
                id={`notify-${type}`}
                checked={formData.preferredNotifications.includes(type)}
                onChange={() => handleCheckboxChange('preferredNotifications', type)}
                className="h-4 w-4 text-[#0a66c2] focus:ring-[#0a66c2] rounded"
              />
              <label htmlFor={`notify-${type}`} className="ml-2 text-gray-700">{type} Notifications</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompetitionPreferencesStep;
