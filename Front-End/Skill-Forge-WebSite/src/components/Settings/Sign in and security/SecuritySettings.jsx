import React from 'react'
import SettingsSection from '../../components/SettingsSection'

export default function SecuritySettings() {
  const securitySection = {
    title: "Sign in & security",
    items: [
      {
        title: "Password",
        path: "/settings/security/password",
        description: "Change or recover your password"
      },
      {
        title: "Two-step verification",
        path: "/settings/security/2fa",
        description: "Add an extra layer of security to your account"
      },
      {
        title: "Sign in history",
        path: "/settings/security/history",
        description: "See your recent sign in activity"
      }
    ]
  }

  return (
    <div className="settings-content">
      <SettingsSection {...securitySection} />
    </div>
  )
}
