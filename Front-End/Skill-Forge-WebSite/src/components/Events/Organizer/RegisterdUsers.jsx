import React, { useEffect, useState } from "react";
import {FaTrashAlt} from "react-icons/fa";

const RegisteredUsers = ({ eventId }) => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRegisteredUsers = async () => {
      try {
        const response = await fetch(`http://localhost:3000/registered-users/${eventId}`);
  
        if (!response.ok) {
          throw new Error("Failed to fetch registered users");
        }
  
        const data = await response.json();
        setRegisteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRegisteredUsers(); // Fetch immediately
  
    // Auto-refresh every 5 seconds
   // const interval = setInterval(fetchRegisteredUsers, 5000);
  
    //return () => clearInterval(interval); // Cleanup on unmount
  }, [eventId]); 
  
  const deleteEvent = async (registrationId) => {
    alert(registrationId);
    if (!window.confirm("Are you sure you want to remove this user?")) return;
  
    try {
      const response = await fetch(`http://localhost:3000/remove-user/${registrationId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to remove user");
      }
  
      setRegisteredUsers((prevUsers) => prevUsers.filter((user) => user._id !== registrationId));
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };


  const updateUserPoints = async (userId, pointsToAdd) => {
    try {
      const response = await fetch(`http://localhost:3000/update-points/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ points: pointsToAdd }),
      });

      if (!response.ok) {
        throw new Error("Failed to update points");
      }

      // Update state immediately for better UI responsiveness
      setRegisteredUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, points: user.points + pointsToAdd } : user
        )
      );
    } catch (error) {
      console.error("Error updating points:", error);
    }
  };
  
  

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-3">Registered Users</h2>

{loading && <p className="text-gray-500 italic">Loading...</p>}
{error && <p className="text-red-600 bg-red-50 p-2 rounded border border-red-200">{error}</p>}

{registeredUsers.length > 0 ? (
  <div className="overflow-x-auto rounded-lg shadow">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {registeredUsers.map((user) => (
          <tr key={user._id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="font-medium text-gray-900">{user.userName}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-gray-500">{user.email}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="font-bold text-gray-900">{user.points} points</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right flex items-center space-x-2">
              {[10, 20, 50, 100].map((amount) => (
                <button
                  key={amount}
                  onClick={() => updateUserPoints(user._id, amount)}
                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  +{amount}
                </button>
              ))}
              <button 
                className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-50" 
                onClick={() => deleteEvent(user._id)}
              >
                <FaTrashAlt />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
) : (
  <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500 border border-gray-200">
    <p>No users registered for this event.</p>
  </div>
)}
    </div>
  );
};

export default RegisteredUsers;
