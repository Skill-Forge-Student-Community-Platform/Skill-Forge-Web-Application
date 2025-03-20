import RegisteredUser from "../Models/RegisteredUser.js";



export const getRegisteredUser = async (req, res) => {
  try {
    const registeredUsers = await RegisteredUser.find();

    // Aggregate points by userId
    /*const userPointsMap = {};

    registeredUsers.forEach(user => {
      const { userId, userName, email, points } = user;

      if (!userPointsMap[userId]) {
        userPointsMap[userId] = {
          userId,
          userName,
          email,
          //totalPoints: 0, // Initialize total points
        };
      }

      //userPointsMap[userId].totalPoints += points; // Sum points
    }); */

    // Convert object values to an array
    //const consolidatedUsers = Object.values(userPointsMap);

    res.json(registeredUsers);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const registerUser = async (req, res) => {
  try {
    // Log incoming data for debugging
    console.log("Registration request body:", req.body);
    
    const { userId, userName, email, eventId } = req.body;
    
    // Validate required fields
    if (!userId || !userName || !email || !eventId) {
      console.log("Missing required fields:", { userId, userName, email, eventId });
      return res.status(400).json({ 
        message: "Missing required fields",
        received: req.body 
      });
    }
    
    // Check for existing registration
    const existingRegistration = await RegisteredUser.findOne({ userId, eventId });
    if (existingRegistration) {
      return res.status(409).json({ message: "User already registered for this event" });
    }
    
    // Create new registration
    const newRegistration = new RegisteredUser({
      userId,
      userName,
      email,
      eventId
    });
    
    // Save the registration
    await newRegistration.save();
    
    // Update event participants count - this might be causing the error if Event model isn't imported
    try {
      const mongoose = await import('mongoose');
      const Event = mongoose.default.model('Event');
      await Event.findByIdAndUpdate(
        eventId, 
        { $inc: { current_participants: 1 } }
      );
    } catch (eventUpdateError) {
      // If updating event fails, log but still consider registration successful
      console.error("Failed to update event participant count:", eventUpdateError);
    }
    
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ 
      message: "Server error during registration", 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};
  export const getRegisteredUsersByEvent = async (req, res) => {
    try {
      const { eventId } = req.params;
  
      // Find all users registered for the given eventId
      const registeredUsers = await RegisteredUser.find({ eventId });
  
     return res.json(registeredUsers);
    } catch (error) {
      console.error("Error fetching registered users:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };


  

// Remove a registered user from an event
export const removeUserFromEvent = async (req, res) => {
    try {
      const { registrationId } = req.params;
      console.log(registrationId);
  
      // Find and delete the registration entry using its unique _id
      const deletedUser = await RegisteredUser.findByIdAndDelete(registrationId);
  
      if (!deletedUser) {
        return res.status(404).json({ message: "User registration not found" });
      }
  
      res.status(200).json({ message: "User removed successfully" });
    } catch (error) {
      console.error("Error removing user:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

/*
  export const updateUserPoints = async (req, res) => {
    try {
      const { userId } = req.params;
      const { points } = req.body;
  
      if (!points || isNaN(points)) {
        return res.status(400).json({ error: "Invalid points value" });
      }
  
      const user = await RegisteredUser.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      user.points += points;
      await user.save();
  
      res.status(200).json({ message: "User points updated", user });
    } catch (error) {
      console.error("Error updating points:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  */
  
