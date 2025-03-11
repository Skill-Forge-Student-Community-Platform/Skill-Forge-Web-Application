import { useState } from "react";
import { useTeamStore } from "../store/useTeamStore.js";


const CreateTeam = () => {
    const { createTeam } = useTeamStore();
    const [name, setName] = useState("");
    const [technology, setTechnology] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !technology) return alert("Please fill in all fields");
        await createTeam(name, technology);
        setName("");
        setTechnology("");
    };

    return (
        <div className="create-team">
            <h3>Create a Team</h3>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Team Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Technology (e.g., React, Python)"
                    value={technology}
                    onChange={(e) => setTechnology(e.target.value)}
                />
                <button type="submit">Create Team</button>
            </form>
        </div>
    );
};

export default CreateTeam;
