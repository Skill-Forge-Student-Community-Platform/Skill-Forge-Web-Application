import { useState } from "react";
import { useNavigate } from "react-router-dom";

<<<<<<< HEAD
const EventAddingForm = ({ onAddEvent,userId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    //event_id: "",
=======
import { useEvents } from "../../../context/EventContext";

const EventAddingForm = ({ userId }) => {
  const navigate = useNavigate();
  const { addEvent } = useEvents();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({

>>>>>>> 2f0926fca1f8a607dfbd5799857a33847aa5940b
    title: "",
    date: "",
    location: "",
    description: "",
    time: "",
    win_price: "",
<<<<<<< HEAD
    max_participation: "",
=======

    max_participants: "", // Fixed the inconsistent field name (was max_participation)

>>>>>>> 2f0926fca1f8a607dfbd5799857a33847aa5940b
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
<<<<<<< HEAD
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    //Adding userId
    data.append("userId", userId);

    await onAddEvent(data);
    navigate("/"); // Redirect after adding event
=======

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

>>>>>>> 2f0926fca1f8a607dfbd5799857a33847aa5940b
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
<<<<<<< HEAD
  <div className="bg-white max-w-2xl w-full p-8 rounded-lg shadow-lg">
    {/* Title */}
    <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Add New Event</h2>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Event ID 
      <div>
        <label className="block text-gray-700 font-medium">Event ID</label>
        <input
          type="text"
          name="event_id"
          placeholder="Event ID"
          required
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>          
      */}

      {/* Event Title */}
      <div>
        <h1>{userId}</h1>
       

        <label className="block text-gray-700 font-medium">Event Title</label>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          required
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium">Date</label>
          <input
            type="date"
            name="date"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Time</label>
          <input
            type="time"
            name="time"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-gray-700 font-medium">Location</label>
        <input
          type="text"
          name="location"
          placeholder="Location"
          required
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-gray-700 font-medium">Event Description</label>
        <textarea
          name="description"
          placeholder="Event Description"
          required
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Winning Prize & Max Participants */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium">Winning Prize ($)</label>
          <input
            type="number"
            name="win_price"
            placeholder="Winning Prize"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">Max Participants</label>
          <input
            type="number"
            name="max_participation"
            placeholder="Max Participants"
            required
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
          />
        </div>
      </div>

      {/* Event Rules */}
      <div>
        <label className="block text-gray-700 font-medium">Event Rules</label>
        <textarea
          name="rules"
          placeholder="Event Rules"
          required
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-gray-700 font-medium">Event Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg bg-gray-100"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Add Event
        </button>
      </div>
    </form>
  </div>
</div>
=======

      <div className="bg-white max-w-2xl w-full p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Add New Event</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Title */}
          <div>
            <label className="block text-gray-700 font-medium">Event Title</label>
            <input
              type="text"
              name="title"
              placeholder="Event Title"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Date</label>
              <input
                type="date"
                name="date"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Time</label>
              <input
                type="time"
                name="time"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium">Location</label>
            <input
              type="text"
              name="location"
              placeholder="Location"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium">Event Description</label>
            <textarea
              name="description"
              placeholder="Event Description"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Winning Prize & Max Participants */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium">Winning Prize ($)</label>
              <input
                type="number"
                name="win_price"
                placeholder="Winning Prize"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium">Max Participants</label>
              <input
                type="number"
                name="max_participants"
                placeholder="Max Participants"
                required
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
              />
            </div>
          </div>

          {/* Event Rules */}
          <div>
            <label className="block text-gray-700 font-medium">Event Rules</label>
            <textarea
              name="rules"
              placeholder="Event Rules"
              required
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-300"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium">Event Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${loading ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'} text-white font-semibold py-3 rounded-lg shadow-md transition`}
            >
              {loading ? 'Adding Event...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
>>>>>>> 2f0926fca1f8a607dfbd5799857a33847aa5940b

  );
};

export default EventAddingForm;
