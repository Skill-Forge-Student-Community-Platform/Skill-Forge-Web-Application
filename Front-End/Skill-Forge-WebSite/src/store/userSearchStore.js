import { create } from "zustand";
import { axiosIntance } from ".././utils/axios.js";

const useUserSearchStore = create((set, get) => ({
  users: [],
  loading: false,
  error: null,
  modalOpen: false,
  selectedUser: null,
  selectedTeamId: null, // <-- Store the teamId

  searchUsers: async (query) => {
    if (!query) {
      set({ users: [], error: null });
      return;
    }

    set({ loading: true, error: null });

    try {
      const res = await axiosIntance.get(`/teams/search?name=${query}`);
      set({ users: res.data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.error || "Failed to fetch users",
        loading: false,
      });
    }
  },

  openInviteModal: (user, teamId) => {
    set({ modalOpen: true, selectedUser: user, selectedTeamId: teamId }); // <-- Store the teamId
  },

  closeInviteModal: () => {
    set({ modalOpen: false, selectedUser: null, selectedTeamId: null });
  },

  sendInvite: async () => {
    set({ modalOpen: false });
    const { selectedUser, selectedTeamId } = get(); // <-- Get the correct teamId

    if (!selectedUser || !selectedTeamId) return;

    try {
      const res = await axiosIntance.post("/teams/invite", {
        teamId: selectedTeamId,
        userId: selectedUser._id,
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to send invite");
    }
  },
}));

export default useUserSearchStore;
