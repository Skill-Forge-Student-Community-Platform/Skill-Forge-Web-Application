import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useGlobalSearchStore from '../../../store/globalSearchStore';
import { getStaticUrl } from '../../../utils/environment';
import { useAuthStore } from '../../../store/authStore';

const SearchBar = ({ placeholder = "Search..." }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const {
    query,
    users,
    events,
    loading,
    error,
    search,
    setQuery,
    clearResults
  } = useGlobalSearchStore();

  // Handle search query change
  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      clearResults();
      return;
    }

    // Debounce search request
    const handler = setTimeout(() => {
      search(value);
    }, 300);

    return () => clearTimeout(handler);
  };

  // Clear search
  const handleClear = () => {
    clearResults();
  };

  // Handle search submission
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      search(query);
      setShowResults(true);
    }
  };

  // Navigate to user profile
  const navigateToUserProfile = (userId) => {
    const baseUrl = `/${user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}/${user?._id}`;
    navigate(`${baseUrl}/profile/${userId}`);
    setShowResults(false);
  };

  // Navigate to event page
  const navigateToEvent = (eventId) => {
    const baseUrl = `/${user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}/${user?._id}`;
    navigate(`${baseUrl}/explore-event/${eventId}`);
    setShowResults(false);
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Show results when focused and has results
  useEffect(() => {
    if (isFocused && (users.length > 0 || events.length > 0)) {
      setShowResults(true);
    }
  }, [isFocused, users, events]);

  return (
    <div
      ref={searchRef}
      className={`search-container relative ${isFocused ? 'is-focused' : ''}`}
    >
      <Search size={16} className="search-icon" />
      <input
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={query}
        onChange={handleQueryChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyPress={handleSearch}
      />
      {query && (
        <button
          className="clear-button"
          onClick={handleClear}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}

      {/* Search Results Dropdown */}
      {showResults && (query.trim() !== "") && (
        <div className="search-results-dropdown">
          {loading && (
            <div className="flex items-center justify-center py-4">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-2"></div>
              <p className="text-sm text-indigo-600">Searching...</p>
            </div>
          )}

          {error && (
            <div className="p-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {!loading && !error && (users.length === 0 && events.length === 0) && (
            <div className="p-4 text-gray-500 text-sm text-center">
              No results found for "{query}"
            </div>
          )}

          {/* Users Section */}
          {users.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                People
              </div>
              <ul>
                {users.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all"
                    onClick={() => navigateToUserProfile(user._id)}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center">
                      <User size={20} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.Username}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {user.role}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}

          {/* Events Section */}
          {events.length > 0 && (
            <>
              <div className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                Events
              </div>
              <ul>
                {events.map((event) => (
                  <li
                    key={event._id}
                    className="flex items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all"
                    onClick={() => navigateToEvent(event._id)}
                  >
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden">
                      {event.image ? (
                        <img
                          src={`${getStaticUrl()}/${event.image}`}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                          <Calendar size={20} className="text-indigo-600 dark:text-indigo-300" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span className="mx-1">•</span>
                        <span>{event.location}</span>
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
