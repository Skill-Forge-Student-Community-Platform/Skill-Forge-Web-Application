import { Event } from '../../Events/models/Event.js';

export const searchEvents = async (req, res) => {
  try {
    const { term } = req.query;

    if (!term) {
      return res.status(400).json({ error: "Search term is required" });
    }

    const events = await Event.find({
      $or: [
        { title: { $regex: term, $options: "i" } },
        { location: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } }
      ]
    })
    .limit(5)
    .select("_id title date location image");

    res.status(200).json(events);
  } catch (error) {
    console.error("Error searching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
