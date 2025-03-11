import React from 'react'
import SettingsSection from '../../components/SettingsSection'

// Advertising settings page

export default function AdvertisingSettings() {
  const advertisingSection = {
    title: "Advertising preferences",
    items: [
      {
        title: "Ad preferences",
        path: "/settings/advertising/preferences",
        description: "Control the ads you see"
      },
      {
        title: "Data preferences",
        path: "/settings/advertising/data",
        description: "Control how your data is used"
      }
    ]
  }

  return (
    <div className="settings-content">
      <SettingsSection {...advertisingSection} />
    </div>
  )
}
