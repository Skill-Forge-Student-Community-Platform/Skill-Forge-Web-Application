import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { FaEye, FaPlus, FaExternalLinkAlt } from 'react-icons/fa';

const PortfolioPreview = ({ userId, isOwnProfile }) => {
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch portfolio data
    const fetchPortfolio = async () => {
      try {
        setLoading(true);

        // In a real application, you'd make an API call here
        // For now, we'll use mock data with a small delay
        setTimeout(() => {
          // Check if user has a portfolio
          if (Math.random() > 0.5) {
            setPortfolio({
              id: 'portfolio-1',
              title: 'My Professional Portfolio',
              previewImage: 'https://via.placeholder.com/600x300',
              lastUpdated: new Date().toISOString()
            });
          } else {
            setPortfolio(null);
          }
          setLoading(false);
        }, 800);
      } catch (error) {
        console.error('Error fetching portfolio:', error);
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [userId]);

  const handleViewPortfolio = () => {
    if (portfolio?.id) {
      navigate(`/portfolio/${portfolio.id}`);
    }
  };

  const handleCreatePortfolio = () => {
    navigate('/portfolio-builder');
  };

  if (loading) {
    return (
      <div className="student-section mb-6">
        <h2 className="student-section-title">Portfolio</h2>
        <div className="flex justify-center items-center p-8">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // No portfolio yet
  if (!portfolio) {
    return (
      <div className="student-section mb-6">
        <h2 className="student-section-title">Portfolio</h2>
        <div className="student-section-content text-center">
          <div className="flex justify-center items-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <FaExternalLinkAlt className="text-gray-400 text-xl" />
            </div>
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">
            {isOwnProfile ? 'No Portfolio Yet' : 'No Portfolio Available'}
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            {isOwnProfile
              ? 'Create a professional portfolio to showcase your skills and projects'
              : 'This user has not created a portfolio yet'}
          </p>
          {isOwnProfile && (
            <button
              onClick={handleCreatePortfolio}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2 mx-auto"
            >
              <FaPlus size={14} /> Create Portfolio
            </button>
          )}
        </div>
      </div>
    );
  }

  // Has portfolio
  return (
    <div className="student-section mb-6">
      <h2 className="student-section-title">Portfolio</h2>
      <div className="relative">
        <img
          src={portfolio.previewImage}
          alt="Portfolio Preview"
          className="w-full h-40 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white font-medium">{portfolio.title}</h3>
          <p className="text-xs text-gray-200">
            Last updated: {new Date(portfolio.lastUpdated).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="p-4 flex justify-center gap-2">
        <button
          onClick={handleViewPortfolio}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
        >
          <FaEye size={14} /> View Portfolio
        </button>
        {isOwnProfile && (
          <button
            onClick={handleCreatePortfolio}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors flex items-center gap-2"
          >
            <FaPlus size={14} /> Edit
          </button>
        )}
      </div>
    </div>
  );
};

export default PortfolioPreview;
