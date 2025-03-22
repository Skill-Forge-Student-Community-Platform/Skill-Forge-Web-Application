import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosIntance } from ".././utils/axios.js";

const useCompetitionStore = create((set) => ({
    trendingCompetitions: [],
    loading: false,
    error: null,

    getTrendingCompetitions: async () => {
        set({ loading: true, error: null });
        try {
            const res = await axiosIntance.get("/competitions/trending");
            set({ trendingCompetitions: res.data });
            toast.success("Trending competitions fetched successfully");
        } catch (error) {
            set({ error: "Failed to fetch trending competitions" });
            toast.error("Failed to fetch competitions");
        } finally {
            set({ loading: false });
        }
    }
}));

export default useCompetitionStore;
