import React from 'react';
import { FaLayerGroup, FaVideo, FaImage, FaCalendarAlt } from 'react-icons/fa';
import './FilterSection.css';

const FilterSection = ({ onFilterChange, currentFilter, theme }) => {
  const filters = [
    { id: 'all', label: 'All Items', icon: <FaLayerGroup /> },
    { id: 'videos', label: 'Videos', icon: <FaVideo /> },
    { id: 'photos', label: 'Photos', icon: <FaImage /> },
    { id: 'events', label: 'Events', icon: <FaCalendarAlt /> }
  ];

  const handleFilterClick = (filterId) => {
    if (filterId !== currentFilter) {
      onFilterChange(filterId);
    }
  };

  return (
    <div className={`filter-section ${theme || ''}`}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`filter-button ${currentFilter === filter.id ? 'active' : ''}`}
          onClick={() => handleFilterClick(filter.id)}
          aria-label={`Filter by ${filter.label}`}
          title={`Show ${filter.label.toLowerCase()}`}
        >
          <span className="filter-icon">{filter.icon}</span>
          <span className="filter-label">{filter.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FilterSection;
