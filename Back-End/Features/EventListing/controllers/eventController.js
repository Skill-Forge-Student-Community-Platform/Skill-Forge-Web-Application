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
    console.log("Request body:", req.body);
    console.log("Request files:", req.files ? Object.keys(req.files) : "No files");
    
    const { userId, title, date, location, description, time, win_price } = req.body;
    
    // Handle field name inconsistency
    const max_participation = req.body.max_participants || req.body.max_participation || 10;
    const rules = req.body.rules || "";
    
    let imagePath = null;

    // Check if image file is uploaded
    if (req.files && req.files.image) {
      try {
        const imageFile = req.files.image;
        const uploadDir = path.join("uploads");

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const safeFileName = Date.now() + '_' + imageFile.name.replace(/\s+/g, '_');
        imagePath = `uploads/${safeFileName}`;
        
        // Move the file
        await imageFile.mv(imagePath);
        console.log("File uploaded successfully to:", imagePath);
      } catch (uploadError) {
        console.error("File upload error:", uploadError);
        return res.status(500).json({ error: "File upload failed", details: uploadError.message });
      }
    }

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

export const getEventsId = async (req, res, next) => {
  try {
    const id = req.params.event_id; // This should be the MongoDB document _id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID format" });
    }

    // Fetch event from the database using MongoDB's ObjectId
    const event = await Event.findById(id);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    return res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

export const deleteEvent = async (req, res, next) => {
  try {
    const id = req.params.event_id; // Ensure it matches your route

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID format" });
    }

    // Find and delete the event
    const deletedEvent = await Event.findByIdAndDelete(id);

    if (!deletedEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Delete associated image file if it exists
    if (deletedEvent.image) {
      const imagePath = `./${deletedEvent.image}`; // Adjust path if needed
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error("Error deleting image:", err);
        });
      }
    }

    return res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    next(error); // Pass error to the Express error handler
  }
};

export const deleteEventAll = async (req, res) => {
  try {
    await Event.deleteMany({});
    res.status(200).json({ message: "All events deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete all events" });
  }
};

export const editEvent = async (req, res) => {
  try {
    const id = req.params.event_id; // Ensure it matches your route

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid event ID format" });
    }

    const { title, date, location, description, time, win_price, max_participation, rules } = req.body;

    let updateData = { title, date, location, description, time, win_price, max_participation, rules };

    // Find event to get old image path before updating
    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Handle Image Update
    if (req.files && req.files.image) {
      const imageFile = req.files.image;
      const uploadDir = "uploads";

      // Ensure upload directory exists
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const imagePath = `${uploadDir}/${Date.now()}_${imageFile.name}`;

      // Move the new image file
      await imageFile.mv(imagePath);

      // Delete old image if exists
      if (existingEvent.image) {
        const oldImagePath = `./${existingEvent.image}`; // Adjust if needed
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error("Error deleting old image:", err);
          });
        }
      }

      updateData.image = imagePath; // Update image path
    }

    // Update event in the database
    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

    return res.status(200).json({ message: "Event updated successfully", event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};