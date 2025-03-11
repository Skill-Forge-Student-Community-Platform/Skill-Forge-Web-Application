import React from 'react'
import SettingsSection from '../../../components/SettingsSection'

export default function Demographics() {
  const demographicsSection = {
    title: "Personal demographic information",
    items: [
      {
        title: "Gender",
        value: "Not specified",
        path: "/settings/account/demographics/edit-gender"
      },
      {
        title: "Pronouns",
        value: "Not specified",
        path: "/settings/account/demographics/edit-pronouns"
      },
      {
        title: "Age",
        value: "Not specified",
        path: "/settings/account/demographics/edit-age"
      }
    ]
  }

  return (
    <div className="settings-content">
      <SettingsSection {...demographicsSection} />
    </div>
  )
}