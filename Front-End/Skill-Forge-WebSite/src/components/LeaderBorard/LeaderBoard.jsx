/*import React, { useEffect ,useState} from "react";
import { FaTrophy, FaMapMarkerAlt, FaCalendarAlt, FaUniversity, FaMedal } from "react-icons/fa";

const LeaderBoard = () => {
  const [registeredUsersL, setRegisteredUsersL] = useState([]);
  let intervalId;

   // Function to fetch leaderboard data
   const fetchLeaderboardData = async () => {
    try {
      const response = await fetch("http://localhost:3000/registered-users");
      if (!response.ok) {
        throw new Error("Failed to fetch registered users");
      }
      const data = await response.json();
      setRegisteredUsersL(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      //setError(error.message);
    }

    // Auto-refresh every 5 seconds
    intervalId = setInterval(fetchLeaderboardData, 5000);

    return () => clearInterval(intervalId); // Cleanup on unmount
  };

  // Call function inside useEffect
  useEffect(() => {
    fetchLeaderboardData();
  }, []);

  const dataleader = [
    { name: "Shawn Hanna", location: "India", score: 1250, image: "-", date: "2022-02-10", university: "IIT" },
    { name: "Emily Carter", location: "USA", score: 1700, image: "-", date: "2022-05-15", university: "IIT" },
    { name: "Liam Johnson", location: "UK", score: 1325, image: "-", date: "2023-01-08", university: "IIT" },
    { name: "Sophia Lee", location: "Canada", score: 1500, image: "-", date: "2023-07-21", university: "IIT" },
    { name: "Sophia Lee", location: "Canada", score: 1500, image: "-", date: "2023-07-21", university: "IIT" },
  ];

 // const sortedData = [...dataleader].sort((a, b) => b.score - a.score);
  const sortedData1 = [...registeredUsersL].sort((a, b) => b.totalPoints - a.totalPoints);
  

  return (
    <div className="max-w-3xl mx-auto my-8 p-6 bg-white rounded-lg shadow-lg">
      {/* Leaderboard Header 
      <div className="flex items-center justify-center gap-3 mb-6">
        <FaTrophy className="text-yellow-500 text-3xl" />
        <h1 className="text-2xl font-bold text-gray-800">LeaderBoard</h1>
      </div>

      {/* Filter Buttons *
      <div className="flex justify-center gap-4 mb-6">
        <button className="px-4 py-2 flex items-center gap-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          <FaUniversity /> University
        </button>
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">All-Time</button>
      </div>

      {/* Players List *
      <div className="flex flex-col gap-5">
        {sortedData1.map((player, index) => (
          <div key={player._id} className="relative flex items-center p-4 bg-gray-100 rounded-lg shadow hover:translate-x-1 transition">
            {/* Rank Badge *
            <div className={`absolute top-[-10px] left-[-10px] w-10 h-10 flex items-center justify-center rounded-full text-white font-bold 
              ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-700" : "bg-blue-500"}`}>
              <FaMedal className="text-lg" /> {index + 1}
            </div>

            {/* Player Image *
            <div className="w-16 h-16 mr-4 flex items-center justify-center rounded-full bg-blue-500 text-white text-2xl font-bold">
              {player.image === "-" ? player.userName.charAt(0) : <img src={player.image} alt={player.name} className="w-full h-full rounded-full object-cover" />}
            </div>

            {/* Player Info *
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{player.userName}</h3>
              <div className="text-gray-600 text-sm flex gap-4 mt-2">
                <span className="flex items-center gap-2"><FaMapMarkerAlt /> {player.location}</span>
                <span className="flex items-center gap-2"><FaTrophy /> {player.totalPoints} pts</span>
              </div>
              <div className="text-gray-600 text-sm flex gap-4 mt-1">
                <span className="flex items-center gap-2"><FaCalendarAlt /> {player.date}</span>
                <span className="flex items-center gap-2"><FaUniversity /> {player.university}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderBoard;

*/