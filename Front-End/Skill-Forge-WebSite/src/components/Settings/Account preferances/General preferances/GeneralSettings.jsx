import React from 'react'

export default function GeneralSettings() {
  return (
    <div className="settings-content w-full max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-6">General preferences</h2>
      
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200 p-4 flex justify-between items-center hover:bg-gray-50">
          <h3 className="font-medium">Language</h3>
          <span className="text-gray-600">English</span>
        </div>

        <div className="border-b border-gray-200 p-4 flex justify-between items-center hover:bg-gray-50">
          <h3 className="font-medium">Autoplay videos</h3>
          <span className="text-gray-600">On</span>
        </div>

        <div className="border-b border-gray-200 p-4 flex justify-between items-center hover:bg-gray-50">
          <h3 className="font-medium">Showing profile photos</h3>
          <span className="text-gray-600">All SkillForge Members</span>
        </div>

        <div className="p-4 flex justify-between items-center hover:bg-gray-50">
          <h3 className="font-medium">Feed preferences</h3>
          <span className="text-gray-600">On</span>
        </div>
      </div>
    </div>
  )
}
