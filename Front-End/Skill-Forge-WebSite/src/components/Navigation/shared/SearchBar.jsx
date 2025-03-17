import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ placeholder = "Search..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    setSearchQuery('');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      console.log('Searching for:', searchQuery);
      // Implement search functionality
    }
  };

  return (
    <div
      className={`search-container relative ${isFocused ? 'is-focused' : ''}`}
    >
      <Search size={16} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyPress={handleSearch}
      />
      {searchQuery && (
        <button
          className="clear-button"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
