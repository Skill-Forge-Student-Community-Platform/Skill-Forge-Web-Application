import React from 'react'
import SettingsSection from '../../components/SettingsSection'

export default function VisibilitySettings() {
  const visibilitySection = {
    title: "Visibility settings",
    items: [
      {
        title: "Profile viewing options",
        path: "/settings/visibility/profile-viewing",
        description: "Choose how others see your profile"
      },
      {
        title: "Post  viewing options",
        path: "/settings/visibility/story-viewing",
        description: "Manage who can see your Posts"
      }
    ]
  }

  return (
    <div className="settings-content">
      <SettingsSection {...visibilitySection} />
    </div>
  )
}