import { useTheme } from '../contexts/ThemeContext';
import { DEFECT_TYPES } from '../types/defects';
import './Dashboard.css';

export default function Dashboard({ scanData }) {
    const { theme, colors } = useTheme();

    const gridRows = 9;
    const gridCols = 18;

    const getDefectColor = (defectType) => {
        const defect = DEFECT_TYPES.find(d => d.name === defectType);
        return theme === 'dark' ? defect?.darkColor : defect?.color;
    };

    return (
        <div className="dashboard" style={{ backgroundColor: colors.background }}>
            <div className="dashboard-container">
                <div
                    className="info-card"
                    style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                    }}
                >
                    <div className="info-grid">
                        <div className="info-item">
                            <div className="info-label" style={{ color: colors.textSecondary }}>
                                Variant
                            </div>
                            <div className="info-value" style={{ color: colors.text }}>
                                {scanData.variant}
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-label" style={{ color: colors.textSecondary }}>
                                Date
                            </div>
                            <div className="info-value" style={{ color: colors.text }}>
                                {scanData.date}
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-label" style={{ color: colors.textSecondary }}>
                                Shift
                            </div>
                            <div className="info-value" style={{ color: colors.text }}>
                                {scanData.shift}
                            </div>
                        </div>
                        <div className="info-item">
                            <div className="info-label" style={{ color: colors.textSecondary }}>
                                Scan Time
                            </div>
                            <div className="info-value" style={{ color: colors.text }}>
                                {scanData.scanTime}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="defect-summary-card"
                    style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                    }}
                >
                    <div className="defect-tags">
                        {scanData.defects.map((defect, index) => {
                            const defectInfo = DEFECT_TYPES.find(d => d.name === defect.name);
                            const color = theme === 'dark' ? defectInfo?.darkColor : defectInfo?.color;
                            return (
                                <div
                                    key={index}
                                    className="defect-tag"
                                    style={{
                                        backgroundColor: colors.surface,
                                        border: `2px solid ${color}`,
                                    }}
                                >
                                    <div
                                        className="defect-dot"
                                        style={{ backgroundColor: color }}
                                    ></div>
                                    <span className="defect-name" style={{ color: colors.text }}>
                                        {defect.name}
                                    </span>
                                    <span
                                        className="defect-count"
                                        style={{
                                            backgroundColor: color,
                                            color: '#ffffff',
                                        }}
                                    >
                                        {defect.count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div
                    className="grid-card"
                    style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                    }}
                >
                    <h2 className="card-title" style={{ color: colors.text }}>
                        Defect Grid Visualization
                    </h2>
                    <div className="grid-scroll">
                        <div className="grid-wrapper">
                            <div
                                className="panel-container"
                                style={{
                                    backgroundImage: `url('/images/Z101/BSO_LH.png')`,
                                }}
                            >
                                <div
                                    className="defect-grid"
                                    style={{
                                        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
                                    }}
                                >
                                    {Array.from({ length: gridRows * gridCols }).map((_, index) => {
                                        const row = Math.floor(index / gridCols);
                                        const col = index % gridCols;
                                        const defect = scanData.gridDefects.find(
                                            d => d.row === row && d.col === col
                                        );

                                        return (
                                            <div
                                                key={index}
                                                className={`grid-cell ${defect ? 'has-defect' : ''}`}
                                                style={{
                                                    backgroundColor: defect
                                                        ? getDefectColor(defect.type)
                                                        : 'transparent',
                                                    borderColor: theme === 'dark'
                                                        ? 'rgba(255, 255, 255, 0.2)'
                                                        : 'rgba(0, 0, 0, 0.15)',
                                                }}
                                                title={defect ? defect.type : 'No defect'}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
