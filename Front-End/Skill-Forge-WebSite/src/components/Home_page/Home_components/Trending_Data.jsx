import React from 'react';
import { FaChevronRight, FaUserPlus, FaCalendarAlt, FaUsers } from 'react-icons/fa';

const Trending_Data = () => {
  return (
    <div className="space-y-4">
      {/* Trending events section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h3 className="flex items-center text-gray-900 dark:text-gray-100 font-semibold text-lg mb-3">
          <span className="mr-2">🔥</span>
          Trending Events
        </h3>
        <div className="space-y-3">
          {/* Event cards */}
          <div className="flex items-start rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 p-2 transition-colors">
            <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-md mr-3 min-w-[3rem] text-center">
              <span className="text-xs font-medium">JUL</span>
              <span className="text-lg font-bold">24</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">Web Development Workshop</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Learn the latest technologies in web development</p>
              <div className="flex items-center mt-2">
                <FaUsers className="text-gray-500 dark:text-gray-400 text-xs mr-1" />
                <span className="text-gray-500 dark:text-gray-400 text-xs">120 attending</span>
              </div>
            </div>
          </div>

          <div className="flex items-start rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 p-2 transition-colors">
            <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-2 rounded-md mr-3 min-w-[3rem] text-center">
              <span className="text-xs font-medium">AUG</span>
              <span className="text-lg font-bold">05</span>
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">Data Science Summit</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs mt-1">Explore the world of data analysis</p>
              <div className="flex items-center mt-2">
                <FaUsers className="text-gray-500 dark:text-gray-400 text-xs mr-1" />
                <span className="text-gray-500 dark:text-gray-400 text-xs">85 attending</span>
              </div>
            </div>
          </div>

          <a href="/events" className="flex items-center justify-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium pt-2 pb-1 border-t border-gray-100 dark:border-gray-700">
            View all events
            <FaChevronRight size={12} className="ml-1" />
          </a>
        </div>
      </div>

      {/* People you may know section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-3">
          People you may know
        </h3>
        <div className="space-y-3">
          <div className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
              JS
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">John Smith</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Software Engineer at Tech Co</p>
            </div>
            <button className="ml-2 flex items-center text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-1 px-2 rounded transition-colors">
              <FaUserPlus size={12} className="mr-1" />
              Connect
            </button>
          </div>

          <div className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
              AD
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">Amy Davis</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs">UX Designer at Design Studio</p>
            </div>
            <button className="ml-2 flex items-center text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-1 px-2 rounded transition-colors">
              <FaUserPlus size={12} className="mr-1" />
              Connect
            </button>
          </div>

          <div className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-medium text-sm mr-3">
              MJ
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 dark:text-gray-200 text-sm">Mark Johnson</h4>
              <p className="text-gray-600 dark:text-gray-400 text-xs">Web Developer at Creative Inc</p>
            </div>
            <button className="ml-2 flex items-center text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-1 px-2 rounded transition-colors">
              <FaUserPlus size={12} className="mr-1" />
              Connect
            </button>
          </div>

          <a href="/network" className="flex items-center justify-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium pt-2 pb-1 border-t border-gray-100 dark:border-gray-700">
            View more
            <FaChevronRight size={12} className="ml-1" />
          </a>
        </div>
      </div>

      {/* Learning resources section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-3">
          Learning Resources
        </h3>
        <div className="space-y-2">
          <a href="/courses" className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-8 h-8 flex items-center justify-center bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg mr-3">
              📚
            </div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">Explore Courses</span>
          </a>
          <a href="/webinars" className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-8 h-8 flex items-center justify-center bg-purple-50 dark:bg-purple-900 text-purple-600 dark:text-purple-300 rounded-lg mr-3">
              🎥
            </div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">Upcoming Webinars</span>
          </a>
          <a href="/articles" className="flex items-center p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="w-8 h-8 flex items-center justify-center bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 rounded-lg mr-3">
              📝
            </div>
            <span className="text-gray-700 dark:text-gray-300 text-sm">Featured Articles</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Trending_Data;
