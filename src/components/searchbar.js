import React from "react";
import "./searchbar.css";

const SearchBar = () => {
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
        />
      </div>
    </div>
  );
};

export default SearchBar;
