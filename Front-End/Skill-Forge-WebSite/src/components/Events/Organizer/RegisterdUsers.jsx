import React, { useEffect, useState } from "react";
import {FaTrashAlt} from "react-icons/fa";

const RegisteredUsers = ({ eventId }) => {
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // In RegisteredUsers.jsx
useEffect(() => {
  const fetchRegisteredUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/registered-users/${eventId}`);
      
      // If the response isn't ok but it's a 404 (not found), treat it as empty array
      if (!response.ok) {
        if (response.status === 404) {
          setRegisteredUsers([]);
          return;
        }
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      // Ensure we have an array even if API returns null or undefined
      setRegisteredUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Don't show error message for empty results
      if (error.message !== "Error: 404") {
        setError(error.message);
      }
      // Set empty array on error
      setRegisteredUsers([]);
    } finally {
      setLoading(false);
    }
  };

  fetchRegisteredUsers();
}, [eventId]);

  const deleteEvent = async (registrationId) => {
    alert(registrationId);
    if (!window.confirm("Are you sure you want to remove this user?")) return;
  
    try {
      const response = await fetch(`http://localhost:5000/api/remove-user/${registrationId}`, {
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


 /* const updateUserPoints = async (userId, pointsToAdd) => {
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
  */
  
  

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
                  <td className="px-6 py-4 whitespace-nowrap text-right">
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
