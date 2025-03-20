import React from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaTrophy } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEvents } from "../../../context/EventContext";

const EventList = ({ userId }) => {
  const { events, loading, error } = useEvents();
  
  // Filter events to include only those that match the userId
  const userEvents = events.filter(event => event.userId === userId);

  if (loading) return <div className="text-center my-8">Loading events...</div>;
  if (error) return <div className="text-center my-8 text-red-600">{error}</div>;

  return (
    <div className="event-list-container max-w-7xl mx-auto p-4 md:p-6 bg-gray-50">
      {userEvents.length === 0 ? (
        <div className="text-center my-8">
          <p className="text-gray-600">You haven't created any events yet.</p>
          <Link 
            to={`/Organizer/${userId}/add-events`}
            className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-lg"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {userEvents.map(event => (
            <div 
              key={event._id || event.event_id} 
              className="event-card bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100"
            >
              <div className="relative">
                <img
                  src={`http://localhost:5000/${event.image || "default.jpg"}`}
                  alt={event.title}
                  className="w-full h-52 object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {event.category || "Event"}
                </div>
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">{event.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <p className="text-gray-600 flex items-center text-sm">
                    <FaCalendarAlt className="mr-2 text-blue-500" /> 
                    <span className="font-medium">{event.date}</span>
                    <span className="mx-2 text-gray-400">|</span>
                    <FaClock className="mr-2 text-blue-500" /> 
                    <span>{event.time}</span>
                  </p>
                  
                  <p className="text-gray-600 flex items-center text-sm">
                    <FaMapMarkerAlt className="mr-2 text-blue-500" /> 
                    <span className="truncate">{event.location}</span>
                  </p>
                  
                  <div className="flex items-center text-sm">
                    <FaUsers className="mr-2 text-blue-500" />
                    <div className="w-full">
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-700">{event.registered_participants} / {event.max_participants}</span>
                        <span className="text-blue-600 font-medium">
                          {Math.round((event.registered_participants / event.max_participants) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(event.registered_participants / event.max_participants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {event.prizes?.length > 0 && (
                    <p className="text-gray-700 flex items-center text-sm font-medium">
                      <FaTrophy className="mr-2 text-yellow-500" /> 
                      Top Prize: <span className="text-yellow-600 ml-1">{event.prizes[0].reward}</span>
                    </p>
                  )}
                </div>        
                
                <Link 
                   to={`../view-event/${event._id}`} 
                  className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 mt-4"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;