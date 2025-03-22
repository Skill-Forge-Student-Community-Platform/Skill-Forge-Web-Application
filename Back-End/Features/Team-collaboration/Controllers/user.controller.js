import { User } from "../../User-Authentication/models/User.js";

// Search users by name
export const searchUsers = async (req, res) => {
    try {
        const query = req.query.name;
        const loggedInUserId = req.user.id;

        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const users = await User.find({
            Username: { $regex: query, $options: "i" },
            _id: { $ne: loggedInUserId }
        })
        .limit(10)
        .select("Username _id role");

        res.status(200).json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


