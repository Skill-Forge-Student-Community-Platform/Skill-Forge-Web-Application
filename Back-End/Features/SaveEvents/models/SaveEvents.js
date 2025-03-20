import mongoose from "mongoose"; 

const SavedEventSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  eventId: { 
    type: String, 
    required: true ,
    unique: false
  },
  title: { 
    type: String, 
    required: true 
  },
  location: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    required: true 
  },
});

// Create a composite unique index for userId and eventId
SavedEventSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const SavedEvent = mongoose.model("SavedEvent", SavedEventSchema);
export default SavedEvent;

