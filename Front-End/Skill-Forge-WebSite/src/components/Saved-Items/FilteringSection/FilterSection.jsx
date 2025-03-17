import React, { useState } from 'react';
import './FilterSection.css';

const FilterSection = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'videos', label: 'Videos' },
    { id: 'photos', label: 'Photos' },
    { id: 'events', label: 'Events' }
  ];

  const handleFilterClick = (filterId) => {
    setSelectedFilter(filterId);
    onFilterChange(filterId);
  };

  return (
    <div className="filter-section">
      {filters.map((filter) => (
        <button
          key={filter.id}
          className={`filter-button ${selectedFilter === filter.id ? 'active' : ''}`}
          onClick={() => handleFilterClick(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterSection; 