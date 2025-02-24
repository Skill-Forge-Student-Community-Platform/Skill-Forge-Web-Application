import React from "react";
import "./Friend.css";
import Notification from "../components/Notification";
import AllFriends from "../components/AllFriends";
import PeopleYouMayKnow from "../components/PeopleYouMayKnow";
import SearchBar from "../components/searchbar";

const Home = () => {
  return (
    <div className="homepage-container">
      {/* Search Bar */}
      <SearchBar/>

      {/* Notification Bell */}
      <div className="notification-wrapper">
        <Notification />
      </div>

      {/* Main Friends Section */}
      <div className="main-content">
      <PeopleYouMayKnow />
        <AllFriends />
      </div>
    </div>
  );
};

export default Home;
