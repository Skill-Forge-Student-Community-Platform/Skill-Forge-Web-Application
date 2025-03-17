
import SavedEvent from "../models/SavedEvent.js";

// Save an event for a user
export const saveEvent = async (req, res) => {
  const { userId, eventId, title, location, date } = req.body;

  try {
    const existingEvent = await SavedEvent.findOne({ userId, eventId });

    if (existingEvent) {
      return res.status(400).json({ message: "Event already saved by this user." });
    }

    const newEvent = new SavedEvent({ userId, eventId, title, location, date });
    await newEvent.save();

    res.status(201).json({ message: "Event saved successfully!" });
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(500).json({ message: "Error saving event. Please try again later." });
  }
};

// Get all saved events for a user
export const getSavedEvents = async (req, res) => {
  const { userId } = req.params;

  try {
    const savedEvents = await SavedEvent.find({ userId });

    if (!savedEvents.length) {
      return res.status(404).json({ message: "No saved events found." });
    }

    res.status(200).json(savedEvents);
  } catch (error) {
    console.error("Error fetching saved events:", error);
    res.status(500).json({ message: "Error fetching saved events." });
  }
};

// Delete a saved event
/*
export const deleteSavedEvent = async (req, res) => {
  const { userId, eventId } = req.params;

  try {
    const deletedEvent = await SavedEvent.findOneAndDelete({ userId, eventId });

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found in saved events." });
    }

    res.status(200).json({ message: "Saved event deleted successfully!" });
  } catch (error) {
    console.error("Error deleting saved event:", error);
    res.status(500).json({ message: "Error deleting saved event." });
  }
};
*/

export const deleteSavedEvent = async (req, res) => {
  const { id } = req.params;
  console.log(`Attempting to delete event with _id: ${id}`); // Log received ID

  try {
    const deletedEvent = await SavedEvent.findByIdAndDelete(id);

    if (!deletedEvent) {
      console.log('Event not found in the database.');
      return res.status(404).json({ message: 'Event not found' });
    }

    console.log('Deleted event:', deletedEvent); // Log deleted event details
    res.status(200).json({ message: 'Event deleted successfully', deletedEvent });

  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event', error });
  }
};

