import React from 'react'
import { useNavigate } from 'react-router-dom'
import SettingsSection from '../../../components/SettingsSection'

export default function ProfileInfo() {
  const navigate = useNavigate()

  // Profile details section
  
  const profileDetailsSection = {
    title: "Profile details",
    items: [
      
      {
        title: "Name",
        value: "John Doe",
        path: "/settings/account/profile-info/edit-name"
      },
      {
        title: "Location",
        value: "New York, United States",
        path: "/settings/account/profile-info/edit-location"
      },
      {
        title: "Industry",
        value: "Computer Software",
        path: "/settings/account/profile-info/edit-industry"
      }
    ]
  }

  return (
    <div className="settings-content">
      <SettingsSection {...profileDetailsSection} />
    </div>
  )
}
