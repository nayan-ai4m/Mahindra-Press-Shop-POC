import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { DEFECT_TYPES } from '../types/defects';
import './ImageGallery.css';

export default function ImageGallery({ isOpen, onClose, images, title }) {
    const { theme, colors } = useTheme();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(0);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen || !images || images.length === 0) return null;

    const handlePrevious = () => {
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
    };

    const currentImage = images[currentIndex];
    const currentDefectType = currentImage?.defectType || 'Unknown';

    const getDefectColor = (defectName) => {
        const defect = DEFECT_TYPES.find(d => d.name === defectName);
        return theme === 'dark' ? defect?.darkColor : defect?.color;
    };

    return (
        <div
            className="gallery-overlay"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)' }}
            onClick={onClose}
        >
            <div
                className="gallery-modal"
                style={{ backgroundColor: colors.cardBg }}
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className="gallery-header"
                    style={{ backgroundColor: colors.primary }}
                >
                    <h2 className="gallery-title">
                        {title} - {images.length} images
                    </h2>
                    <button
                        onClick={onClose}
                        className="gallery-close-btn"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="gallery-content">
                    <div className="gallery-viewer">
                        <button
                            onClick={handlePrevious}
                            className="gallery-nav-btn gallery-nav-left"
                            style={{
                                backgroundColor: colors.surface,
                                color: colors.text,
                                border: `1px solid ${colors.border}`,
                            }}
                        >
                            <ChevronLeft size={24} />
                        </button>

                        <div className="gallery-image-container">
                            <div
                                className="gallery-image-wrapper"
                                style={{
                                    backgroundColor: colors.surface,
                                    border: `2px solid ${colors.border}`,
                                }}
                            >
                                <img
                                    src={currentImage?.url}
                                    alt={`Defect ${currentIndex + 1}`}
                                    className="gallery-image"
                                />
                            </div>
                            <div className="gallery-info">
                                <span className="gallery-counter" style={{ color: colors.text }}>
                                    {currentIndex + 1} / {images.length}
                                </span>
                                <span
                                    className="gallery-defect-badge"
                                    style={{
                                        backgroundColor: `${getDefectColor(currentDefectType)}20`,
                                        color: getDefectColor(currentDefectType),
                                        border: `1px solid ${getDefectColor(currentDefectType)}`,
                                    }}
                                >
                                    {currentDefectType}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            className="gallery-nav-btn gallery-nav-right"
                            style={{
                                backgroundColor: colors.surface,
                                color: colors.text,
                                border: `1px solid ${colors.border}`,
                            }}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

