import React, { useState } from "react";

const IntroSection = () => {
  // State for Edit Mode
  const [isEditing, setIsEditing] = useState(false);

  // State to store user details
  const [details, setDetails] = useState({
    bio: "I am famous as Venom 🕷️🔥",
    university: "University of Westminster",
    esoft: "Esoft Metro Campus, Piliyandala",
    school: "St. Sebastian's College, Moratuwa",
    otherSchool: "Alethea International School, Dehiwela, Sri Lanka",
    location: "Galkissa, Sri Lanka",
    from: "Colombo, Sri Lanka",
    status: "Single",
    joined: "July 2022",
  });

  // Handle Input Change
  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-gray-800">
        <span role="img" aria-label="Mask">🎭</span> Intro
      </h2>

      {/* Edit Mode */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            name="bio"
            value={details.bio}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {Object.keys(details).filter(key => key !== 'bio').map(key => (
            <input
              key={key}
              name={key}
              value={details[key]}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          ))}

          <button
            onClick={() => setIsEditing(false)}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-1"
          >
            <span role="img" aria-label="Save">💾</span> Save
          </button>
        </div>
      ) : (
        <div className="space-y-2 text-gray-600">
          <p className="text-lg font-medium mb-3">
            <span role="img" aria-label="Speech">💬</span> {details.bio}
          </p>
          <p><span role="img" aria-label="Graduation">🎓</span> Studies at <strong>{details.university}</strong></p>
          <p><span role="img" aria-label="Book">📖</span> Studied at {details.esoft}</p>
          <p><span role="img" aria-label="School">🏫</span> Studied at <strong>{details.school}</strong></p>
          <p><span role="img" aria-label="School">🏫</span> Studied at {details.otherSchool}</p>
          <p><span role="img" aria-label="Home">🏠</span> Lives in <strong>{details.location}</strong></p>
          <p><span role="img" aria-label="Pin">📍</span> From <strong>{details.from}</strong></p>
          <p><span role="img" aria-label="Heart">💖</span> {details.status}</p>
          <p><span role="img" aria-label="Hourglass">⏳</span> Joined {details.joined}</p>

          <button

            onClick={() => setIsEditing(true)}
            className="mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md transition-colors flex items-center gap-1"
          >
            <span role="img" aria-label="Edit">✏️</span> Edit Details
          </button>
        </div>
      )}
    </div>
  );
};

export default IntroSection;
