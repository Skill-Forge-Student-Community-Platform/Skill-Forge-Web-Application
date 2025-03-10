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
    const creatorId = req.user._id;;  // Get logged-in user ID

    try {
        const teams = await Team.find({ creator: creatorId }).populate('members');

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
    const { userId, teamId } = req.body;

    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(teamId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ error: "Team not found" });

        // Check if user is already in the team
        if (team.members.includes(userId)) {
            return res.status(400).json({ error: "User is already a member of the team" });
        }

        // Check if user is already invited
        if (team.invites.includes(userId)) {
            return res.status(400).json({ error: "User is already invited" });
        }

        // Send invitation
        team.invites.push(userId);
        await team.save();

        res.status(200).json({ message: "Invitation sent successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Accept Invitation
export const acceptInvite = async (req, res) => {
    const { teamId, userId } = req.body;

    // Validate MongoDB ObjectIds
    if (!mongoose.Types.ObjectId.isValid(teamId) || !mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ error: "Team not found" });

        // Check if user is already a team member
        if (team.members.includes(userId)) {
            return res.status(400).json({ error: "User is already a member of the team" });
        }

        // Check if user is invited
        if (!team.invites.includes(userId)) {
            return res.status(400).json({ error: "Invalid invitation" });
        }

        // Add user to team and remove from invites
        team.members.push(userId);
        team.invites = team.invites.filter(inv => inv.toString() !== userId.toString());
        await team.save();

        // Add team to the user's teams array
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $addToSet: { teams: team._id } }, // Prevents duplicate team entries
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ message: "Joined team successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};



// Get Teams by  according to their Interest
// export const getTeamsByInterest = async(req, res)=>{
//     try {
//         const teams = await Team.find({ technology: req.params.technology }).populate('members');
//         res.status(200).json(teams);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
