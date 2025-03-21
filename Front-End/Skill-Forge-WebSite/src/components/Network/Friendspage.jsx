import React, { useState } from "react";

import PeopleYouMayKnow from "../Network/Friends/PeopleYouMayKnow";
import AllFriends from "../Network/Friends/AllFriends";


const Friendspage = () => {
  const [confirmedFriends, setConfirmedFriends] = useState([]);
  const [removedRequests, setRemovedRequests] = useState([]);

  const addToFriends = (user) => {
    setConfirmedFriends([...confirmedFriends, user.id]);
  };

  const removeFromRequests = (id) => {
    setRemovedRequests([...removedRequests, id]);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 p-5">
      <div className="w-full flex justify-center mb-5">
     
      </div>

      <div className="w-full max-w-6xl flex flex-col gap-5 items-center mt-5">
        <PeopleYouMayKnow />
        <AllFriends />
        
      </div>
    </div>
  );
};

export default Friendspage;