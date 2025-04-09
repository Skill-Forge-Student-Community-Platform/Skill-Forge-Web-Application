import React, { useEffect, useState } from "react";
import { useTeamStore } from "../../../store/useTeamStore.js";

const ReceivedInvites = () => {
    const { receivedInvites, fetchReceivedInvites, respondToInvite } = useTeamStore();
    const [pendingResponses, setPendingResponses] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInvites = async () => {
            setIsLoading(true);
            try {
                await fetchReceivedInvites();
            } catch (error) {
                console.error("Failed to fetch invites:", error);
            } finally {
                setIsLoading(false);
            }
        };
        
        loadInvites();
    }, [fetchReceivedInvites]);

    const handleResponse = async (teamId, response) => {
        setPendingResponses(prev => ({ ...prev, [teamId]: response }));
        try {
            await respondToInvite(teamId, response);
        } catch (error) {
            console.error(`Failed to ${response} invite:`, error);
        } finally {
            setPendingResponses(prev => {
                const updated = { ...prev };
                delete updated[teamId];
                return updated;
            });
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-2xl rounded-2xl border border-gray-100 dark:border-gray-700">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-center mb-8">
                <span className="inline-flex items-center justify-center">
                    <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8.5 12.5L10.5 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Team Invitations
                </span>
            </h2>

            <div className="mt-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                        Pending Invitations
                    </h3>
                    <div className="h-1 flex-grow mx-4 rounded-full bg-gradient-to-r from-blue-300 to-indigo-300 dark:from-blue-600 dark:to-indigo-600 opacity-30"></div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Loading invitations...</p>
                    </div>
                ) : receivedInvites.length > 0 ? (
                    <ul className="mt-6 space-y-5">
                        {receivedInvites.map((team) => (
                            <li
                                key={team._id}
                                className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
                                    <div className="space-y-2">
                                        <div className="font-bold text-gray-900 dark:text-white text-xl flex items-center">
                                            {team.name}
                                            {team.technology && (
                                                <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                                                    {team.technology}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                            <span>Invited by</span> 
                                            <span className="font-semibold text-gray-800 dark:text-gray-100 ml-1">
                                                {team.creator.Username}, {team.name}
                                            </span>
                                            <span>'s Leader</span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-4">
                                        <button
                                            onClick={() => handleResponse(team._id, "accept")}
                                            disabled={pendingResponses[team._id]}
                                            className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 shadow-md hover:shadow-lg active:shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed font-medium text-sm"
                                        >
                                            {pendingResponses[team._id] === "accept" ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Accepting...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                    Accept
                                                </span>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => handleResponse(team._id, "reject")}
                                            disabled={pendingResponses[team._id]}
                                            className="px-5 py-2.5 bg-white dark:bg-gray-700 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-gray-600 shadow-md hover:shadow-lg active:shadow-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed font-medium text-sm"
                                        >
                                            {pendingResponses[team._id] === "reject" ? (
                                                <span className="flex items-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Rejecting...
                                                </span>
                                            ) : (
                                                <span className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                    Decline
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-inner">
                        <svg className="w-20 h-20 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                        </svg>
                        <p className="text-gray-800 dark:text-gray-200 font-medium text-lg mb-2">
                            No pending invitations
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
                            When someone invites you to join their team, you'll see their invitation here
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReceivedInvites;