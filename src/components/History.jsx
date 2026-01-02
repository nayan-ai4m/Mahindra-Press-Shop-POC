import { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useTheme } from '../contexts/ThemeContext';
import { DEFECT_TYPES } from '../types/defects';
import './History.css';

export default function History({ records, onViewImages, onViewDefectImages }) {
    const { theme, colors } = useTheme();
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState('All Variants');
    const [selectedDefectType, setSelectedDefectType] = useState('All Types');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const variants = ['All Variants', 'Z101 BSO LH', 'M110 Fixed Glass Roof Front', 'THAR FDO RH- W502', 'M310 E9 LGO Lower', 'PANEL FENDER LH -Z101'];

    const filteredRecords = records.filter(record => {
        if (selectedVariant !== 'All Variants' && record.variant !== selectedVariant) return false;
        if (selectedDefectType !== 'All Types' && !record.defectTypes.some(d => d.type === selectedDefectType)) return false;
        return true;
    });

    const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedRecords = filteredRecords.slice(startIndex, startIndex + itemsPerPage);

    const resetFilters = () => {
        setFromDate(null);
        setToDate(null);
        setSelectedVariant('All Variants');
        setSelectedDefectType('All Types');
        setCurrentPage(1);
    };

    const getDefectColor = (defectName) => {
        const defect = DEFECT_TYPES.find(d => d.name === defectName);
        return theme === 'dark' ? defect?.darkColor : defect?.color;
    };

    const getVariantColor = (variant) => {
        const variantColors = ['#22c55e', '#3b82f6', '#f107316', '#8b5cf6', '#ef4444', '#06b6d4'];
        const index = Math.abs(variant.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % variantColors.length;
        return variantColors[index];
    };

    return (
        <div className="history" style={{ backgroundColor: colors.background }}>
            <div className="history-container">
                <div
                    className="filter-card"
                    style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.border}`,
                    }}
                >
                    <div className="filter-grid">
                        <div className="filter-item">
                            <label className="filter-label" style={{ color: colors.text }}>
                                From Date
                            </label>
                            <DatePicker
                                selected={fromDate}
                                onChange={(date) => setFromDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                className="filter-input"
                                wrapperClassName="datepicker-wrapper"
                                maxDate={toDate || undefined}
                            />
                        </div>
                        <div className="filter-item">
                            <label className="filter-label" style={{ color: colors.text }}>
                                To Date
                            </label>
                            <DatePicker
                                selected={toDate}
                                onChange={(date) => setToDate(date)}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="DD/MM/YYYY"
                                className="filter-input"
                                wrapperClassName="datepicker-wrapper"
                                minDate={fromDate || undefined}
                            />
                        </div>
                        <div className="filter-item">
                            <label className="filter-label" style={{ color: colors.text }}>
                                Variant
                            </label>
                            <select
                                value={selectedVariant}
                                onChange={(e) => setSelectedVariant(e.target.value)}
                                className="filter-select"
                                style={{
                                    backgroundColor: colors.inputBg,
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`,
                                }}
                            >
                                {variants.map(variant => (
                                    <option key={variant} value={variant}>{variant}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-item">
                            <label className="filter-label" style={{ color: colors.text }}>
                                Defect Type
                            </label>
                            <select
                                value={selectedDefectType}
                                onChange={(e) => setSelectedDefectType(e.target.value)}
                                className="filter-select"
                                style={{
                                    backgroundColor: colors.inputBg,
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`,
                                }}
                            >
                                <option value="All Types">All Types</option>
                                {DEFECT_TYPES.map(defect => (
                                    <option key={defect.name} value={defect.name}>{defect.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="filter-actions">
                            <button
                                onClick={resetFilters}
                                className="reset-btn"
                                style={{
                                    backgroundColor: colors.surface,
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`,
                                }}
                            >
                                Reset Filters
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className="table-card"
                    style={{
                        backgroundColor: colors.tableBg,
                        border: `1px solid ${colors.border}`,
                    }}
                >
                    <div className="table-scroll">
                        <table className="history-table">
                            <thead>
                                <tr style={{ backgroundColor: colors.tableHeaderBg }}>
                                    <th className="table-header">SR. NO.</th>
                                    <th className="table-header">VARIANT</th>
                                    <th className="table-header">DATE</th>
                                    <th className="table-header">TIMESTAMP</th>
                                    <th className="table-header">DEFECT COUNT</th>
                                    <th className="table-header">DEFECT TYPE</th>
                                    <th className="table-header table-header-center">IMAGE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedRecords.map((record, index) => (
                                    <tr
                                        key={record.id}
                                        className="table-row"
                                        style={{
                                            backgroundColor: index % 2 === 0 ? colors.tableBg : colors.surface,
                                        }}
                                    >
                                        <td className="table-cell" style={{ color: colors.text }}>
                                            {startIndex + index + 1}
                                        </td>
                                        <td className="table-cell">
                                            <span
                                                className="variant-badge"
                                                style={{
                                                    backgroundColor: `${getVariantColor(record.variant)}20`,
                                                    color: getVariantColor(record.variant),
                                                    border: `1px solid ${getVariantColor(record.variant)}`,
                                                }}
                                            >
                                                {record.variant}
                                            </span>
                                        </td>
                                        <td className="table-cell" style={{ color: colors.text }}>
                                            {record.date}
                                        </td>
                                        <td className="table-cell" style={{ color: colors.text }}>
                                            {record.timestamp}
                                        </td>
                                        <td className="table-cell table-cell-bold" style={{ color: colors.text }}>
                                            {record.defectCount}
                                        </td>
                                        <td className="table-cell">
                                            <div className="defect-badges">
                                                {record.defectTypes.map((defect, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="defect-badge defect-badge-clickable"
                                                        style={{
                                                            backgroundColor: `${getDefectColor(defect.type)}20`,
                                                            color: getDefectColor(defect.type),
                                                            border: `1px solid ${getDefectColor(defect.type)}`,
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => onViewDefectImages(record, defect.type)}
                                                        title={`Click to view ${defect.count} ${defect.type} images`}
                                                    >
                                                        {defect.type} ({defect.count})
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="table-cell table-cell-center">
                                            <button
                                                onClick={() => onViewImages(record)}
                                                className="view-btn"
                                                style={{
                                                    backgroundColor: colors.primary,
                                                }}
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div
                        className="pagination"
                        style={{
                            backgroundColor: colors.surface,
                            borderTop: `1px solid ${colors.border}`,
                        }}
                    >
                        <div className="pagination-controls">
                            <button
                                onClick={() => setCurrentPage(1)}
                                disabled={currentPage === 1}
                                className="pagination-btn"
                                style={{
                                    backgroundColor: colors.surface,
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`,
                                }}
                            >
                                <ChevronsLeft size={18} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="pagination-btn"
                                style={{
                                    backgroundColor: colors.surface,
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`,
                                }}
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="page-info" style={{ color: colors.text }}>
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="pagination-btn"
                                style={{
                                    backgroundColor: colors.surface,
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`,
                                }}
                            >
                                <ChevronRight size={18} />
                            </button>
                            <button
                                onClick={() => setCurrentPage(totalPages)}
                                disabled={currentPage === totalPages}
                                className="pagination-btn"
                                style={{
                                    backgroundColor: colors.surface,
                                    color: colors.text,
                                    border: `1px solid ${colors.border}`,
                                }}
                            >
                                <ChevronsRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
