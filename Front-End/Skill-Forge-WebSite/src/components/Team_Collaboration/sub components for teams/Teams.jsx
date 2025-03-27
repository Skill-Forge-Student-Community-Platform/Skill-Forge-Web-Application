import React from 'react'
import MyTeams from './MyTeams.js';

export const Teams = () => {
  return (
    <div>
        {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16 px-4 shadow-lg">
                <div className="max-w-5xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        🔥 Team Collaboration
                    </h1>
                    <p className="text-indigo-100 text-lg md:text-xl max-w-2xl mx-auto">
                        Create and manage your teams, collaborate with other developers, and build amazing projects together.
                    </p>
                </div>
            </div>
            
            {/* Content Container */}
            <div className="max-w-5xl mx-auto px-4 -mt-8">
                {/* Create Team Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700 mb-12">
                    <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                </div>
                
                {/* Teams List */}
                <div>
                    <MyTeams />
                </div>
            </div>
    </div>
  )
}
