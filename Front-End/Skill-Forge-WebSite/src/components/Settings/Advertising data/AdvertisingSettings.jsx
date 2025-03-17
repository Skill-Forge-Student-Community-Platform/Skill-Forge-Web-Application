import React from 'react'
import SettingsSection from '../../components/SettingsSection'

export default function AdvertisingSettings() {
  const advertisingSection = {
    title: "Advertising preferences",
    items: [
      {
        title: "Ad preferences",
        path: "/settings/advertising/preferences",
        description: "Manage how your data is used for advertising"
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
