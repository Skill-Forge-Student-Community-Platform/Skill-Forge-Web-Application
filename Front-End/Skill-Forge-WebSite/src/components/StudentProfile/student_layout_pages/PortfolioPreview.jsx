import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';

const PortfolioPreview = ({
  userId,
  hasPortfolio,
  portfolioData,
  isOwner,
  onCreatePortfolio,
  basePath = ''
}) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Generate correct paths based on user role and ID
  const getCorrectPath = (path) => {
    if (basePath) return `${basePath}/${path}`;

    // Fallback if basePath wasn't provided
    const roleType = user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1);
    return `/${roleType}/${user?._id}/${path}`;
  };

  // When no portfolio exists and user is the owner
  if (!hasPortfolio && isOwner) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Portfolio</h2>
        </div>

        <div
          className="border-2 border-dashed border-blue-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors duration-200"
          onClick={onCreatePortfolio || (() => navigate(getCorrectPath('portfolio-builder')))}
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-3xl font-bold mb-4">+</div>
          <p className="text-gray-600 text-center max-w-md mb-4">Create your portfolio to showcase your skills and achievements</p>
          <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200">
            Get Started
          </button>
        </div>
      </div>
    );
  }

  // When no portfolio exists and user is not the owner
  if (!hasPortfolio && !isOwner) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Portfolio</h2>
        </div>
        <p className="text-gray-500 text-center py-8">This user hasn't created a portfolio yet.</p>
      </div>
    );
  }

  // When portfolio exists
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Portfolio</h2>
        {isOwner && (
          <button
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors duration-200"
            onClick={() => navigate(getCorrectPath('portfolio-builder'))}
          >
            Edit Portfolio
          </button>
        )}
      </div>

      <div
        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 cursor-pointer"
        onClick={() => navigate(getCorrectPath(`portfolio/${userId}`))}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{portfolioData?.title || 'My Portfolio'}</h3>

        {portfolioData?.summary && (
          <p className="text-gray-600 mb-4">{portfolioData.summary}</p>
        )}

        {portfolioData?.skills && portfolioData.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {portfolioData.skills.slice(0, 5).map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                >
                  {skill}
                </span>
              ))}
              {portfolioData.skills.length > 5 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">
                  +{portfolioData.skills.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center text-blue-500 hover:text-blue-700 font-medium">
          <span>View Full Portfolio</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPreview;
