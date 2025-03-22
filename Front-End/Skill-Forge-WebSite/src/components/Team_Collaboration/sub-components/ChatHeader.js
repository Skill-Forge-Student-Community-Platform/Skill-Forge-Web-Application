import React from 'react'
import { useChatStore } from '../../../store/useChatStore.js'
import { useAuthStore } from "../../../store/authStore.js";
import { X } from "lucide-react";

function ChatHeader() {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const isOnline = onlineUsers.includes(selectedUser._id);

  return (
    <div className="px-4 py-3 border-b border-gray-800 bg-gray-900 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar with online indicator */}
          <div className="relative">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-800 shadow-lg">
              <img 
                src={selectedUser.profilePic || "/avatar.png"} 
                alt={selectedUser.fullName}
                className="w-full h-full object-cover" 
              />
            </div>
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
            )}
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium text-gray-100">{selectedUser.Username}</h3>
            <p className={`text-xs ${isOnline ? "text-green-400" : "text-gray-500"}`}>
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* Close button */}
        <button 
          onClick={() => setSelectedUser(null)}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors duration-200"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export default ChatHeader