import React from 'react';
import { FaCalendarAlt, FaMapMarkerAlt, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import { getApiBaseUrl } from "../../../utils/environment";

const SaveEvents = ({ cart, userId, setCart }) => {
  const navigate = useNavigate();  // Initialize navigation

  const handleDelete = async (_id) => {
    try {
      const response = await axios.delete(`${getApiBaseUrl()}/delete-saved-event/${_id}`);

      console.log("Response from server:", response); // Log response

      if (response.status === 200) {
        const updatedCart = cart.filter(event => event._id !== _id);
        setCart(updatedCart);
        alert('Event deleted successfully');
      }
    } catch (error) {
      console.error("Error deleting event:", error);

      // Log the actual error response
      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
      }

      alert('There was an error deleting the event.');
    }
  };







  if (!cart || cart.length === 0) {
    return (
      <div className="mt-6 pt-5 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Saved Events</h3>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <p className="text-gray-500">No events saved yet</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-5 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Saved Events ({cart.length})</h3>

      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
        {cart.map((event, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 transition-all hover:shadow-md hover:border-indigo-200 cursor-pointer"
            onClick={() => navigate(`../explore-event/${event.eventId}`)}  // Navigate to event details
          >
            <h4 className="font-medium text-gray-900 truncate">{event.title}</h4>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex items-center text-gray-600">
                <FaMapMarkerAlt className="text-red-500 mr-2 flex-shrink-0" />
                <span className="truncate">{event.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <FaCalendarAlt className="text-indigo-500 mr-2 flex-shrink-0" />
                <span>{new Date(event.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}</span>
              </div>
            </div>
            <div className="mt-3 flex justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent click from triggering navigation
                  handleDelete(event._id);
                }}
                className="text-sm text-red-600 hover:text-red-800 font-medium flex items-center"
              >
                <FaTrash className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="mt-3 flex justify-end">
          <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
            View all saved events
          </button>
        </div>
      )}
    </div>
  );
};

export default SaveEvents;
