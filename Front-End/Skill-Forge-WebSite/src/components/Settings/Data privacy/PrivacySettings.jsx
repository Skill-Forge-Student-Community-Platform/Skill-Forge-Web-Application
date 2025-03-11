import React from 'react'
import SettingsSection from '../../components/SettingsSection'

export default function PrivacySettings() {
  const dataSection = {
    title: "Data privacy",
    items: [
      {
        title: "Data visibility",
        description: "Choose who can see your activity",
        path: "/settings/privacy/data-visibility"
      },
      {
        title: "Search history",
        description: "Manage your search history",
        path: "/settings/privacy/search-history"
      },
      {
        title: "Download your data",
        description: "Get a copy of your LinkedIn data",
        path: "/settings/privacy/download-data"
      }
    ]
  }

  return (
    <div className="settings-content">
      <SettingsSection {...dataSection} />
    </div>
  )
}
