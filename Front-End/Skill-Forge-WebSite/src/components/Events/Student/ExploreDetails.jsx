import { 
    FaCalendarAlt, 
    FaMapMarkerAlt, 
    FaFileAlt, 
    FaClock, 
    FaTrophy, 
    FaUsers, 
    FaScroll, 
    FaTicketAlt, 
    FaShareAlt, 
    FaRegBookmark,
    FaArrowLeft,
    FaWhatsapp 
  } from "react-icons/fa";
  
  import React, { useState, useEffect } from "react";
  import { useParams, Link } from "react-router-dom";
  import axios from "axios";
  import SaveEvents from "./SaveEvents";
  import ShareEvent from "./ShareEvent";
  const testEvent = {
    title: "Tech Conference 2025",
    image: "images/event-banner.jpg", // Ensure this path exists in your public folder or use an absolute URL
    organizer: {
      name: "John Doe",
      avatar: "images/organizer-avatar.jpg", // Ensure this file exists for testing
      description: "Lead Organizer at TechEvents Inc.",
    },
  };
  
  
  const ExploreDetails = ({userId,user}) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mapUrl, setMapUrl] = useState("");
    const { id } = useParams();
    const [savedEvents,setSavedEvents] =useState([]);
  
    const [showModal, setShowModal] = useState(false);
    const pageUrl = window.location.href;
  
    const [regloading, setRegLoading] = useState(false);
  
  
    /*const handleRegister = async () => {
      setRegLoading(true);
  
  
      try {
        const response = await fetch("http://localhost:3000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            userName: user.userName,
            email: user.email,
            eventId: id,
          }),
        });
  
        if (response.status === 409) {
          alert("You have already registered for this event!");
          setRegLoading(false);
          return;
        }
  
        if (!response.ok) {
          throw new Error("Failed to register user");
        }
  
        const data = await response.json();
        alert("Registration successful!");
      } catch (error) {
        console.error("Error:", error);
        alert("Registration failed");
      }
      setRegLoading(false);
    }; */
  
  
  
    const handleCopy = () => {
      navigator.clipboard.writeText(pageUrl)
        .then(() => alert("Link copied to clipboard!"))
        .catch(err => console.error("Failed to copy:", err));
    };
  
  
  
    // Fetch saved events for the user when component loads
    useEffect(() => {
      const fetchSavedEvents = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/saved-events/${userId}`);
          setSavedEvents(response.data);
        } catch (error) {
          console.error("Error fetching saved events:", error);
        }
      };
  
      fetchSavedEvents();
    }, [savedEvents, userId]);
    
  
    const handleAddSave = async (e) => {
      try {
        // Check if the event is already saved under this userId
        const isEventSaved = savedEvents.some((event) => event.eventId === e._id);
  
        if (isEventSaved) {
          alert(`You have already saved this event: ${e.title}`);
          return;
        }
  
        // Save the event in the backend
        const response = await axios.post("http://localhost:5000/api/save-event", {
          userId,
          eventId: e._id,
          title: e.title,
          location: e.location,
          date: e.date,
        });
  
        if (response.status === 201) {
          alert(`Event Saved: ${e.title}\nLocation: ${e.location}\nDate: ${e.date}\nUserId: ${userId}`);
         
          setSavedEvents((prevSaved) => [...prevSaved, { eventId: e.id }]); // Update saved events list
        } else {
          alert("Failed to save event. Please try again.");
        }
      } catch (error) {
        console.error("Error saving event:", error);
        alert(`Error saving event. Please check your internet connection. Event Saved: ${e.title}\nLocation: ${e.location}\nDate: ${e.date}\nUserId: ${userId} \n EventId: ${e._id}` ,error);
        
      }
    };
    
  
    const handleWhatsapp = () => {
      const phoneNumber = "+94718005396"; // The organizer's phone number
      const message = encodeURIComponent(`Hi, I'm interested in the event "${event.title}". Could you please provide more information?`);
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
      window.open(whatsappUrl, '_blank');
    };
    
    useEffect(() => {
      const fetchEventDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`http://localhost:5000/Details/${id}`);
          setEvent(response.data);
          
          // Create Google Maps URL based on location
          if (response.data.location) {
            const encodedLocation = encodeURIComponent(response.data.location);
            setMapUrl(`https://www.google.com/maps?q=${encodedLocation}&output=embed`);
          }
        } catch (error) {
          console.error("Error fetching event details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEventDetails();
    }, [id]);
    
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xl font-medium text-gray-700">Loading event details...</p>
          </div>
        </div>
      );
    }
    
    if (!event) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Event Not Found</h2>
            <p className="text-gray-600 text-center mb-6">The event you're looking for doesn't exist or has been removed.</p>
            <Link to="/events" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg text-center transition-colors duration-300">
              Back to Events
            </Link>
          </div>
        </div>
      );
    }
    
    // Format date
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
      return new Date(dateString).toLocaleDateString('en-US', options);
    };
  
    // Calculate percentage of spots filled
    const percentageFilled = event.max_participation > 0 
      ? Math.min(Math.round((event.current_participants || 0) / event.max_participation * 100), 100) 
      : 0;
  
  
  
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Back button */}
          <Link to="../view-events" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6 group transition-colors duration-200">
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Events
          </Link>

          {/* User Details
          <h1>{user.userName}</h1>
          <h1>{user.email}</h1>
          
          */}
          
          
          {/* Main Content Container */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Hero Section with Image and Title Overlay */}
            <div className="relative">
              {event.image ? (
                <div className="h-72 sm:h-96 w-full">
                  <img
                    src={`http://localhost:5000/${event.image}`}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
                </div>
              ) : (
                <div className="h-72 sm:h-96 w-full bg-gradient-to-r from-indigo-600 to-purple-600"></div>
              )}
              
              {/* Event Title and Quick Actions */}
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">Event</span>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
                    {formatDate(event.date)}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 drop-shadow-sm">{event.title}</h1>
              </div>
            </div>
            
            {/* Content Area */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Details */}
                <div className="lg:col-span-2">
                  {/* Description Section */}
                  <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-5 flex items-center">
                      <FaFileAlt className="text-indigo-600 mr-3" /> About This Event
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <p className="whitespace-pre-line">{event.description}</p>
                    </div>
                  </section>
                  
                  {/* Rules Section */}
                  <section className="mb-10 bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <FaScroll className="text-indigo-600 mr-3" /> Event Rules
                    </h2>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <p className="whitespace-pre-line">{event.rules}</p>
                    </div>
                  </section>
                  
                  {/* Map Section */}
                  <section className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                      <FaMapMarkerAlt className="text-red-600 mr-3" /> Location
                    </h2>
                    <div className="rounded-xl overflow-hidden border border-gray-200 h-64 sm:h-80 shadow-sm">
                      <iframe 
                        title="Event Location"
                        width="100%" 
                        height="100%" 
                        frameBorder="0" 
                        src={mapUrl || "https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=default+location"}
                        allowFullScreen>
                      </iframe>
                    </div>
                    <p className="mt-3 text-gray-700 flex items-start">
                      <FaMapMarkerAlt className="text-red-500 mr-2 mt-1 flex-shrink-0" />
                      <span>{event.location}</span>
                    </p>
                  </section>
                </div>
                
                {/* Right Column - Summary Card */}
                <div>
                  <div className="bg-white rounded-xl border border-gray-200 shadow-md sticky top-6">
                    {/* Event Details Card */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-5 pb-3 border-b border-gray-200">
                        Event Details
                      </h3>
                      
                      <div className="space-y-5">
                        <div className="flex items-center">
                          <div className="bg-indigo-100 p-3 rounded-full mr-4">
                            <FaCalendarAlt className="text-indigo-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium">{formatDate(event.date)}</p>
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
                            <p className="font-medium truncate max-w-xs">{event.location}</p>
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
                        
                        <div className="flex items-start">
                          <div className="bg-orange-100 p-3 rounded-full mr-4">
                            <FaUsers className="text-orange-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-gray-500">Capacity</p>
                            <p className="font-medium">{event.current_participants || 0} / {event.max_participation} participants</p>
                            
                            {/* Progress bar */}
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                              <div 
                                className={`h-2.5 rounded-full ${
                                  percentageFilled >= 90 ? 'bg-red-600' : 
                                  percentageFilled >= 70 ? 'bg-orange-500' : 
                                  'bg-green-600'
                                }`}
                                style={{ width: `${percentageFilled}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {event.max_participation - (event.current_participants || 0)} spots left
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Register Button /}
                      <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg mt-6 transition-colors duration-300 flex items-center justify-center shadow-sm"
                        onClick={handleRegister} disabled={loading}
                      >
                        <FaTicketAlt className="mr-2" />  {regloading ? "Registering..." : "Register"}
                      </button>
                       {/* still making in process */}
                      
                     {/* Action Buttons */}
                      <div className="flex mt-4 space-x-2">
  
                        
                        <button
                        onClick={() => handleAddSave(event)}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center">
                          <FaRegBookmark className="mr-2" /> Save
                        </button>
  
  
                        <button 
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                        onClick={() => setShowModal(true)}
                       >
                       <FaShareAlt className="mr-2" /> Share
                      </button>
  
  
                        <button 
                          onClick={handleWhatsapp}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                        >
                          <FaWhatsapp className="mr-2" /> Contact
                        </button>
                      </div>
                       
                                
                      <SaveEvents cart={savedEvents} setCart={setSavedEvents} userId={userId} />
                                          
                      {/* Organizer Info *   these data are from logging details of the users */}
                      {testEvent.organizer && (
                        <div className="mt-6 pt-5 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-500 mb-3">Organized by</h4>
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden mr-3">
                              {testEvent.organizer.avatar ? (
                                <img 
                                  src={`http://localhost:3000/${testEvent.organizer.avatar}`} 
                                  alt={testEvent.organizer.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-600 font-semibold">
                                  {testEvent.organizer.name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{testEvent.organizer.name}</p>
                              <p className="text-sm text-gray-500">{testEvent.organizer.description || "Event Organizer"}</p>
                            </div>
                          </div>
                        </div>
                      )}
  
                      <ShareEvent
                    showModal={showModal}
                    setShowModal={setShowModal}
                    pageUrl={pageUrl}
                    handleCopy={handleCopy}
                  />
  
  
                      
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ExploreDetails;