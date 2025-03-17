import React from 'react'
import SettingsSection from '../../components/SettingsSection'

export default function CommunicationSettings() {
  const communicationSection = {
    title: "Communications",
    items: [
      {
        title: "Email notifications",
        path: "/settings/communications/email",
        description: "Choose when and how you want to be notified"
      },
      {
        title: "Push notifications",
        path: "/settings/communications/push",
        description: "Manage your mobile and desktop notifications"
      }
    ]
  }

  return (
    <div className="settings-content">
      <SettingsSection {...communicationSection} />
    </div>
  )
}
