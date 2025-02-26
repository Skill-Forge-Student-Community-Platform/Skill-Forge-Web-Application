export const lightTheme = {
    '--bg-color': '#ffffff',
    '--text-color': '#000000',
    '--sidebar-bg': '#F5F5F5',
    '--container-bg': '#ffffff',
    '--hover-bg': '#f0f0f0',
    '--toggle-bg': '#000000',
    '--sun-color': '#000000',
    '--moon-color': '#ffffff',
    '--light-bg': '#ffffff',
    '--dark-bg': '#000000',
    '--modal-bg': '#ffffff',
    '--modal-border': '#e0e0e0',
    '--input-bg': '#f5f5f5',
    '--input-border': '#e0e0e0',
    '--input-text': '#000000',
    '--button-primary': '#1DA1F2',
    '--button-primary-text': '#ffffff',
    '--button-secondary': '#f5f5f5',
    '--button-secondary-text': '#000000',
    '--modal-shadow': 'rgba(0, 0, 0, 0.1)',
    '--inverse-bg': '#000000'  // Add this line
};

export const darkTheme = {
    '--bg-color': '#333333',
    '--text-color': '#ffffff',
    '--sidebar-bg': '#242424',
    '--container-bg': '#2A2A2A',
    '--hover-bg': 'rgba(255, 255, 255, 0.1)',
    '--toggle-bg': '#000000',
    '--sun-color': '#ffffff',
    '--moon-color': '#000000',
    '--light-bg': '#000000',
    '--dark-bg': '#ffffff',
    '--modal-bg': '#2A2A2A',
    '--modal-border': '#404040',
    '--input-bg': '#333333',
    '--input-border': '#404040',
    '--input-text': '#ffffff',
    '--button-primary': '#1DA1F2',
    '--button-primary-text': '#ffffff',
    '--button-secondary': '#404040',
    '--button-secondary-text': '#ffffff',
    '--modal-shadow': 'rgba(0, 0, 0, 0.3)',
    '--inverse-bg': '#ffffff'  // Add this line
};

export const applyTheme = (theme) => {
    Object.keys(theme).forEach(key => {
        document.documentElement.style.setProperty(key, theme[key]);
    });
};

export const initializeTheme = () => {
    document.documentElement.setAttribute('data-theme', 'light');
    applyTheme(lightTheme);
};
