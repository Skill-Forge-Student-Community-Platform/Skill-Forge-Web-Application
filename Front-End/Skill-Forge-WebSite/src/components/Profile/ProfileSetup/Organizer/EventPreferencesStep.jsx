import React from 'react';
import { X } from 'lucide-react';

const EventPreferencesStep = ({
  formData,
  handleChange,
  errors,
  newEventType,
  setNewEventType,
  addEventType,
  removeEventType
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
          Event Management Preferences
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Tell us about the types of events you prefer to organize and your participant expectations.
        </p>

        <div className="space-y-4">
          {/* Event Types Section */}
          <div className="mb-6">

            <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Event Types</label>

            <div className="flex mb-2">
              <input
                type="text"
                value={newEventType}
                onChange={(e) => setNewEventType(e.target.value)}
                className="w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all"
                placeholder="Add event type (e.g., Hackathon, Workshop, Conference)"
              />
              <button
                type="button"
                onClick={addEventType}
                className="bg-[#0a66c2] hover:bg-[#084b8a] text-white px-4 rounded-r-md transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.preferredEventTypes.map((item, index) => (
                <div
                  key={index}
                  className="bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm flex items-center"
                >
                  {item}
                  <button
                    type="button"
                    onClick={() => removeEventType(item)}
                    className="ml-2 text-blue-800 hover:text-blue-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            {formData.preferredEventTypes.length === 0 && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Some examples: Hackathons, Workshops, AI Challenges, Cybersecurity Contests, Coding Boot Camps
                </p>
              </div>
            )}
          </div>

          {/* Expected Participants Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Number of Participants*</label>
            <select
              name="expectedParticipantsRange"
              value={formData.expectedParticipantsRange}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${
                errors.expectedParticipantsRange ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all`}
              required
            >
              <option value="">Select Range</option>
              <option value="Small (<50)">Small (&lt;50 participants)</option>
              <option value="Medium (50-200)">Medium (50-200 participants)</option>
              <option value="Large (200+)">Large (200+ participants)</option>
            </select>
            {errors.expectedParticipantsRange && (
              <p className="mt-1 text-sm text-red-600">{errors.expectedParticipantsRange}</p>
            )}
          </div>

          {/* Event Format Preference */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Event Format Preference*</label>
            <select
              name="eventFormatPreference"
              value={formData.eventFormatPreference}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded-md border ${
                errors.eventFormatPreference ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-[#0a66c2] focus:border-[#0a66c2] transition-all`}
              required
            >
              <option value="">Select Format</option>
              <option value="Online">Online</option>
              <option value="In-Person">In-Person</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            {errors.eventFormatPreference && (
              <p className="mt-1 text-sm text-red-600">{errors.eventFormatPreference}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventPreferencesStep;
