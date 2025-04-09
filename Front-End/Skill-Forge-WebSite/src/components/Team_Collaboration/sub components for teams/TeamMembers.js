import React, { useState } from "react";
import { useTeamStore } from "../../../store/useTeamStore.js";
import { useAuthStore } from "../../../store/authStore.js";
import { UserMinus, Crown, LogOut, AlertTriangle } from "lucide-react";

const TeamMembers = ({ team }) => {
  const { user } = useAuthStore();
  const { kickMemberFromTeam } = useTeamStore();

  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const isCreator = user && team.creator === user._id;

  const handleLeaveClick = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const confirmLeave = () => {
    if (selectedMember) {
      kickMemberFromTeam(team._id, selectedMember._id);
      setShowModal(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl p-8 mt-6 border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-6 flex items-center">
        <svg
          className="w-7 h-7 mr-3"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="9"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21v-2a4 4 0 0 0-3-3.87"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13a4 4 0 0 1 0 7.75"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Team Members ({team.members.length})
      </h2>

      {team.members.length > 0 ? (
        <ul className="space-y-5">
          {team.members.map((member) => {
            const isTeamCreator = member._id === team.creator;
            const isCurrentUser = member._id === user._id;

            return (
              <li
                key={member._id}
                className={`flex items-center justify-between p-5 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                  isTeamCreator
                    ? "bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/10 border border-amber-200 dark:border-amber-800/30"
                    : isCurrentUser
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/10 border border-blue-200 dark:border-blue-800/30"
                    : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={member.Profile || "/default-avatar.png"}
                      alt={member.Username}
                      className={`w-14 h-14 object-cover rounded-full shadow-md ${
                        isTeamCreator
                          ? "border-2 border-amber-400 dark:border-amber-500"
                          : "border-2 border-gray-200 dark:border-gray-600"
                      }`}
                    />
                    {isCurrentUser && (
                      <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-white dark:border-gray-800">
                        <span>You</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-gray-900 dark:text-white text-lg font-semibold flex items-center">
                      {member.Username}
                      {isTeamCreator && (
                        <span className="ml-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center shadow-sm">
                          <Crown size={14} className="mr-1" /> Team Creator
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {member.email || "No email available"}
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  {/* Kick button (only for team creator) */}
                  {isCreator && member._id !== user._id && !isTeamCreator && (
                    <button
                      className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      onClick={() => kickMemberFromTeam(team._id, member._id)}
                    >
                      <UserMinus size={16} />
                      <span>Remove</span>
                    </button>
                  )}

                  {/* Leave team button (for normal members) */}
                  {member._id === user._id && !isTeamCreator && (
                    <button
                      className="flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-md focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                      onClick={() => handleLeaveClick(member)}
                    >
                      <LogOut size={16} />
                      <span>Leave Team</span>
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <svg
            className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          <p className="text-gray-700 dark:text-gray-300 font-medium text-lg mb-1">
            No team members yet
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Invite people to join your team
          </p>
        </div>
      )}

      {/* Leave Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-100 dark:border-gray-700 animate-fadeIn">
            <div className="flex items-center mb-6">
              <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-full mr-4">
                <AlertTriangle
                  size={24}
                  className="text-amber-600 dark:text-amber-500"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Leave Team
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-600 mb-6">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to leave{" "}
                <span className="font-semibold">{team.name}</span>? You will
                need a new invitation to rejoin this team.
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg shadow-md hover:shadow-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                onClick={confirmLeave}
              >
                Yes, Leave Team
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
