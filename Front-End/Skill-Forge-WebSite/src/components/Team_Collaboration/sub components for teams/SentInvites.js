import React, { useEffect, useState } from "react";
import { useTeamStore } from "../store/useTeamStore.js";

const SentInvites = ({ teamId }) => {
    const { sentInvites, fetchSentInvites } = useTeamStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadInvites = async () => {
            setIsLoading(true);
            try {
                await fetchSentInvites();
            } catch (error) {
                console.error("Failed to fetch sent invites:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInvites();
    }, [fetchSentInvites]);

    // Filter only invites related to the given teamId
    const teamInvites = sentInvites.filter((team) => team._id === teamId);

    return (
        <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-xl rounded-2xl p-6 mt-6 border border-gray-200 dark:border-gray-700 overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500 opacity-10 rounded-full -ml-12 -mb-12"></div>
            
            <div className="relative">
                <div className="flex items-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">Sent Invitations</h2>
                </div>

                <div className="border-b border-gray-200 dark:border-gray-700 w-full mb-6"></div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-blue-200 dark:bg-blue-800 mb-3"></div>
                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                    </div>
                ) : teamInvites.length > 0 ? (
                    <div className="space-y-6">
                        {teamInvites.map((team) => (
                            <div 
                                key={team._id} 
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
                            >
                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white">
                                    <div className="flex justify-between items-center">
                                        <h4 className="font-bold text-lg">{team.name}</h4>
                                        <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 text-xs">
                                            {team.invites.length} {team.invites.length === 1 ? 'invitation' : 'invitations'}
                                        </div>
                                    </div>
                                    {team.technology && (
                                        <div className="mt-2 text-blue-100 text-sm">{team.technology}</div>
                                    )}
                                </div>
                                
                                <div className="p-4">
                                    <div className="flex items-center mb-4">
                                        <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2 animate-pulse"></div>
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                            Awaiting Responses
                                        </span>
                                    </div>
                                    
                                    <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {team.invites.map((user, index) => (
                                            <li 
                                                key={index}
                                                className="py-3 group"
                                            >
                                                <div className="flex items-center group-hover:translate-x-1 transition-transform duration-200">
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium shadow-md">
                                                        {user.fullName.charAt(0)}
                                                    </div>
                                                    <div className="ml-4 flex-grow">
                                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                                            {user.fullName}
                                                        </p>
                                                        {user.email && (
                                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                                                {user.email}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <div className="ml-auto">
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                                            Pending
                                                        </span>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700 shadow-md">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300 font-medium mb-2">No pending invitations</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                            When you invite team members, they'll appear here until they respond
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SentInvites;