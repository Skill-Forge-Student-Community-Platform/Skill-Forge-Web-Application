import { create } from "zustand";
import { axiosIntance } from "../utils/axios.js";
import { getApiBaseUrl } from "../utils/environment";

const useGlobalSearchStore = create((set, get) => ({
  query: "",
  users: [],
  events: [],
  loading: false,
  error: null,

  // Set the current search query
  setQuery: (query) => set({ query }),

  // Search for both users and events
  search: async (query) => {
    if (!query || query.trim() === "") {
      set({ users: [], events: [], error: null });
      return;
    }

    set({ loading: true, error: null });

    try {
      // Search for users
      const userPromise = axiosIntance.get(`/teams/search?name=${query}`);

      // Search for events
      const eventPromise = axiosIntance.get(`${getApiBaseUrl()}/events/search?term=${query}`);

      // Wait for both requests to complete
      const [userResponse, eventResponse] = await Promise.all([
        userPromise.catch(err => ({ data: [] })),
        eventPromise.catch(err => ({ data: [] }))
      ]);

      set({
        users: userResponse.data || [],
        events: eventResponse.data || [],
        loading: false
      });
    } catch (err) {
      set({
        error: "Failed to fetch search results",
        loading: false
      });
    }
  },

  // Clear search results
  clearResults: () => set({ users: [], events: [], query: "" }),
}));

export default useGlobalSearchStore;
