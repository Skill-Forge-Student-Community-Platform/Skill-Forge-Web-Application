import React, { useState, useEffect } from "react";
import { useParams, useNavigate,Link } from "react-router-dom";
import axios from "axios";
import RegisteredUsers from "./RegisteredUsers";


import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaFileAlt, 
  FaClock, 
  FaTrophy, 
  FaUsers, 
  FaScroll, 
  FaEdit, 
  FaTrashAlt, 
  FaMapMarkedAlt ,
  FaArrowLeft
} from "react-icons/fa";

const EventDetails = ({ onDeleteEvent, onUpdateEvent }) => {
  const { id } = useParams();
  const navigate = useNavigate(); 
  
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mapUrl, setMapUrl] = useState("");
  const [updatedData, setUpdatedData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    time: "",
    win_price: "",
    max_participation: "",
    rules: "",
    image: null,
  });

 

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/Details/${id}`);
        setEvent(response.data);
  
        // Format date before setting it in the state
        const formattedDate = response.data.date
          ? new Date(response.data.date).toISOString().split('T')[0] // Convert to YYYY-MM-DD
          : ""; // Default to empty string if no date is present
  
        setUpdatedData({
          title: response.data.title || "",
          date: formattedDate, // Set formatted date here
          location: response.data.location || "",
          description: response.data.description || "",
          time: response.data.time || "",
          win_price: response.data.win_price || "",
          max_participation: response.data.max_participation || "",
          rules: response.data.rules || "",
          image: response.data.image || null,
        });

        // Create Google Maps URL based on location
        if (response.data.location) {
          const encodedLocation = encodeURIComponent(response.data.location);
          setMapUrl(`https://www.google.com/maps?q=${encodedLocation}&output=embed`);

        }
      } catch (error) {
        console.error("Error fetching event details:", error);
      }
    };
    fetchEventDetails();
  }, [id]);
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await onDeleteEvent(event._id);
        navigate("/organize"); // Redirect to home page after deletion
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete event");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(updatedData).forEach((key) => {
      formData.append(key, updatedData[key]);
    });
  
    try {
      await onUpdateEvent(id, formData);
      const updatedResponse = await axios.get(`http://localhost:3000/Details/${id}`); // Re-fetch latest data
      setEvent(updatedResponse.data);
      
      // Update map URL if location changed
      if (updatedData.location) {
        const encodedLocation = encodeURIComponent(updatedData.location);
        setMapUrl(`https://www.google.com/maps?q=${encodedLocation}&output=embed`);
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };
  
  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">Loading event details...</p>
        </div>
      </div>
    );
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

        <Link to="/organize" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6 group transition-colors duration-200">
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          Back to Events
        </Link>
     

          {isEditing ? (
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Event</h2>
              <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={updatedData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Date</label>
                    <input
                      type="date"
                      name="date"
                      value={updatedData.date}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Time</label>
                    <input
                      type="time"
                      name="time"
                      value={updatedData.time}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={updatedData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                      name="description"
                      value={updatedData.description}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Winning Prize ($)</label>
                    <input
                      type="number"
                      name="win_price"
                      value={updatedData.win_price}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">Max Participants</label>
                    <input
                      type="number"
                      name="max_participation"
                      value={updatedData.max_participation}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Rules</label>
                    <textarea
                      name="rules"
                      value={updatedData.rules}
                      onChange={handleChange}
                      required
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-medium mb-2">Event Image</label>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                    {updatedData.image && (
                      <p className="mt-2 text-sm text-gray-500">Current image: {typeof updatedData.image === 'string' ? updatedData.image : updatedData.image.name}</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div>
              {event.image && (
                <div className="relative h-64 sm:h-80 md:h-96 w-full">
                  <img
                    src={`http://localhost:3000/${event.image}`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h1 className="absolute bottom-6 left-6 right-6 text-3xl sm:text-4xl font-bold text-white">{event.title}</h1>
                </div>
              )}

              {!event.image && (
                <div className="pt-6 px-6">
                  <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">{event.title}</h1>
                </div>
              )}

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="md:col-span-2 space-y-6">
                    <div className="flex items-start space-x-2">
                      <FaFileAlt className="text-lg text-purple-600 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Description</h3>
                        <p className="text-gray-700 whitespace-pre-line">{event.description}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                      <div className="flex items-start space-x-2">
                        <FaScroll className="text-lg text-indigo-600 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Rules</h3>
                          <p className="text-gray-700 whitespace-pre-line">{event.rules}</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl overflow-hidden border border-gray-200 h-64 sm:h-80">
                      <iframe 
                        title="Event Location"
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        src={mapUrl || "https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=default+location"}
                        allowFullScreen>
                      </iframe>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6 h-fit">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-3 border-b border-gray-200">Event Details</h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="bg-blue-100 p-3 rounded-full mr-4">
                          <FaCalendarAlt className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">{new Date(event.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-green-100 p-3 rounded-full mr-4">
                          <FaClock className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Time</p>
                          <p className="font-medium">{event.time}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-red-100 p-3 rounded-full mr-4">
                          <FaMapMarkerAlt className="text-red-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">{event.location}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-yellow-100 p-3 rounded-full mr-4">
                          <FaTrophy className="text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Prize</p>
                          <p className="font-medium text-yellow-600">${Number(event.win_price).toLocaleString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <div className="bg-orange-100 p-3 rounded-full mr-4">
                          <FaUsers className="text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Capacity</p>
                          <p className="font-medium">{event.max_participation} participants max</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <FaEdit className="mr-2" /> Edit Event
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <FaTrashAlt className="mr-2" /> Delete Event
                  </button>
                </div>
              </div>
              <div className="p-6">
                <RegisteredUsers eventId={id} />
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventDetails;