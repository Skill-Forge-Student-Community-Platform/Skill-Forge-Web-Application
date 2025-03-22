import React, { useEffect } from 'react'
import { useChatStore } from '../../../store/useChatStore.js'
import SidebarSkeleton from './skeletons/SidebarSkeleton.js';
import { useAuthStore } from "../../../store/authStore.js";
// import { User } from 'lucide-react';

function Sidebar() {
    const{ getUsers, users, selectedUsers, setSelectedUser, isUsersLoding }= useChatStore();

    const { onlineUsers } = useAuthStore();
    

    useEffect(() =>{
        getUsers()
    },[getUsers]);

    if(isUsersLoding) return <SidebarSkeleton/>

  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
        <div className="border-b border-base-300 w-full p-5 ">
          <div className='flex flex-col sm:flex-row rounded-lg p-1.5 gap-2 bg-gray-200 w-full sm:w-auto'>
            <button className='border-2 border-black-500 rounded-lg text-base sm:w-[110px] font-bold flex items-center justify-center bg-white py-2 px-4'>
              Teams
            </button>
            <button className='bg-white border-2 border-black-500 rounded-lg text-base sm:w-[110px] font-bold flex items-center justify-center py-2 px-4'>
              All
            </button>
          </div>

            {/* <div className="flex items-center gap-2">
                <User className='size-6'/>
                <span className="font-medium hidden lg:block">Contacts</span>
            </div> */}
            {/* Todo:online filter */}
        </div>

        <div className='overflow-y-auto w-full py-3'>
        {users.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUsers?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.Username}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        </div>
    </aside>
  )
}

export default Sidebar