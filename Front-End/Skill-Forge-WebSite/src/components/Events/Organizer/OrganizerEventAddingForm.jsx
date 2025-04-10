import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEvents } from "../../../context/EventContext";

const EventAddingForm = ({ userId }) => {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({

    title: "",
    date: "",
    location: "",
    description: "",
    time: "",
    win_price: "",

    max_participants: "", // Fixed the inconsistent field name (was max_participation)

    rules: "",
    image: null,
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError(null);
    
    try {
      // Validate required fields
      if (!formData.title || !formData.location) {
        setError("Please fill all required fields");
        setLoading(false);
        return;
      }
      
      const data = new FormData();
      
      // Add all form data carefully
      data.append("title", formData.title);
      data.append("date", formData.date);
      data.append("location", formData.location);
      data.append("description", formData.description || "");
      data.append("time", formData.time || "");
      data.append("win_price", formData.win_price || 0);
      data.append("max_participants", formData.max_participants || 10);
      data.append("rules", formData.rules || "");
      
      // Only append image if present
      if (formData.image) {
        data.append("image", formData.image);
      }
      
      // Add userId
      data.append("userId", userId);
      
      console.log("Submitting form with data:", Object.fromEntries(data.entries()));
      
      const result = await addEvent(data);
      if (result.success) {
        navigate(`/Organizer/${userId}/manage-events`);
      } else {
        setError(result.error || "Failed to add event");
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError(`Error: ${err.message || "Unknown error occurred"}`);
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white max-w-3xl w-full rounded-lg shadow-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-blue-600 px-8 py-5">
          <h2 className="text-2xl font-bold text-white">Add New Event</h2>
          <p className="text-blue-100 mt-1">Complete the form below to create your event</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-600 p-4 rounded">
              <div className="flex">
                <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter event title"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
  
            {/* Description - Wider Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Description</label>
              <textarea
                name="description"
                placeholder="Provide details about your event..."
                rows="6"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
  
            {/* Date & Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
  
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                name="location"
                placeholder="Enter event location"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
  
            {/* Winning Prize & Max Participants */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Winning Prize ($)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    name="win_price"
                    placeholder="0.00"
                    required
                    onChange={handleChange}
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                <input
                  type="number"
                  name="max_participants"
                  placeholder="0"
                  required
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
  
            {/* Event Rules */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Rules</label>
              <textarea
                name="rules"
                placeholder="Enter event rules and guidelines..."
                rows="5"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
  
            {/* Simplified Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
              <div className="flex items-center">
                <label className="cursor-pointer bg-white px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  Browse
                  <input
                    type="file"
                    name="image"
                    id="image-upload"
                    accept="image/*"
                    onChange={(e) => {
                      handleChange(e);
                      const fileName = e.target.files[0]?.name;
                      document.getElementById('file-name').textContent = fileName || 'No file selected';
                    }}
                    className="sr-only"
                  />
                </label>
                <span id="file-name" className="ml-3 text-sm text-gray-500">
                  No file selected
                </span>
              </div>
            </div>
  
            {/* Divider */}
            <div className="border-t border-gray-200 my-6"></div>
  
            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Create Event'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventAddingForm;
