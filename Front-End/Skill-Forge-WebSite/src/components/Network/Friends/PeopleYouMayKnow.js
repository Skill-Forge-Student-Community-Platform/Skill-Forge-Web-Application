import React, { useState } from "react";
import "./PeopleYouMayKnow.css";

const PeopleYouMayKnow = () => {
  const people = [
    { id: 1, name: "Rida Kumala", role: "UI Designer", location: "Semarang", avatar: "https://i.pravatar.cc/80?img=10" },
    { id: 2, name: "Caren William", role: "UI Designer", location: "Semarang", avatar: "https://i.pravatar.cc/80?img=20" },
    { id: 3, name: "Emma Wilson", role: "Product Manager", location: "Jakarta", avatar: "https://i.pravatar.cc/80?img=30" },
    { id: 4, name: "John Doe", role: "Software Engineer", location: "Bali", avatar: "https://i.pravatar.cc/80?img=40" },
    { id: 1, name: "Rida Kumala", role: "UI Designer", location: "Semarang", avatar: "https://i.pravatar.cc/80?img=10" },
    { id: 2, name: "Caren William", role: "UI Designer", location: "Semarang", avatar: "https://i.pravatar.cc/80?img=20" },
    { id: 3, name: "Emma Wilson", role: "Product Manager", location: "Jakarta", avatar: "https://i.pravatar.cc/80?img=30" },
    { id: 4, name: "John Doe", role: "Software Engineer", location: "Bali", avatar: "https://i.pravatar.cc/80?img=40" },
  ];

  const [friendRequests, setFriendRequests] = useState([]);

  // Function to handle friend request
  const handleFriendRequest = (id) => {
    if (friendRequests.includes(id)) {
      setFriendRequests(friendRequests.filter((requestId) => requestId !== id)); // Cancel Request
    } else {
      setFriendRequests([...friendRequests, id]); // Add Friend
    }
  };

  return (
    <div className="people-container">
      <h3 className="people-title">People you may know</h3>
      <div className="people-you-may-know">
        {people.map((person) => (
          <div key={person.id} className="person-card">
            <img src={person.avatar} alt={person.name} className="person-avatar" />
            <div className="person-info">
              <p className="person-name">{person.name}</p>
              <p className="person-role">{person.role}</p>
              <p className="person-location">{person.location}</p>
              <button 
                className={friendRequests.includes(person.id) ? "cancel-btn" : "add-btn"} 
                onClick={() => handleFriendRequest(person.id)}
              >
                {friendRequests.includes(person.id) ? "Cancel Request" : "Add Friend"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleYouMayKnow;
