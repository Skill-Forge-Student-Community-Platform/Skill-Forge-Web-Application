import React from 'react'
import { Routes, Route } from 'react-router-dom'
import SettingsLayout from '../components/SettingsLayout'
import SettingsSidebar from '../components/SettingsSidebar'
import AccountSettings from '../SettingsPages/Account preferances/AccountSettings'
import SecuritySettings from '../SettingsPages/Sign in and security/SecuritySettings'
import VisibilitySettings from '../SettingsPages/Visibility/VisibilitySettings'
import CommunicationSettings from '../SettingsPages/communications/CommunicationSettings'
import PrivacySettings from '../SettingsPages/Data privacy/PrivacySettings'
import AdvertisingSettings from '../SettingsPages/Advertising data/AdvertisingSettings'
import GeneralSettings from '../SettingsPages/Account preferances/General preferances/GeneralSettings'
import ProfileInfo from '../SettingsPages/Account preferances/Name, location and industry/ProfileInfo'
import Demographics from '../SettingsPages/Account preferances/Personal demographic information/Demographics'
import EditProfileInfo from '../SettingsPages/Account preferances/Profile information/EditProfileInfo'
import EditName from '../SettingsPages/Account preferances/Name, location and industry/Edits/EditName'
import EditLocation from '../SettingsPages/Account preferances/Name, location and industry/Edits/EditLocation'
import EditIndustry from '../SettingsPages/Account preferances/Name, location and industry/Edits/EditIndustry'
import EditGender from '../SettingsPages/Account preferances/Personal demographic information/Edits/EditGender'
import EditPronouns from '../SettingsPages/Account preferances/Personal demographic information/Edits/EditPronouns'
import EditAge from '../SettingsPages/Account preferances/Personal demographic information/Edits/EditAge'
import EditLanguage from '../SettingsPages/Account preferances/General preferances/Edits/EditLanguage'
import EditAutoplay from '../SettingsPages/Account preferances/General preferances/Edits/EditAutoplay'
import EditPassword from '../SettingsPages/Sign in and security/Edits/EditPassword'
import Edit2FA from '../SettingsPages/Sign in and security/Edits/Edit2FA'
import SessionHistory from '../SettingsPages/Sign in and security/Edits/SessionHistory'
import EditEmail from '../SettingsPages/communications/Email notification/EditEmail'
import EditPush from '../SettingsPages/communications/Push notification/EditPush'
import AppearanceSettings from '../SettingsPages/Appearance/AppearanceSettings'

export default function Settings() {
  return (
    <div className="app-container">
      <SettingsSidebar />
      <div className="main-content">
        <SettingsLayout>
          <Routes>
            <Route path="/" element={<AccountSettings />} />
            <Route path="/settings/account" element={<AccountSettings />} />
            <Route path="/settings/account/profile-info" element={<ProfileInfo />} />
            <Route path="/settings/account/profile-info/edit-name" element={<EditName />} />
            <Route path="/settings/account/profile-info/edit-location" element={<EditLocation />} />
            <Route path="/settings/account/profile-info/edit-industry" element={<EditIndustry />} />
            <Route path="/settings/account/demographics" element={<Demographics />} />
            <Route path="/settings/account/demographics/edit-gender" element={<EditGender />} />
            <Route path="/settings/account/demographics/edit-pronouns" element={<EditPronouns />} />
            <Route path="/settings/account/demographics/edit-age" element={<EditAge />} />
            <Route path="/settings/account/language" element={<EditLanguage />} />
            <Route path="/settings/account/autoplay" element={<EditAutoplay />} />
            <Route path="/settings/security" element={<SecuritySettings />} />
            <Route path="/settings/security/password" element={<EditPassword />} />
            <Route path="/settings/security/2fa" element={<Edit2FA />} />
            <Route path="/settings/security/history" element={<SessionHistory />} />
            <Route path="/settings/visibility" element={<VisibilitySettings />} />
            <Route path="/settings/communications" element={<CommunicationSettings />} />
            <Route path="/settings/communications/email" element={<EditEmail />} />
            <Route path="/settings/communications/push" element={<EditPush />} />
            <Route path="/settings/privacy" element={<PrivacySettings />} />
            <Route path="/settings/advertising" element={<AdvertisingSettings />} />
            <Route path="/settings/appearance" element={<AppearanceSettings />} />
            <Route path="/settings/general" element={<GeneralSettings />} />
          </Routes>
        </SettingsLayout>
      </div>
    </div>
  )
}