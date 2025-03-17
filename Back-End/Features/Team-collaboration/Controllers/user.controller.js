import User from "../models/user.model.js";

// Search users by name
export const searchUsers = async (req, res) => {
    try {
        const query = req.query.name;
        const loggedInUserId = req.user._id; // Get the logged-in user's ID (assuming it's available in req.user)

        if (!query) {
            return res.status(400).json({ error: "Search query is required" });
        }

        // Since text search is fast but limited, and regex is -
        // -  flexible but slow, we can combine both for the best balance.
        const users = await User.find({
            $or: [
                { $text: { $search: query } }, // Fast indexed search
                { fullName: { $regex: query, $options: "i" } } // Partial match fallback
            ],
            _id: { $ne: loggedInUserId } // 🔹 Exclude the logged-in user
        })
        .limit(10) // Limit results for performance
        .select("fullName _id"); // Return only necessary fields

        res.status(200).json(users);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ error: "Internal server error" });

    }
};
