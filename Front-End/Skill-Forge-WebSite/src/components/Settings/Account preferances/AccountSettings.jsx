import React from 'react'
import SettingsSection from '/src/components/SettingsSection'
import { useSettings } from '/src/contexts/SettingsContext'

// Account settings page

export default function AccountSettings() {
  const { settings, loading } = useSettings();

  const profileSection = {
    title: "Profile information",
    items: [
      {
        title: "Name, location, and industry",
        path: "/settings/account/profile-info"
      },
      {
        title: "Personal demographic information",
        path: "/settings/account/demographics"
      }
    ]
  }

  const displaySection = {
    title: "Display",
    items: [
      {
        title: "Dark mode",
        path: "/settings/account/dark-mode",
        value: "Off"
      }
    ]
  }

  const preferencesSection = {
    title: "General preferences",
    items: [
      {
        title: "Language",
        path: "/settings/account/language",
        value: settings?.accountPreferences?.language || 'English'
      },
      {
        title: "Autoplay videos",
        path: "/settings/account/autoplay",
        value: settings?.accountPreferences?.autoplay ? 'On' : 'Off'
      },
      {
        title: "Showing profile photos",
        path: "/settings/account/profile-photos",
        value: "All SkillForge Members"
      },
      {
        title: "Feed preferences",
        path: "/settings/account/feed-preferences",
        value: "On"
      }
    ]
  }

  return (
    <div className="settings-content">
      <SettingsSection {...profileSection} />
      <SettingsSection {...displaySection} />
      <SettingsSection {...preferencesSection} />
    </div>
  )
}
