import React, { useState } from 'react';

const IntroSection = ({ profileData, isEditable = false, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [details, setDetails] = useState({
    bio: profileData?.bio || 'No bio available',
    university: profileData?.school || 'Not specified',
    esoft: profileData?.education || 'Not specified',
    school: profileData?.secondarySchool || 'Not specified',
    otherSchool: profileData?.otherEducation || 'Not specified',
    location: profileData?.location || 'Not specified',
    from: profileData?.from || 'Not specified',
    status: profileData?.status || 'Not specified',
    joined: profileData?.joined || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = () => {
    if (onSave) {
      onSave(details);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    // Reset to original data
    setDetails({
      bio: profileData?.bio || 'No bio available',
      university: profileData?.school || 'Not specified',
      esoft: profileData?.education || 'Not specified',
      school: profileData?.secondarySchool || 'Not specified',
      otherSchool: profileData?.otherEducation || 'Not specified',
      location: profileData?.location || 'Not specified',
      from: profileData?.from || 'Not specified',
      status: profileData?.status || 'Not specified',
      joined: profileData?.joined || new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    });
    setIsEditing(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
        <span role="img" aria-label="Mask">🎭</span> Intro
      </h2>

      {/* Edit Mode */}
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={details.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">University/College</label>
              <input
                id="university"
                name="university"
                value={details.university}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="esoft" className="block text-sm font-medium text-gray-700 mb-1">Education Institute</label>
              <input
                id="esoft"
                name="esoft"
                value={details.esoft}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-1">High School</label>
              <input
                id="school"
                name="school"
                value={details.school}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>

              <label htmlFor="otherSchool" className="block text-sm font-medium text-gray-700 mb-1">Other School</label>
              <input
                id="otherSchool"
                name="otherSchool"
                value={details.otherSchool}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
              <input
                id="location"
                name="location"
                value={details.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-1">From</label>
              <input
                id="from"
                name="from"
                value={details.from}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">Relationship Status</label>
              <input
                id="status"
                name="status"
                value={details.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-3">
            <button
              onClick={handleSaveChanges}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors flex items-center gap-1"
            >
              <span role="img" aria-label="Save">💾</span> Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md transition-colors flex items-center gap-1"
            >
              <span role="img" aria-label="Cancel">❌</span> Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-gray-600">
          <p className="text-lg font-medium mb-3">
            <span role="img" aria-label="Speech">💬</span> {details.bio}
          </p>
          <p className="py-1"><span role="img" aria-label="Graduation">🎓</span> Studies at <strong className="text-gray-800">{details.university}</strong></p>
          <p className="py-1"><span role="img" aria-label="Book">📖</span> Studied at {details.esoft}</p>
          <p className="py-1"><span role="img" aria-label="School">🏫</span> Studied at <strong className="text-gray-800">{details.school}</strong></p>
          <p className="py-1"><span role="img" aria-label="School">🏫</span> Studied at {details.otherSchool}</p>
          <p className="py-1"><span role="img" aria-label="Home">🏠</span> Lives in <strong className="text-gray-800">{details.location}</strong></p>
          <p className="py-1"><span role="img" aria-label="Pin">📍</span> From <strong className="text-gray-800">{details.from}</strong></p>
          <p className="py-1"><span role="img" aria-label="Heart">💖</span> {details.status}</p>
          <p className="py-1"><span role="img" aria-label="Hourglass">⏳</span> Joined {details.joined}</p>

          {isEditable && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors flex items-center gap-2 w-fit"
            >
              <span role="img" aria-label="Edit">✏️</span> Edit Details
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default IntroSection;
