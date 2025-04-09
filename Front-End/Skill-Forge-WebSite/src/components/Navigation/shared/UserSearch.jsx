import { useState } from "react";
import useUserSearchStore from "../../../store/userSearchStore";

const UserSearch = () => {
  const [query, setQuery] = useState("");
  const { users, searchUsers, loading, error } = useUserSearchStore();

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim() === "") {
      useUserSearchStore.setState({ users: [] });
    } else {
      searchUsers(value);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative mt-2">
      <input
        type="text"
        value={query}
        onChange={handleSearch}
        placeholder="Search users..."
        className="w-full h-10 pl-4 pr-3 rounded-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all text-sm bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
      />

      {loading && (
        <p className="mt-2 text-center text-sm text-blue-500">Searching...</p>
      )}

      {error && (
        <p className="mt-2 text-center text-sm text-red-500">{error}</p>
      )}

      {users.length > 0 && (
        <ul className="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
          {users.map((user) => (
            <li
              key={user._id}
              className="flex items-start p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-all"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                {user.Username[0]?.toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.Username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!loading && query.trim() !== "" && users.length === 0 && (
        <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
          No users found.
        </p>
      )}
    </div>
  );
};

export default UserSearch;
