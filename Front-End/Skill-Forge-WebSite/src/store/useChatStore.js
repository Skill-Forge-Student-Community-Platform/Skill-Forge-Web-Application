import {create} from "zustand";
import toast from "react-hot-toast";
import { axiosIntance } from ".././utils/axios.js";

export const useChatStore = create((set, get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUsersLoding:false,
    isMessagesLoding:false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {

            // endpoint

          const res = await axiosIntance.get("/messages/users");
          set({ users: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isUsersLoading: false });
        }
    },

    //fetches the specfic chat using userId
      getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
          const res = await axiosIntance.get(`/messages/${userId}`);

          //   update state
          set({ messages: res.data });
        } catch (error) {
          toast.error(error.response.data.message);
        } finally {
          set({ isMessagesLoading: false });
        }
    },

    sendMessage:async (messageData)=>{
      const {selectedUser, messages} = get()
      try {
        const res = await axiosIntance.post(`/messages/send/${selectedUser._id}`,messageData);
        // keep the previous messages and add the very last one to the end
        set({messages:[...messages,res.data]})
      } catch (error) {
        toast.error(error.response.data.message);
      }
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),
}))
