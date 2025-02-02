import React, { useState } from "react";
import { FaMoon } from "react-icons/fa";
import { IoSunnyOutline } from "react-icons/io5";
import { HiOutlineBell } from "react-icons/hi2";
import Profile_pic from "../../Assets/test-profile-pic.jpg";
import "./NavBar.css";

const Navbar = ({ isDarkMode, toggleTheme }) => {
  const [userName, setUserName] = useState("lakshan");

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <ul className="nav-links">
          <li>Home</li>
          <li>Competitions</li>
          <li>Team</li>
        </ul>
      </div>

      <div className="navbar-right">
          <div
            className={`toggle-icon ${isDarkMode ? "dark" : ""}`}
            onClick={toggleTheme}
          >
            <div className="icon-light">
              <IoSunnyOutline />
            </div>
            <div className="icon-dark">
              <FaMoon />
            </div>
            <div className="toggle-circle"></div>
          </div>

          <div className="notification-icon">
            <HiOutlineBell />
          </div>

          <div className="profile">
            <p className="profile-name"> hey {userName}</p>

            <img className="profile-image" src={Profile_pic} alt="User profile image"/>
          </div>
      </div>
    </nav>
  );
};

export default Navbar;
