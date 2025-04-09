import React, { useEffect } from 'react'
import { useChatStore } from '../../../store/useChatStore.js'
import SidebarSkeleton from './skeletons/SidebarSkeleton.js';
import { useAuthStore } from "../../../store/authStore.js";
// import { User } from 'lucide-react';

function Sidebar() {
    const { getUsers, users, selectedUsers, setSelectedUser, isUsersLoding } = useChatStore();
    const { onlineUsers } = useAuthStore();
    
    useEffect(() => {
        getUsers()
    }, [getUsers]);

    if(isUsersLoding) return <SidebarSkeleton/>

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-gray-800 bg-gray-900 flex flex-col transition-all duration-200">
        <div className="border-b border-gray-800 w-full p-5">
          <div className='flex flex-col sm:flex-row rounded-lg p-1.5 gap-2 bg-gray-800 w-full sm:w-auto'>
            <button className='border border-gray-700 rounded-lg text-base sm:w-[110px] font-bold flex items-center justify-center bg-indigo-600 text-white py-2 px-4'>
              Teams
            </button>
            <button className='bg-gray-700 border border-gray-700 rounded-lg text-base sm:w-[110px] font-bold flex items-center justify-center py-2 px-4 text-gray-300'>
              All
            </button>
          </div>
        </div>

        <div className='overflow-y-auto w-full py-3 scrollbar-thin scrollbar-thumb-gray-700'>
        {users.map((user) => {
          const isOnline = onlineUsers.includes(user._id);
          const isSelected = selectedUsers?._id === user._id;
          
          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-gray-800 transition-colors
                ${isSelected ? "bg-gray-800 border-l-4 border-indigo-500" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-800">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                {isOnline && (
                  <span
                    className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 
                    rounded-full ring-2 ring-gray-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate text-gray-100">{user.Username}</div>
                <div className={`text-sm ${isOnline ? "text-green-400" : "text-gray-500"}`}>
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          );
        })}
        </div>
    </aside>
  )
}

export default Sidebar