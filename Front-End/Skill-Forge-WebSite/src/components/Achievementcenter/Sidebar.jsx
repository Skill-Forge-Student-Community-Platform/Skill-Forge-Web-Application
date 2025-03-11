import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
      <ul>
        <li className="sidebar-item">
          <Link to="/dashboard" className="sidebar-link">Dashboard</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/statistics" className="sidebar-link">Statistics</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/inbox" className="sidebar-link">Inbox</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/teams" className="sidebar-link">Teams</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/leaderboard" className="sidebar-link">Leaderboard</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/achievements" className="sidebar-link">Achievements</Link>
        </li>
        <li className="sidebar-item">
          <Link to="/settings" className="sidebar-link">Settings</Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
