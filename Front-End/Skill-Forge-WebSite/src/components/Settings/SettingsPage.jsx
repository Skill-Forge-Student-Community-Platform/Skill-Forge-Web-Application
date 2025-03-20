import React from 'react';
import SettingsRoutes from './settingsRoutes';
import './SettingsPage.css'; // You'll need to create this CSS file

const SettingsPage = () => {
  return (
    <div className="settings-page-container">
      <div className="settings-content">
        <SettingsRoutes />
      </div>
    </div>
  );
};

export default SettingsPage;
