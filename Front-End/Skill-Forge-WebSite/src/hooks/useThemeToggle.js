import { useState, useEffect } from 'react';
import { applyTheme, lightTheme, darkTheme, saveThemePreference } from '../utils/Theme';

const useThemeToggle = () => {
  // Initialize state with null - we'll determine the actual value in useEffect
  const [isDarkMode, setIsDarkMode] = useState(null);

  // On initial load, check localStorage and system preference
  useEffect(() => {
    // Check if theme preference exists in localStorage
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      // Use saved preference
      const isCurrentlyDark = savedTheme === 'dark';
      setIsDarkMode(isCurrentlyDark);
      applyTheme(isCurrentlyDark ? darkTheme : lightTheme);
    } else {
      // If no saved preference, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      applyTheme(prefersDark ? darkTheme : lightTheme);
    }
  }, []);

  // Toggle the theme when the user clicks the theme button
  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;

      // Save to localStorage
      saveThemePreference(newMode);

      // Apply the theme
      applyTheme(newMode ? darkTheme : lightTheme);

      // Also update the data-theme attribute for CSS selectors
      document.documentElement.setAttribute('data-theme', newMode ? 'dark' : 'light');

      return newMode;
    });
  };

  return { isDarkMode, toggleTheme };
};

export default useThemeToggle;
