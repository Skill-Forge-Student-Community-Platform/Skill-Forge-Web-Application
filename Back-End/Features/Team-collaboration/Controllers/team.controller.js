import Team from "../models/team.model.js";
import { User } from "../../User-Authentication/models/User.js";
import mongoose from "mongoose";

// Create a team
export const createTeam = async (req, res) => {
    const { name, technology } = req.body;
    const creatorId = req.user._id;  // Get logged-in user ID

    try {
        const team = new Team({ name, technology, members: [creatorId], creator: creatorId });
        await team.save();

        const updatedUser = await User.findByIdAndUpdate(
            creatorId,
            { 
                $addToSet: { teams: team._id },  // Ensure unique team IDs in the array
                $set: { creator: creatorId }    // Set creator ID directly
            },
            { new: true } // ✅ Return updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(201).json({ team, updatedUser });
        console.log("Team created. Team ID:", team._id);
        console.log("the Creator is:",creatorId);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Get teams created by the logged-in user
export const getTeamsByUser = async (req, res) => {
    const creatorId = req.user._id; // Get logged-in user ID

    try {
        const teams = await Team.find({
            $or: [
                { creator: creatorId },  // Teams where the user is the creator
                { members: creatorId }   // Teams where the user is a member
            ]
        }).populate('members');
        
        
        if (!teams.length) {
            return res.status(404).json({ error: "No teams found for this user" });
        }

        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



//Send Collaboration Request
export const sendInvite = async (req, res) => {
    const { userId, teamId } = req.body; // Get logged-in user ID
    console.log("Sending invite request:", { userId, teamId },"from team.controller");


    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(teamId) || !mongoose.Types.ObjectId.isValid(userId)) {
        console.error("Invalid ID format:", { userId, teamId });
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        // Check MongoDB connection status
        if (mongoose.connection.readyState !== 1) {
            throw new Error("MongoDB connection is not established");
        }

        const team = await Team.findById(teamId);
        if (!team) {
            console.error("Team not found:", teamId);
            return res.status(404).json({ error: "Team not found" });
        }

        // Ensure only team creators can invite
        if (team.creator.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Only the team creator can send invites" });
        }

        // Check if user is already in the team
        if (team.members.includes(userId)) {
            return res.status(400).json({ error: "User is already a member of the team" });
        }

        // Check if user is already invited
        if (team.invites.some(inv => inv.toString() === userId.toString())) {
            return res.status(400).json({ error: "User is already invited right!" });
        }
        
        // Send invitation
        team.invites.push(userId);

        await team.save();
        console.log("Invitation sent successfully:", { teamId, userId });

        res.status(200).json({ message: `Invitation sent to ${userId} successfully!` });
    } catch (error) {
        console.error("Error in sendInvite:", error);
        const errorMessage = error.name === 'MongooseError' ? 
            'Database connection error' : error.message;
        res.status(500).json({ error: errorMessage });
    }
};



// Responding to Invitation
export const respondToInvite = async (req, res) => {
    const { teamId, action } = req.body;
    const userId = req.user._id; // Get userId from authentication

    if (!mongoose.Types.ObjectId.isValid(teamId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        const team = await Team.findById(teamId);
        const user = await User.findById(userId);

        if (!team || !user) return res.status(404).json({ error: "Team or User not found" });

        // Ensure user has an invite
        if (!team.invites.includes(userId.toString())) {
            return res.status(400).json({ error: "No invite found" });
        }

        // Remove the invite properly
        team.invites = team.invites.filter(id => id.toString() !== userId.toString());

        //Ensure Mongoose recognizes the change
        team.markModified("invites");

        // First, save the removal of the invite
        await team.save();

        if (action === "accept") {
            if (team.members.includes(userId.toString())) {
                return res.status(400).json({ error: "User is already a team member" });
            }

            team.members.push(userId);
            user.teams.push(teamId);

        } else if (action === "reject") {
            await user.save();
            return res.json({ message: "Invite rejected successfully" });
        } else {
            return res.status(400).json({ error: "Invalid action" });
        }

        // Save after accept/reject processing
        await team.save();
        await user.save();

        res.json({ message: `Invite ${action}ed successfully` });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};







// Get invites the user received
export const getReceivedInvites = async (req, res) =>{
    const userId = req.user._id;
    try {
        const teams = await Team.find({ invites:userId }).populate("creator", "fullName email")

        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: "Error fetching received invites" });
        console.log( error,"Error fetching received invites");
    }
};



// Get invites the user sent (as a team creator)
export const getSentInvites = async (req, res) =>{
    const userId = req.user._id;
    try {
        const teams = await Team.find({ creator: userId }).populate("invites", "fullName email");

        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: "Error fetching sent invites" });
        console.log( error,"Error fetching sent invites");
    }
};

// Function to kick a member from the team
export const kickMemberFromTeam = async (req, res) => {
    const { teamId, memberId } = req.body;

    try {
        const team = await Team.findById(teamId);

        // Check if the user is the team creator
        if (!team.creator.equals(req.user._id)) {
            return res.status(403).json({ message: "Only the creator can remove members" });
        }

        // Remove the member from the team
        team.members = team.members.filter((member) => !member.equals(memberId));

        await team.save();

        res.status(200).json({ message: "Member kicked successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error kicking the member" });
    }
};