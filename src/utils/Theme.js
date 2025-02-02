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
    '--dark-bg': '#000000'
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
    '--dark-bg': '#ffffff'
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
