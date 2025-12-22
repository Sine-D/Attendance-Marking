// Analytics utility functions

/**
 * Calculate attendance percentage
 */
export const calculateAttendanceRate = (present, total) => {
    if (total === 0) return 0;
    return parseFloat(((present / total) * 100).toFixed(1));
};

/**
 * Format date for display
 */
export const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
};

/**
 * Get color based on attendance percentage
 */
export const getAttendanceColor = (percentage) => {
    if (percentage >= 90) return '#43e97b'; // Green
    if (percentage >= 75) return '#fee140'; // Yellow
    return '#f5576c'; // Red
};

/**
 * Format chart data for Recharts
 */
export const formatChartData = (data) => {
    return data.map(item => ({
        ...item,
        attendanceRate: parseFloat(item.attendanceRate)
    }));
};

/**
 * Export chart as image using html2canvas
 */
export const exportChartAsImage = async (elementId, filename = 'chart.png') => {
    try {
        const html2canvas = (await import('html2canvas')).default;
        const element = document.getElementById(elementId);

        if (!element) {
            console.error('Element not found');
            return;
        }

        const canvas = await html2canvas(element, {
            backgroundColor: '#1a1a2e',
            scale: 2
        });

        canvas.toBlob((blob) => {
            const FileSaver = require('file-saver');
            FileSaver.saveAs(blob, filename);
        });
    } catch (error) {
        console.error('Error exporting chart:', error);
    }
};

/**
 * Export data as CSV
 */
export const exportToCSV = (data, filename = 'analytics.csv') => {
    if (!data || data.length === 0) return;

    const FileSaver = require('file-saver');

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...data.map(row =>
            headers.map(header => {
                const value = row[header];
                // Escape commas and quotes
                if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                    return `"${value.replace(/"/g, '""')}"`;
                }
                return value;
            }).join(',')
        )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    FileSaver.saveAs(blob, filename);
};

/**
 * Group data by date
 */
export const groupByDate = (data) => {
    const grouped = {};

    data.forEach(item => {
        const date = new Date(item.createdAt).toLocaleDateString();
        if (!grouped[date]) {
            grouped[date] = [];
        }
        grouped[date].push(item);
    });

    return grouped;
};

/**
 * Calculate average attendance over period
 */
export const calculateAverageAttendance = (trendData) => {
    if (!trendData || trendData.length === 0) return 0;

    const sum = trendData.reduce((acc, item) => acc + parseFloat(item.attendanceRate), 0);
    return parseFloat((sum / trendData.length).toFixed(1));
};

/**
 * Get date range for filters
 */
export const getDateRange = (period) => {
    const end = new Date();
    const start = new Date();

    switch (period) {
        case 'week':
            start.setDate(start.getDate() - 7);
            break;
        case 'month':
            start.setMonth(start.getMonth() - 1);
            break;
        case 'year':
            start.setFullYear(start.getFullYear() - 1);
            break;
        default:
            start.setDate(start.getDate() - 7);
    }

    return { start, end };
};

/**
 * Format time for display
 */
export const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
    switch (status) {
        case 'Complete':
            return { bg: 'rgba(67, 233, 123, 0.2)', text: '#43e97b' };
        case 'Present':
            return { bg: 'rgba(254, 225, 64, 0.2)', text: '#fee140' };
        case 'Absent':
            return { bg: 'rgba(245, 87, 108, 0.2)', text: '#f5576c' };
        default:
            return { bg: 'rgba(255, 255, 255, 0.1)', text: '#fff' };
    }
};
