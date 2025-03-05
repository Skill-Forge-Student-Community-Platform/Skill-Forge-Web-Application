import React from 'react';
import { motion } from 'framer-motion';

const LoginImagePattern = ({ title, subtitle, quote, quoteAuthor }) => {
  // Array to hold different animation delays for staggered animation effect
  const delayArray = [0.1, 0.2, 0.3, 0.2, 0.1, 0.3, 0.2, 0.1, 0.3];

  return (
    <div className="hidden lg:flex flex-col items-center justify-center h-full bg-gradient-to-br from-gray-800 to-gray-900 p-8 border-r border-gray-700 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-md text-center"
      >
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[...Array(9)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: delayArray[i],
                type: "spring",
                stiffness: 200
              }}
              className={`aspect-square rounded-2xl ${
                i % 2 === 0
                  ? "bg-gradient-to-br from-green-400/20 to-emerald-500/20 animate-pulse"
                  : "bg-gradient-to-br from-gray-700/40 to-gray-600/40"
              }`}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <h2 className="text-xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            {title || "Welcome to Skill Forge"}
          </h2>
          <p className="text-gray-400 mb-4 text-sm">
            {subtitle || "Connect with professionals, share knowledge, and forge your skills."}
          </p>

          {/* Inspirational quote section */}
          {quote && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-4 p-4 bg-gray-800/50 border border-gray-700/50 rounded-lg"
            >
              <p className="text-gray-300 italic text-sm">{quote}</p>
              {quoteAuthor && (
                <p className="text-gray-500 text-xs mt-2">— {quoteAuthor}</p>
              )}
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="mt-auto text-gray-500 text-xs"
      >
        &copy; {new Date().getFullYear()} Skill Forge. All rights reserved.
      </motion.div>
    </div>
  );
};

export default LoginImagePattern;
