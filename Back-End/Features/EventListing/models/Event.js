import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
    userId: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        required: false, // Optional field
    },
    title: {
        type: String,
        required: true,
    },
    date: {
        type: Date, // Use Date type for date fields
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    time: {
        type: String, // Keeping it as String if stored in "HH:MM" format
        required: true,
    },
    win_price: {
        type: Number, // Since it's a prize amount, Number is suitable
        required: true,
    },
    max_participation: {
        type: Number, // Maximum number of participants should be a Number
        required: true,
    },
    rules: {
        type: String, // Rules stored as a single text block
        required: true,
    },
    image: {
        type: String, // Assuming image is stored as a URL or filename
    },
    combinedId: {
        type: String,
        unique: true, // Ensure it's unique
        required: false,
    }
});

// Pre-save hook to combine userId and title into combinedId
EventSchema.pre('save', function (next) {
    if (this.userId && this.title) {
        // Combine userId and title into a single string
        this.combinedId = `${this.userId}-${this.title}-${this._id}`;
    }
    next();
});

const Event = mongoose.model("Event", EventSchema);

export default Event;
