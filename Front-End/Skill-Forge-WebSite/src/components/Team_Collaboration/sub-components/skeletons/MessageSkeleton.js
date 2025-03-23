import React from 'react'

function MessageSkeleton() {
    // Create an array of 6 items for skeleton messages
  const skeletonMessages = Array(6).fill(null);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gray-900">
      {skeletonMessages.map((_, idx) => (
        <div 
          key={idx} 
          className={`flex ${idx % 2 === 0 ? "justify-start" : "justify-end"}`}
        >
          <div className={`flex max-w-md ${idx % 2 === 0 ? "flex-row" : "flex-row-reverse"} items-end gap-2`}>
            <div className="flex-shrink-0">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <div className="skeleton w-full h-full rounded-full bg-gray-800" />
              </div>
            </div>
            
            <div className={`flex flex-col ${idx % 2 === 0 ? "items-start" : "items-end"}`}>
              <div className={`px-4 py-2 rounded-2xl ${
                idx % 2 === 0 
                  ? "rounded-bl-none" 
                  : "rounded-br-none"
              }`}>
                <div className="skeleton h-16 w-48 bg-gray-800" />
              </div>
              <div className="mt-1">
                <div className="skeleton h-3 w-16 bg-gray-800" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default MessageSkeleton