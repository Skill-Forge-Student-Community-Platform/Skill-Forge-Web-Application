import React from 'react'
import SettingsSection from '../../components/SettingsSection'

export default function NotificationSettings() {
  const notificationItems = [
    {
      label: 'Email Notifications',
      onClick: () => console.log('Navigate to email notifications'),
    },
    {
      label: 'Push Notifications',
      onClick: () => console.log('Navigate to push notifications'),
    },
    {
      label: 'Alert Preferences',
      onClick: () => console.log('Navigate to alert preferences'),
    },
  ]

  return (
    <SettingsSection 
      title="Notification Preferences" 
      items={notificationItems} 
    />
  )
}
