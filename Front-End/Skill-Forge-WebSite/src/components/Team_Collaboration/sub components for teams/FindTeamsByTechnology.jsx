import React, { useState, useEffect } from "react";
import { useTeamStore } from "../../../store/useTeamStore.js";
import TeamMembers from "./TeamMembers.js";

const FindTeamsByTechnology = () => {
  const [technology, setTechnology] = useState("");
  const { teams, fetchTeamsByTechnology } = useTeamStore();
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [activeTab, setActiveTab] = useState("members");

  const handleSearch = () => {
    if (technology.trim()) {
      fetchTeamsByTechnology(technology);
    }
  };
  // Reset active tab when a new team is selected
  useEffect(() => {
    if (selectedTeam) {
      setActiveTab("members");
    }
  }, [selectedTeam]);

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? "bg-indigo-500 text-white"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      {icon}
      <span className="ml-2">{label}</span>
    </button>
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-3">Find Teams by Technology</h2>
      <input
        type="text"
        value={technology}
        onChange={(e) => setTechnology(e.target.value)}
        placeholder="Enter technology (e.g., React, Python)"
        className="border p-2 rounded w-full mb-3"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Search
      </button>
      <div className="mt-4">
        {teams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div
                key={team._id}
                onClick={() => setSelectedTeam(team)}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
              >
                <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {team.name}
                  </h2>
                  <div className="flex items-center mb-2 text-gray-600 dark:text-gray-300">
                    <span>{team.technology}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-300">
                    <span>
                      {team.members.length} member
                      {team.members.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No teams found.</p>
        )}
      </div>
      {/* Extended View (Modal with Tabs) */}
      {selectedTeam && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl max-w-3xl w-full relative max-h-[85vh] overflow-y-auto">
            <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-t-xl"></div>

            {/* Close Button */}
            <button
              className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={() => setSelectedTeam(null)}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>

            <div className="p-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                {selectedTeam.name}
              </h2>

              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 mt-4">
                <div className="flex items-center px-4 py-2 bg-indigo-50 dark:bg-gray-800 rounded-full text-indigo-700 dark:text-indigo-300">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span className="font-medium">{selectedTeam.technology}</span>
                </div>
                <div className="flex items-center px-4 py-2 bg-purple-50 dark:bg-gray-800 rounded-full text-purple-700 dark:text-purple-300">
                  <svg
                    className="w-5 h-5 mr-2"
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
                  <span className="font-medium">
                    {selectedTeam.members.length} member
                    {selectedTeam.members.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                <TabButton
                  id="members"
                  label="Team Members"
                  icon={
                    <svg
                      className="w-5 h-5"
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
                  }
                />
              </div>

              {/* Tab Content */}
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                {activeTab === "members" && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2 text-indigo-500"
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
                      Team Members
                    </h3>
                    <TeamMembers team={selectedTeam} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindTeamsByTechnology;
