import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

const QualificationsSection = ({ qualifications = [], userId, isEditable = false, basePath = '' }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Generate correct paths based on user role and ID
  const getCorrectPath = (path) => {
    if (basePath) return `${basePath}/${path}`;

    // Fallback if basePath wasn't provided
    const roleType = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1);
    return `/${roleType}/${user?._id}/${path}`;
  };

  // Handle view all qualifications
  const handleViewAllQualifications = () => {
    navigate(getCorrectPath('profile/qualifications'));
  };

  // Handle add certificate
  const handleAddCertificate = () => {
    navigate(getCorrectPath('add-certificate'));
  };

  // If no qualifications, show a message for adding qualifications
  if (!qualifications || qualifications.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Qualifications & Certifications</h2>
          {isEditable && (
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-sm"
              onClick={handleAddCertificate}
            >
              Add Certificate
            </button>
          )}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <p className="text-gray-500 mb-4">
            {isEditable
              ? "You haven't added any certifications yet."
              : "This user hasn't added any certifications yet."}
          </p>
          {isEditable && (
            <button
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              onClick={handleAddCertificate}
            >
              Add Your First Certificate
            </button>
          )}
        </div>
      </div>
    );
  }

  // Show all qualifications
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Qualifications & Certifications</h2>
        <div className="flex gap-2">
          {qualifications.length > 3 && (
            <button
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors text-sm"
              onClick={handleViewAllQualifications}
            >
              View All
            </button>
          )}
          {isEditable && (
            <button
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-sm"
              onClick={handleAddCertificate}
            >
              Add Certificate
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {qualifications.slice(0, 3).map((qualification) => (
          <div key={qualification.id} className="flex bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-2xl mr-4">
              🎓
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-gray-800">{qualification.title || qualification.type}</h3>
              {qualification.issuer && <p className="text-gray-600 text-sm">{qualification.issuer}</p>}
              {qualification.date && <p className="text-gray-500 text-xs">{qualification.date}</p>}
              {qualification.credential && (
                <a
                  href={qualification.credential}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline text-sm mt-1 inline-block"
                >
                  View Credential
                </a>
              )}
            </div>
            {isEditable && (
              <button
                className="flex-shrink-0 ml-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm"
                onClick={() => navigate(getCorrectPath(`certificate/${qualification.id}`))}
              >
                View
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QualificationsSection;
