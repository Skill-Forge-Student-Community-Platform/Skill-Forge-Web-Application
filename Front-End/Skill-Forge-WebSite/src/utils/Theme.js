export const lightTheme = {
    // Base colors
    '--bg-color': '#ffffff',
    '--text-color': '#000000',
    '--text-secondary': '#666666',
    '--text-muted': '#888888',

    // Structural elements
    '--sidebar-bg': '#F5F5F5',
    '--container-bg': '#ffffff',
    '--hover-bg': '#f0f0f0',
    '--card-bg': '#ffffff',
    '--card-border': '#e0e0e0',

    // Theme toggle
    '--toggle-bg': '#ffffff',
    '--sun-color': '#ffbf00',
    '--moon-color': '#f1f5f9',

    // Core UI elements
    '--light-bg': '#ffffff',
    '--dark-bg': '#000000',

    // Modal components
    '--modal-bg': '#ffffff',
    '--modal-border': '#e0e0e0',
    '--modal-shadow': 'rgba(0, 0, 0, 0.1)',

    // Form elements
    '--input-bg': '#f5f5f5',
    '--input-border': '#e0e0e0',
    '--input-text': '#000000',

    // Buttons
    '--button-primary': '#1DA1F2',
    '--button-primary-text': '#ffffff',
    '--button-primary-hover': '#0d8ecf',
    '--button-secondary': '#f5f5f5',
    '--button-secondary-text': '#000000',
    '--button-secondary-hover': '#e5e5e5',
    '--button-danger': '#ff4c4c',
    '--button-danger-text': '#ffffff',

    // UI accents
    '--accent-blue': '#0a66c2',
    '--accent-green': '#2ecc71',
    '--accent-red': '#e74c3c',
    '--accent-yellow': '#f39c12',
    '--accent-purple': '#9b59b6',

    // Specific components
    '--post-bg': '#ffffff',
    '--post-border': '#e0e0e0',
    '--notification-bg': '#ffffff',
    '--notification-unread': '#edf2fa',

    // Navigation
    '--nav-bg': '#ffffff',
    '--nav-border': '#e0e0e0',
    '--nav-item-hover': '#f0f0f0',
    '--nav-item-active': '#e6f7ff',

    // Misc
    '--inverse-bg': '#000000',
    '--divider-color': '#e0e0e0'
};

export const darkTheme = {
    // Base colors
    '--bg-color': '#121212',
    '--text-color': '#ffffff',
    '--text-secondary': '#a0a0a0',
    '--text-muted': '#888888',

    // Structural elements
    '--sidebar-bg': '#1e1e1e',
    '--container-bg': '#242424',
    '--hover-bg': 'rgba(255, 255, 255, 0.1)',
    '--card-bg': '#2a2a2a',
    '--card-border': '#404040',

    // Theme toggle
    '--toggle-bg': '#121212',
    '--sun-color': '#ffffff',
    '--moon-color': '#000000',

    // Core UI elements
    '--light-bg': '#000000',
    '--dark-bg': '#ffffff',

    // Modal components
    '--modal-bg': '#2A2A2A',
    '--modal-border': '#404040',
    '--modal-shadow': 'rgba(0, 0, 0, 0.3)',

    // Form elements
    '--input-bg': '#333333',
    '--input-border': '#404040',
    '--input-text': '#ffffff',

    // Buttons
    '--button-primary': '#1DA1F2',
    '--button-primary-text': '#ffffff',
    '--button-primary-hover': '#0d8ecf',
    '--button-secondary': '#404040',
    '--button-secondary-text': '#ffffff',
    '--button-secondary-hover': '#4f4f4f',
    '--button-danger': '#ff4c4c',
    '--button-danger-text': '#ffffff',

    // UI accents
    '--accent-blue': '#3182ce',
    '--accent-green': '#2ecc71',
    '--accent-red': '#e74c3c',
    '--accent-yellow': '#f39c12',
    '--accent-purple': '#9b59b6',

    // Specific components
    '--post-bg': '#2a2a2a',
    '--post-border': '#404040',
    '--notification-bg': '#2a2a2a',
    '--notification-unread': '#1e2937',

    // Navigation
    '--nav-bg': '#1e1e1e',
    '--nav-border': '#404040',
    '--nav-item-hover': 'rgba(255, 255, 255, 0.1)',
    '--nav-item-active': '#1e3a5f',

    // Misc
    '--inverse-bg': '#ffffff',
    '--divider-color': '#404040'
};

export const applyTheme = (theme) => {
    Object.keys(theme).forEach(key => {
        document.documentElement.style.setProperty(key, theme[key]);
    });
};

export const initializeTheme = () => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        // Apply saved theme preference
        document.documentElement.setAttribute('data-theme', savedTheme);
        applyTheme(savedTheme === 'dark' ? darkTheme : lightTheme);
    } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        applyTheme(prefersDark ? darkTheme : lightTheme);
    }
};

// Save theme preference to localStorage
export const saveThemePreference = (isDarkMode) => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
};
