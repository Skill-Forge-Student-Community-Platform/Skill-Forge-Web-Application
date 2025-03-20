import { useState } from "react";
import { useTeamStore } from "../store/useTeamStore";


const InviteUser = ({ teamId }) => {
    const { searchUsers, sendInvite } = useTeamStore();
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const handleSearch = async (e) => {
        setQuery(e.target.value);
        searchUsers(e.target.value, setSuggestions);
    };

    const handleInvite = async (userId) => {
        await sendInvite(teamId, userId);
        setSuggestions([]);
        setQuery("");
    };

    return (
        <div className="invite-user">
            <h3>Invite a User</h3>
            <input
                type="text"
                placeholder="Search users..."
                value={query}
                onChange={handleSearch}
            />
            {suggestions.length > 0 && (
                <ul>
                    {suggestions.map((user) => (
                        <li key={user._id} onClick={() => handleInvite(user._id)}>
                            {user.name} ({user.email})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default InviteUser;
