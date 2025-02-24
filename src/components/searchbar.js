import React, { useState } from "react";
import "./searchbar.css";

const peopleList = [
  { id: 1, name: "Shanika Hewage", avatar: "https://i.pravatar.cc/50?img=10" },
  { id: 2, name: "Gayani Nimnaadi", avatar: "https://i.pravatar.cc/50?img=11" },
  { id: 3, name: "Hafizh Abiyy", avatar: "https://i.pravatar.cc/50?img=12" },
];

const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchInput(value);

    if (value.trim() === "") {
      setFilteredResults([]);
      return;
    }

    const filtered = peopleList.filter((person) =>
      person.name.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredResults(filtered);
  };

  return (
    <div className="search-container">
      <div className="search-wrapper">
        <svg className="search-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 12.65z"></path>
        </svg>
        <input
          type="text"
          placeholder="Search People"
          className="search-input"
          value={searchInput}
          onChange={handleSearch}
        />
      </div>

      {/* Search Results Panel */}
      <div className="search-results">
        {searchInput && (
          filteredResults.length > 0 ? (
            filteredResults.map((person) => (
              <div key={person.id} className="search-result-item">
                <img src={person.avatar} alt={person.name} className="search-avatar" />
                <span className="search-name">{person.name}</span>
              </div>
            ))
          ) : (
            <p className="not-found">Not Found</p>
          )
        )}
      </div>
    </div>
  );
};

export default SearchBar;  