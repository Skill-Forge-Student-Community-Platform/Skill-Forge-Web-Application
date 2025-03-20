import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Sidebar from './Sidebar';

const SettingsLayout = ({ children, title }) => {
  return (
    <div className="settings-page">
      <header className="settings-header">
        <div className="settings-header-content">
          <Link to="/" className="back-button">
            <FaArrowLeft />
          </Link>
          <h1 className="settings-title">Settings</h1>
        </div>
      </header>
      
      <div className="settings-container">
        <Sidebar />
        <main className="settings-content">
          <div className="settings-content-header">
            <h2 className="settings-content-title">{title}</h2>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default SettingsLayout; 