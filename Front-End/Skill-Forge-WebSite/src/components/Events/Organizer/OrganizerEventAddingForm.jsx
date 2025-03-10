import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EventAddingForm = ({ onAddEvent,userId }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    //event_id: "",
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
    const data = new FormData();
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    //Adding userId
    data.append("userId", userId);

    await onAddEvent(data);
    navigate("/"); // Redirect after adding event
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
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

  );
};

export default EventAddingForm;
