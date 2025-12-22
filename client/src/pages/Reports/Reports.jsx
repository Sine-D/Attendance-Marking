import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { exportToCSV, exportToPDF, printReport, formatReportData } from '../../utils/exportUtils';

const Reports = () => {
    const { students } = useSelector((state) => state.students);
    const [reportType, setReportType] = useState('daily');
    const [filteredData, setFilteredData] = useState([]);

    useEffect(() => {
        // Filter data based on report type
        let filtered = [...students];

        // Note: Real filtering logic based on reportType (daily/weekly/monthly) 
        // using date fields should be implemented here if the data supports it.
        // For now, we are just mocking the "filtered" set to all students 
        // to avoid unused variable errors with startDate/endDate which were not used.

        setFilteredData(filtered);
    }, [reportType, students]);

    const handleExportCSV = () => {
        const formattedData = formatReportData(filteredData);
        exportToCSV(formattedData, `attendance_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    };

    const handleExportPDF = () => {
        const formattedData = formatReportData(filteredData);
        exportToPDF(formattedData, `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Report`, `attendance_${reportType}.pdf`);
    };

    const handlePrint = () => {
        const formattedData = formatReportData(filteredData);
        printReport(formattedData, `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Attendance Report`);
    };

    // Calculate statistics
    const totalEmployees = filteredData.length;
    const presentCount = filteredData.filter(emp => emp.data?.checkout).length;
    const absentCount = totalEmployees - presentCount;
    const attendanceRate = totalEmployees > 0 ? ((presentCount / totalEmployees) * 100).toFixed(1) : 0;

    return (
        <div className="min-h-screen pt-24 pb-12 px-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-8"
            >
                <h1
                    className="font-bold text-5xl md:text-6xl mb-4 gradient-text"
                    style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}
                >
                    Attendance Reports
                </h1>
                <p className="text-gray-300 text-lg">Generate and export comprehensive attendance reports</p>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="max-w-6xl mx-auto mb-8"
            >
                <div
                    className="glass rounded-2xl p-6"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {/* Report Type Selector */}
                        <div>
                            <label className="block text-gray-300 text-sm font-semibold mb-2">Report Type</label>
                            <div className="flex gap-2">
                                {['daily', 'weekly', 'monthly'].map((type) => (
                                    <motion.button
                                        key={type}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setReportType(type)}
                                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${reportType === type
                                            ? 'text-white'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                        style={{
                                            background: reportType === type
                                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                                : 'rgba(255, 255, 255, 0.05)',
                                        }}
                                    >
                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Export Buttons */}
                    <div className="flex gap-4 justify-end flex-wrap">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handlePrint}
                            className="px-6 py-3 rounded-lg font-semibold text-white flex items-center gap-2"
                            style={{
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                boxShadow: '0 4px 15px rgba(240, 147, 251, 0.4)',
                            }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                            </svg>
                            Print Report
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleExportCSV}
                            className="px-6 py-3 rounded-lg font-semibold text-white flex items-center gap-2"
                            style={{
                                background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                boxShadow: '0 4px 15px rgba(67, 233, 123, 0.4)',
                            }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export CSV
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleExportPDF}
                            className="px-6 py-3 rounded-lg font-semibold text-white flex items-center gap-2"
                            style={{
                                background: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
                                boxShadow: '0 4px 15px rgba(221, 36, 118, 0.4)',
                            }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Export PDF
                        </motion.button>
                    </div>
                </div>
            </motion.div>

            {/* Statistics Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="max-w-6xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
            >
                {[
                    { label: 'Total Employees', value: totalEmployees, color: '#667eea', icon: '👥' },
                    { label: 'Present', value: presentCount, color: '#43e97b', icon: '✅' },
                    { label: 'Absent', value: absentCount, color: '#f5576c', icon: '❌' },
                    { label: 'Attendance Rate', value: `${attendanceRate}%`, color: '#f093fb', icon: '📊' },
                ].map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="glass rounded-xl p-6 text-center"
                        style={{
                            background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                            border: `1px solid ${stat.color}30`,
                        }}
                    >
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-gray-400 text-sm">{stat.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Data Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                <div
                    className="glass rounded-2xl overflow-hidden"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
                                    }}
                                >
                                    <th className="px-6 py-4 text-left font-semibold text-white">#</th>
                                    <th className="px-6 py-4 text-left font-semibold text-white">Employee ID</th>
                                    <th className="px-6 py-4 text-left font-semibold text-white">Name</th>
                                    <th className="px-6 py-4 text-center font-semibold text-white">Clock-in</th>
                                    <th className="px-6 py-4 text-center font-semibold text-white">Clock-out</th>
                                    <th className="px-6 py-4 text-center font-semibold text-white">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                                            No attendance records found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((emp, index) => (
                                        <tr
                                            key={index}
                                            className="border-b border-gray-700 border-opacity-30 hover:bg-white hover:bg-opacity-5"
                                        >
                                            <td className="px-6 py-4 text-gray-300">{index + 1}</td>
                                            <td className="px-6 py-4 text-white font-semibold">
                                                {emp.data?.rollNumber || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-white">{emp.data?.name || 'Unknown'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-green-400">{emp.data?.checkin || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-orange-400">{emp.data?.checkout || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`px-3 py-1 rounded-full text-xs font-semibold ${emp.data?.checkout
                                                        ? 'bg-green-500 bg-opacity-20 text-green-400'
                                                        : 'bg-red-500 bg-opacity-20 text-red-400'
                                                        }`}
                                                >
                                                    {emp.data?.checkout ? 'Present' : 'Absent'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Reports;
