import React, { useEffect, useState } from "react";
import { useTeamStore } from "../store/useTeamStore.js";
import UserSearch from "./UserSearch.js";
import ReceivedInvites from "./ReceivedInvites.js";
import SentInvites from "./SentInvites.js";
import TeamMembers from "./TeamMembers.js";

const MyTeams = () => {
    const { teams, getTeamsByUser, loading, error } = useTeamStore();
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [activeTab, setActiveTab] = useState("members");

    useEffect(() => {
        getTeamsByUser();
    }, [getTeamsByUser]);

    // Reset active tab when a new team is selected
    useEffect(() => {
        if (selectedTeam) {
            setActiveTab("members");
        }
    }, [selectedTeam]);

    // Manage background scroll behavior when modal opens/closes
    useEffect(() => {
        if (selectedTeam) {
            document.body.style.overflow = "hidden"; // Prevent background scrolling
        } else {
            document.body.style.overflow = "auto"; // Restore scrolling when modal closes
        }
        return () => {
            document.body.style.overflow = "auto"; // Cleanup in case component unmounts
        };
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
        <div className="max-w-5xl mx-auto p-8 relative">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-8 shadow-lg">
                <h1 className="text-4xl font-bold text-white text-center">
                    🏆 My Teams
                </h1>
                <p className="text-center text-indigo-100 mt-2">Manage and collaborate with your teams</p>
            </div>

            {loading && (
                <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                </div>
            )}
            
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {!loading && teams.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-md border border-gray-100 dark:border-gray-700">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-4">
                        No teams found. Create a team to get started.
                    </p>
                </div>
            ) : (
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
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    <span>{team.technology}</span>
                                </div>
                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                    </svg>
                                    <span>{team.members.length} member{team.members.length !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* The Invitations the user will receive */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                    <svg className="w-6 h-6 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Invitations
                </h2>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-100 dark:border-gray-700">
                    <ReceivedInvites />
                </div>
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
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                        
                        <div className="p-6">
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                                {selectedTeam.name}
                            </h2>
                            
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 mt-4">
                                <div className="flex items-center px-4 py-2 bg-indigo-50 dark:bg-gray-800 rounded-full text-indigo-700 dark:text-indigo-300">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                    </svg>
                                    <span className="font-medium">{selectedTeam.technology}</span>
                                </div>
                                <div className="flex items-center px-4 py-2 bg-purple-50 dark:bg-gray-800 rounded-full text-purple-700 dark:text-purple-300">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                    </svg>
                                    <span className="font-medium">{selectedTeam.members.length} member{selectedTeam.members.length !== 1 ? 's' : ''}</span>
                                </div>
                            </div>
                            
                            {/* Tabs Navigation */}
                            <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 pb-3 mb-6">
                                <TabButton 
                                    id="members" 
                                    label="Team Members" 
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                        </svg>
                                    } 
                                />
                                <TabButton 
                                    id="invite" 
                                    label="Invite Members" 
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                        </svg>
                                    } 
                                />
                                <TabButton 
                                    id="pending" 
                                    label="Pending Invites" 
                                    icon={
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                    } 
                                />
                            </div>
                            
                            {/* Tab Content */}
                            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
                                {activeTab === "members" && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                                            </svg>
                                            Team Members
                                        </h3>
                                        <TeamMembers team={selectedTeam} />
                                    </div>
                                )}
                                
                                {activeTab === "invite" && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
                                            </svg>
                                            Invite New Members
                                        </h3>
                                        <UserSearch teamId={selectedTeam._id} />
                                    </div>
                                )}
                                
                                {activeTab === "pending" && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                            <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                            </svg>
                                            Pending Invitations
                                        </h3>
                                        <SentInvites teamId={selectedTeam._id} />
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

export default MyTeams;