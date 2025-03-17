import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaTrophy, FaFilter, FaSearch, FaHeart, FaShare, FaTicketAlt, FaStar, FaBell } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";

import { useEvents } from "../../../context/EventContext";

const ExplorePage = () => {
  const [showFilters, setShowFilters] = useState(false);
  const { events, loading, error } = useEvents();
  
  if (loading) return <div className="text-center my-8">Loading events...</div>;
  if (error) return <div className="text-center my-8 text-red-600">{error}</div>;


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <FaCalendarAlt className="text-indigo-600 mr-3" />
            <span>Discover Amazing Events</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Find and join exciting competitions, workshops, and conferences happening near you.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <input 
              type="text" 
              placeholder="Search events by name, location, or category..." 
              className="w-full py-4 pl-12 pr-4 bg-white border border-gray-200 rounded-xl shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-lg hover:bg-indigo-700 transition-colors">
              Search
            </button>
          </div>
          
          {/* Quick Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            {["All Events", "Competitions", "Workshops", "Conferences", "Virtual Events", "Free Events"].map((cat) => (
              <button key={cat} className="bg-white hover:bg-indigo-50 text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-full border border-gray-200 hover:border-indigo-300 transition-all duration-200 text-sm font-medium">
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Filter/Sort Controls */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
              <p className="text-gray-600 font-medium">
                <span className="text-indigo-600 font-bold">{events.length}</span> events available
              </p>
              <button 
                className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors px-3 py-1 rounded-lg hover:bg-indigo-50 font-medium text-sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>
            </div>
            <div className="flex space-x-2">
              <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow hover:shadow-md">
                <option>All Categories</option>
                <option>Competitions</option>
                <option>Workshops</option>
                <option>Conferences</option>
              </select>
              <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow hover:shadow-md">
                <option>Sort by Date</option>
                <option>Sort by Popularity</option>
                <option>Sort by Prize Value</option>
              </select>
            </div>
          </div>
          
          {/* Advanced Filters - Expandable */}
          {showFilters && (
            <div className="bg-white p-6 rounded-xl shadow-md mb-8 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Date Range</label>
                <div className="flex space-x-2">
                  <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                  <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Location</label>
                <input type="text" placeholder="City or region" className="w-full px-3 py-2 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">Price Range</label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <input type="checkbox" id="free" className="mr-2" />
                    <label htmlFor="free">Free</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="paid" className="mr-2" />
                    <label htmlFor="paid">Paid</label>
                  </div>
                </div>
              </div>
              <div className="md:col-span-3 flex justify-end">
                <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg mr-2 transition-colors">
                  Reset
                </button>
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Featured Event (Optional) */}
        {events.length > 0 && events.some(e => e.is_featured) && (
          <div className="mb-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 relative">
                <img 
                  src={`http://localhost:5000/${events.find(e => e.is_featured)?.image || "default.jpg"}`} 
                  alt="Featured Event" 
                  className="w-full h-64 md:h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Featured Event
                </div>
              </div>
              <div className="p-8 md:w-1/2 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-white mb-4">{events.find(e => e.is_featured)?.title}</h3>
                <div className="space-y-3 text-white/90 mb-6">
                  <p className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <span>{events.find(e => e.is_featured)?.date} | {events.find(e => e.is_featured)?.time}</span>
                  </p>
                  <p className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" />
                    <span>{events.find(e => e.is_featured)?.location}</span>
                  </p>
                </div>
                <div className="flex space-x-3">
                  <Link 
                    to={`explore-event/${events.find(e => e.is_featured)?.event_id}`}
                    className="bg-white hover:bg-gray-100 text-indigo-600 font-medium px-6 py-3 rounded-lg shadow-md transition-colors"
                  >
                    View Details
                  </Link>
                  <button className="bg-indigo-700/50 hover:bg-indigo-700 text-white px-3 py-3 rounded-lg transition-colors flex items-center justify-center">
                    <FaBell />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Event Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className="group bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-indigo-200 transform hover:-translate-y-1"
            >
              {/* Event Image with Overlay Status Badge */}
              <div className="relative">
                <img
                  src={`http://localhost:5000/${event.image || "default.jpg"}`}
                  alt={event.title}
                  className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Status Badge */}
                {event.registered_participants / event.max_participants > 0.8 ? (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Almost Full
                  </div>
                ) : event.is_featured ? (
                  <div className="absolute top-4 right-4 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    Featured
                  </div>
                ) : (
                  <div className="absolute top-4 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                    Available
                  </div>
                )}
                
                {/* Price Badge (if applicable) */}
                {event.price && (
                  <div className="absolute top-4 left-4 bg-white text-indigo-600 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                    ${event.price}
                  </div>
                )}
                
                {/* Quick Action Buttons - Visible on Hover */}
                <div className="absolute bottom-4 right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity flex">
                  <button className="bg-white/90 hover:bg-white text-indigo-600 p-2 rounded-full shadow-md transition-colors">
                    <FaHeart />
                  </button>
                  <button className="bg-white/90 hover:bg-white text-indigo-600 p-2 rounded-full shadow-md transition-colors">
                    <FaShare />
                  </button>
                </div>
                
                {/* Date Badge */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <div className="flex items-center text-white">
                    <FaCalendarAlt className="mr-2" />
                    <span className="font-medium">{event.date}</span>
                    <span className="mx-2">•</span>
                    <FaClock className="mr-1" />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>

              {/* Event Details */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">{event.title}</h3>
                
                <div className="space-y-3 mb-4">
                  <p className="text-gray-700 flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 group-hover:bg-red-200 mr-3 flex-shrink-0 transition-colors">
                      <FaMapMarkerAlt className="text-red-600" />
                    </div>
                    <span className="truncate">{event.location}</span>
                  </p>
                  
                  <p className="text-gray-700 flex items-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-orange-100 group-hover:bg-orange-200 mr-3 flex-shrink-0 transition-colors">
                      <FaUsers className="text-orange-600" />
                    </div>
                    <span>{event.registered_participants} / {event.max_participants} spots filled</span>
                  </p>
                  
                  {/* Progress bar for capacity with animated transition */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        (event.registered_participants / event.max_participants) > 0.8 
                          ? 'bg-red-500' 
                          : (event.registered_participants / event.max_participants) > 0.5 
                            ? 'bg-orange-500' 
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${(event.registered_participants / event.max_participants) * 100}%` }}
                    ></div>
                  </div>
                  
                  {event.prizes?.length > 0 && (
                    <p className="text-gray-700 flex items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-yellow-100 group-hover:bg-yellow-200 mr-3 flex-shrink-0 transition-colors">
                        <FaTrophy className="text-yellow-600" />
                      </div>
                      <span className="font-medium text-yellow-700">
                        Top Prize: {event.prizes[0].reward}
                      </span>
                    </p>
                  )}
                  
                  {/* Registration Deadline (if applicable) */}
                  {event.registration_deadline && (
                    <p className="text-gray-700 flex items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-100 group-hover:bg-indigo-200 mr-3 flex-shrink-0 transition-colors">
                        <FaTicketAlt className="text-indigo-600" />
                      </div>
                      <span className="text-gray-700">
                        Register by <span className="font-medium text-indigo-600">{event.registration_deadline}</span>
                      </span>
                    </p>
                  )}
                  
                  {/* Ratings (if applicable) */}
                  {event.rating && (
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-blue-100 group-hover:bg-blue-200 mr-3 flex-shrink-0 transition-colors">
                        <FaStar className="text-blue-600" />
                      </div>
                      <div className="flex items-center">
                        <span className="font-medium text-gray-800 mr-1">{event.rating}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <FaStar 
                              key={i} 
                              className={i < Math.floor(event.rating) ? "text-yellow-500" : "text-gray-300"} 
                              size={14}
                            />
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm ml-1">({event.review_count || 0})</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link
                     to={`../explore-event/${event._id}`}
                    className="flex-1 block text-center bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition-colors duration-300 shadow-sm"
                  >
                    View Details
                  </Link>
                  <button className="w-12 flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors duration-300">
                    <FaHeart className="group-hover:text-red-500 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        67cf394eeaeb57487ef383c7
        67cf394eeaeb57487ef383c7
        
        {/* Load More Button */}
        {events.length > 0 && (
          <div className="mt-12 text-center">
            <button className="px-8 py-3 bg-white border border-indigo-500 text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors duration-300 shadow-sm">
              Load More Events
            </button>
          </div>
        )}
        
        {/* Empty state - will show when events.length === 0 */}
        {events.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center my-12 transform transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-indigo-600 text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Events Found</h3>
            <p className="text-gray-600 mb-6">There are no upcoming events scheduled at this time.</p>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300">
              Refresh Events
            </button>
          </div>
        )}
        
        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 shadow-lg">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Stay Updated on New Events</h3>
            <p className="text-indigo-100 mb-6">Subscribe to our newsletter to get notifications about upcoming events that match your interests.</p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-indigo-600 hover:bg-indigo-100 px-6 py-3 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;