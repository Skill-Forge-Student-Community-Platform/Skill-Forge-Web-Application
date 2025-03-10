import path from "path";
import fs from "fs";
import Event from "../models/Event.js";
import mongoose from "mongoose";

export const getEvents = async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req, res) => {
  try {
    // Since we don't have fileUpload middleware, we'll use a simpler approach
    const { userId, title, date, location, description, time, win_price } = req.body;
    
    // Handle field name inconsistency
    const max_participation = req.body.max_participants || req.body.max_participation || 10;
    const rules = req.body.rules || "";
    
    // No image handling for now - simplified version
    let imagePath = "default.jpg";

    // Create a new event instance
    const newEvent = new Event({
      userId,
      title,
      date,
      location,
      description,
      time,
      win_price,
      max_participation,
      rules,
      image: imagePath,
      registered_participants: 0
    });

    // Save to MongoDB
    await newEvent.save();
    console.log("Event saved with ID:", newEvent._id);

    res.status(201).json({ message: "Event Created Successfully", event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Failed to create event", details: error.message });
  }
};

// ...existing code for other methods (getEventsId, deleteEvent, etc)...
