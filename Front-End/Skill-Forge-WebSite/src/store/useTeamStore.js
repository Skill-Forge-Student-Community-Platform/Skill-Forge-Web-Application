import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosIntance } from ".././utils/axios";

export const useTeamStore = create((set)=>({
    teams: [],
    invites: [],
    receivedInvites: [],
    sentInvites: [],
    members: [],
    loading: false,
    error:null,

    // Create a new team
    createTeam: async (name, technology) => {
        try {
            const res = await axiosIntance.post("/teams/createTeam", { name, technology });
            set((state) => ({ 
                teams: [...state.teams, res.data.team],
                invites: state.invites.filter(invite => invite.teamId !== res.data.team._id), // Remove pending invites if relevant    
            }));
            toast.success("Team created successfully!");
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to create team");
        }
    },



    // get teams
    getTeamsByUser: async()=>{
        set({ loading: true, error: null });
        try {
            const res = await axiosIntance.get("/teams/getTeams");
        // Extract invites from all teams where the user is invited
        const invites = res.data.flatMap(team => team.invites || []);

        set({
            teams: res.data, 
            invites, // Correctly extract invites
            loading: false
        });
            toast.success("Teams loaded successfully! 🚀");
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Something went wrong";
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
        }
    }, 

    fetchReceivedInvites: async () => {
        try {
            const { data } = await axiosIntance.get("/teams/invites/received", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            set({ receivedInvites: data });
        } catch (error) {
            console.error("Error fetching received invites", error);
        }
    },
    
    fetchSentInvites: async () => {
        try {
            const { data } = await axiosIntance.get("/teams/invites/sent", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            set({ sentInvites: data });
        } catch (error) {
            console.error("Error fetching sent invites", error);
        }
    },



    respondToInvite: async (teamId, action) => {
        try {
            await axiosIntance.post("/teams/respondToInvite", { teamId, action }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
    
            set((state) => ({
                receivedInvites: state.receivedInvites.filter((invite) => invite._id !== teamId)
            }));
    
            toast.success(`Invite ${action}ed successfully!`);
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to respond to invite");
        }
    },

     // Kick a member from the team
     kickMemberFromTeam: async (teamId, memberId) => {
        try {
            await axiosIntance.post("/teams/kick-member", { teamId, memberId });
            set((state) => ({
                teams: state.teams.map((team) =>
                    team._id === teamId ? { ...team, members: team.members.filter(m => m._id !== memberId) } : team
                ),
            }));
            toast.success("Member removed successfully");
        } catch (error) {
            toast.error(error.response?.data?.error || "Error removing member");
        }
    },
}));