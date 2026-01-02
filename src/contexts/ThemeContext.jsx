import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(undefined);

const lightColors = {
    background: '#f3f4f6',
    cardBg: '#ffffff',
    surface: '#f9fafb',
    text: '#111827',
    textSecondary: '#6b7280',
    border: '#e5e7eb',
    primary: '#3b82f6',
    inputBg: '#ffffff',
    tableBg: '#ffffff',
    tableHeaderBg: 'rgb(59, 130, 246)',
};

const darkColors = {
    background: '#111827',
    cardBg: '#1f2937',
    surface: '#374151',
    text: '#f9fafb',
    textSecondary: '#9ca3af',
    border: '#4b5563',
    primary: '#3b82f6',
    inputBg: '#374151',
    tableBg: '#1f2937',
    tableHeaderBg: '#111827',
};

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        setTheme(savedTheme);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    const colors = theme === 'dark' ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
