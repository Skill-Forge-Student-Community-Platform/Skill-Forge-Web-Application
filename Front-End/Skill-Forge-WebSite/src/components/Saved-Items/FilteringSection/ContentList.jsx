import React, { useState, useEffect } from 'react';
import FilterSection from './FilterSection';
import './ContentList.css';

const ContentList = () => {
  const [filteredContent, setFilteredContent] = useState([]);
  const [currentFilter, setCurrentFilter] = useState('all');

  // Simulated content data - replace with your actual data
  const dummyContent = [
    {
      id: 1,
      type: 'videos',
      title: 'The Homeboys\'s Video',
      category: 'Reel',
      author: 'The Homeboys',
      thumbnail: '/path-to-thumbnail.jpg',
      Image: '/path-to-image.jpg'
    },
    // Add more dummy content items here
  ];

  const handleFilterChange = (filter) => {
    setCurrentFilter(filter);
    filterContent(filter);
  };

  const filterContent = async (filter) => {
    try {
      // Simulated API call - replace with actual backend call
      // const response = await fetch(`/api/content?type=${filter}`);
      // const data = await response.json();
      
      // For now, filter the dummy content
      const filtered = filter === 'all' 
        ? dummyContent 
        : dummyContent.filter(item => item.type === filter);
      
      setFilteredContent(filtered);
    } catch (error) {
      console.error('Error filtering content:', error);
    }
  };

  useEffect(() => {
    filterContent('all'); // Load initial content
  }, []);

  return (
    <div className="content-container">
      <FilterSection onFilterChange={handleFilterChange} />
      <div className="content-list">
        {filteredContent.map((item) => (
          <div key={item.id} className="content-card">
            <div className="content-thumbnail">
              <img src={item.thumbnail} alt={item.title} />
            </div>
            <div className="content-info">
              <h3 className="content-title">{item.title}</h3>
              <p className="content-category">{item.category}</p>
              <div className="content-meta">
                <span className="content-author">Saved from {item.author}'s post</span>
              </div>
              <div className="content-actions">
                <button className="add-collection-btn">Add to Collection</button>
                <button className="share-btn">Share</button>
                <button className="more-btn">•••</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentList;
