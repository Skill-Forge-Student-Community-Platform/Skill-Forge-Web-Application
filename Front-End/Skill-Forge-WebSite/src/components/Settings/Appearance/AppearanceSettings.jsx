import React from 'react';

const AppearanceSettings = () => {
  return (
    <div className="settings-page">
      <h1>Appearance Settings</h1>
      <div className="settings-section">
        <h2>Visual Preferences</h2>
        <p>Customize how LinkedIn appears to you.</p>
        
        <div className="setting-option">
          <h3>Theme</h3>
          <p>Choose between light, dark, or system theme</p>
          <select defaultValue="system">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System default</option>
          </select>
        </div>
        
        <div className="setting-option">
          <h3>Display Density</h3>
          <p>Choose how compact you want the interface to be</p>
          <select defaultValue="default">
            <option value="comfortable">Comfortable</option>
            <option value="default">Default</option>
            <option value="compact">Compact</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default AppearanceSettings;
