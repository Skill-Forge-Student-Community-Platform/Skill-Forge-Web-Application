import mongoose from "mongoose";

const teamSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        technology: { 
            type: String, 
            required: true 
        },
        members: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User',
                unique:false
            }
        ],
        invites: [
            { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: 'User' 
            }
        ],
        creator: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User' 
        },  // Add creator field
    },
    { timestamps: true }
);

// Ensure no accidental unique index is set on `members`
teamSchema.index({ members: 1 }, { unique: false });

const Team = mongoose.model("Team", teamSchema);
console.log("team schema created");

export default Team;
