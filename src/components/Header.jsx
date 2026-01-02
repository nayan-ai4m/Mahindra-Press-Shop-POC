import { Moon, Sun, BookOpen, Home } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import './Header.css';

export default function Header({ currentView, onNavigate }) {
    const { theme, toggleTheme, colors } = useTheme();

    return (
        <header
            className="header"
            style={{
                backgroundColor: colors.cardBg,
                borderBottom: `1px solid ${colors.border}`,
            }}
        >
            <div className="header-container">
                <div className="header-content">
                    <div className="header-left">
                        <div className="logo-container">
                            <div className="logo-icon">
                                <span className="logo-text">M</span>
                            </div>
                            <div className="logo-brand">
                                <div className="brand-name" style={{ color: colors.textSecondary }}>
                                    MAHINDRA
                                </div>
                                <div className="brand-subtitle" style={{ color: colors.textSecondary }}>
                                    MOBILITY LIMITED
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="header-center">
                        <h1 className="header-title" style={{ color: colors.text }}>
                            PRESS SHOP
                        </h1>
                    </div>

                    <div className="header-right">
                        <button
                            onClick={toggleTheme}
                            className="theme-toggle-btn"
                            style={{
                                backgroundColor: colors.surface,
                                color: colors.text,
                                border: `1px solid ${colors.border}`,
                            }}
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>

                        <button
                            onClick={() => onNavigate(currentView === 'dashboard' ? 'history' : 'dashboard')}
                            className="nav-btn"
                            style={{
                                backgroundColor: colors.primary,
                            }}
                        >
                            {currentView === 'dashboard' ? (
                                <>
                                    <BookOpen size={18} />
                                    History
                                </>
                            ) : (
                                <>
                                    <Home size={18} />
                                    Dashboard
                                </>
                            )}
                        </button>

                        <div className="henkel-logo">
                            <span className="henkel-text">AI4M</span>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
