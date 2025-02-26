import React from 'react';
import { FaTimes, FaCamera } from 'react-icons/fa';
import './EventModal.css';
import '../shared/ModalStyles.css';

const EventModal = ({ closeWindow, eventDetails, setEventDetails }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="modal-content" data-modal="event">
      <div className="modal-header">
        <h1>Create an Event</h1>
        <button className="close-btn" onClick={closeWindow}><FaTimes /></button>
      </div>

      <div className="modal-content-scroll">
        <div className="modal-form-container">
          <div className="cover-upload">
            <FaCamera />
            <p>Upload cover image</p>
          </div>
          <div className="form-group">
            <label>Event Type</label>
            <div className="event-type-options">
              <button className={eventDetails.type === "Online" ? "selected" : ""}>Online</button>
              <button className={eventDetails.type === "In Person" ? "selected" : ""}>In Person</button>
            </div>
          </div>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Event Name"
              value={eventDetails.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group date-time">
            <input
              type="date"
              name="startDate"
              value={eventDetails.startDate}
              onChange={handleChange}
            />
            <input
              type="time"
              name="startTime"
              value={eventDetails.startTime}
              onChange={handleChange}
            />
          </div>
          <div className="form-group date-time">
            <input
              type="date"
              name="endDate"
              value={eventDetails.endDate}
              onChange={handleChange}
            />
            <input
              type="time"
              name="endTime"
              value={eventDetails.endTime}
              onChange={handleChange}
            />
          </div>
          <input
            type="url"
            name="externalLink"
            placeholder="External Event Link"
            value={eventDetails.externalLink}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={eventDetails.description}
            onChange={handleChange}
          />
          <input
            type="text"
            name="speakers"
            placeholder="Speakers"
            value={eventDetails.speakers}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="modal-footer">
        <button className="cancel-btn" onClick={closeWindow}>Cancel</button>
        <button className="primary-btn">Next</button>
      </div>
    </div>
  );
};

export default EventModal;
