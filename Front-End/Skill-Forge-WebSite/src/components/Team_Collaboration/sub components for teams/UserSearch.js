import { useState } from "react";
import useUserSearchStore from "../../../store/userSearchStore";
import Modal from "react-modal";

const UserSearch = ({ teamId }) => {
  const [query, setQuery] = useState("");
  const {
    users,
    searchUsers,
    loading,
    error,
    openInviteModal,
    closeInviteModal,
    sendInvite,
    modalOpen,
    selectedUser,
  } = useUserSearchStore();

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      useUserSearchStore.setState({ users: [] }); // Clear the user list
    } else {
      searchUsers(value);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-6 flex items-center">
        <svg
          className="w-6 h-6 mr-3"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="9"
            cy="7"
            r="4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M23 21v-2a4 4 0 0 0-3-3.87"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 3.13a4 4 0 0 1 0 7.75"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Find Team Members
      </h2>

      {/* Search Input */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={query}
          onChange={handleSearch}
          className="w-full p-4 pl-12 text-gray-900 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-3 focus:ring-blue-500/30 dark:focus:ring-blue-500/40 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all shadow-sm"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-400">
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
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Loading/Error Messages */}
      {loading && (
        <div className="flex items-center justify-center py-6">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
          <p className="text-blue-500 font-medium">Searching users...</p>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-4 px-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
          <svg
            className="w-5 h-5 text-red-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {/* User List */}
      {users.length > 0 ? (
        <ul className="mt-6 space-y-4">
          {users.map((user) => (
            <li
              key={user._id}
              className="flex items-center justify-between p-5 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700 transform hover:-translate-y-1"
            >
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.name}
                    className="w-14 h-14 object-cover rounded-full border-2 border-gray-100 dark:border-gray-700 shadow-md"
                  />
                  <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {user.Username}
                  </h3>
                  {user.role && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.role}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => openInviteModal(user, teamId)}
                className="flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-all duration-300"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  ></path>
                </svg>
                Invite
              </button>
            </li>
          ))}
        </ul>
      ) : !loading && query.length > 0 ? (
        <div className="flex flex-col items-center justify-center py-10 px-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-inner">
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
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="text-gray-700 dark:text-gray-300 font-medium text-lg mb-1">
            No users found
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-center">
            Try a different search term
          </p>
        </div>
      ) : (
        !loading && (
          <div className="flex flex-col items-center justify-center py-10 px-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-inner">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
            <p className="text-gray-700 dark:text-gray-300 font-medium text-lg mb-1">
              Search for users
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-center">
              Enter a name to find team members
            </p>
          </div>
        )
      )}

      {/* Invite Confirmation Modal */}
      <Modal
        isOpen={modalOpen}
        onRequestClose={closeInviteModal}
        className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl max-w-md mx-auto border border-gray-100 dark:border-gray-700"
        overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        ariaHideApp={false}
      >
        {selectedUser && (
          <div>
            <div className="flex items-center mb-6">
              <img
                src={selectedUser.profilePic || "/avatar.png"}
                alt={selectedUser.name}
                className="w-16 h-16 object-cover rounded-full border-2 border-gray-100 dark:border-gray-700 shadow-md mr-4"
              />
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  Invite {selectedUser.Username}
                </h2>
                {selectedUser.role && (
                  <p className="text-gray-500 dark:text-gray-400">
                    {selectedUser.role}
                  </p>
                )}
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800/30">
              You're about to send a team invitation to{" "}
              <span className="font-semibold">{selectedUser.Username}</span>.
              They will receive a notification and can accept or decline your
              invitation.
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={closeInviteModal}
                className="px-5 py-2.5 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => sendInvite(teamId)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 shadow-md hover:shadow-lg font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
              >
                Send Invitation
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserSearch;
