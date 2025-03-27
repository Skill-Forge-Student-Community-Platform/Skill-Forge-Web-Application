import { create } from "zustand";
import axios from "axios";
import { getApiBaseUrl } from "../utils/environment";

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true
});

// Change from default export to named export
export const useChatStore = create((set) => ({
  users: [],
  selectedUser: null,
  messages: [],
  loading: false,
  isUsersLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await api.get("/messages/users");
      set({ users: res.data, isUsersLoading: false });
    } catch (error) {
      console.error("Error fetching users:", error);
      set({ isUsersLoading: false });
    }
  },

  setSelectedUser: (user) => set({ selectedUser: user }),

  getMessages: async (selectedUserId) => {
    if (!selectedUserId) return;

    set({ loading: true });
    try {
      const res = await api.get(`/messages/${selectedUserId}`);
      set({ messages: res.data, loading: false });
    } catch (error) {
      console.error("Error fetching messages:", error);
      set({ loading: false });
    }
  },

  sendMessage: async (message, recipientId) => {
    try {
      await api.post(`/messages/send/${recipientId}`, { message });
      await useChatStore.getState().getMessages(recipientId);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}));

// You can keep the default export for backward compatibility
export default useChatStore;
