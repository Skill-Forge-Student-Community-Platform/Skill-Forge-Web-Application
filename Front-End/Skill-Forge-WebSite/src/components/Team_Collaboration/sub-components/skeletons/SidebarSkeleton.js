import { Users } from 'lucide-react';
import React from 'react'

function SidebarSkeleton() {
  // Create 8 skeleton items
  const skeletonContacts = Array(8).fill(null);
  
  return (
    <aside
      className="h-full w-20 lg:w-72 border-r border-gray-800 
      bg-gray-900 flex flex-col transition-all duration-200"
    >
      {/* Header */}
      <div className="border-b border-gray-800 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="w-6 h-6 text-gray-400" />
          <span className="font-medium hidden lg:block text-gray-300">Contacts</span>
        </div>
      </div>

      {/* Skeleton Contacts */}
      <div className="overflow-y-auto w-full py-3">
        {skeletonContacts.map((_, idx) => (
          <div 
            key={idx} 
            className="w-full p-3 flex items-center gap-3 border-b border-gray-800/50 last:border-b-0"
          >
            {/* Avatar skeleton */}
            <div className="relative mx-auto lg:mx-0">
              <div className="skeleton w-12 h-12 rounded-full bg-gray-800" />
            </div>

            {/* User info skeleton - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0 flex-1">
              <div className="skeleton h-4 w-32 mb-2 bg-gray-800" />
              <div className="skeleton h-3 w-16 bg-gray-800" />
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default SidebarSkeleton