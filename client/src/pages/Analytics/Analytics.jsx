import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
    BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { exportToCSV, exportChartAsImage, getStatusColor } from '../../utils/analyticsUtils';

const Analytics = () => {
    const [summary, setSummary] = useState(null);
    const [studentPerformance, setStudentPerformance] = useState([]);
    const [lateArrivals, setLateArrivals] = useState(null);
    const [heatmap, setHeatmap] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_BASE = 'http://localhost:5000/api/analytics';

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            const [summaryRes, performanceRes, lateRes, heatmapRes] = await Promise.all([
                axios.get(`${API_BASE}/summary`),
                axios.get(`${API_BASE}/student-performance`),
                axios.get(`${API_BASE}/late-arrivals`),
                axios.get(`${API_BASE}/heatmap`)
            ]);

            setSummary(summaryRes.data);
            setStudentPerformance(performanceRes.data);
            setLateArrivals(lateRes.data);
            setHeatmap(heatmapRes.data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleExportCSV = () => {
        exportToCSV(studentPerformance, 'student-performance.csv');
    };

    const handleExportChart = (chartId) => {
        exportChartAsImage(chartId, `${chartId}.png`);
    };

    const pieColors = ['#43e97b', '#f5576c'];

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

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
                    Analytics Dashboard
                </h1>
                <p className="text-gray-300 text-lg">Comprehensive attendance insights and trends</p>
            </motion.div>

            {/* Summary Cards */}
            {summary && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-7xl mx-auto mb-8 grid grid-cols-1 md:grid-cols-4 gap-4"
                >
                    {[
                        { label: 'Total Students', value: summary.totalStudents, icon: '👥', color: '#667eea' },
                        { label: 'Present Today', value: summary.presentToday, icon: '✅', color: '#43e97b' },
                        { label: 'Late Arrivals', value: summary.lateArrivals, icon: '⏰', color: '#fee140' },
                        { label: 'Attendance Rate', value: `${summary.attendanceRate}%`, icon: '📊', color: '#f093fb' },
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="glass rounded-xl p-6 text-center"
                            style={{
                                background: `linear-gradient(135deg, ${stat.color}15 0%, ${stat.color}05 100%)`,
                                border: `1px solid ${stat.color}30`,
                            }}
                        >
                            <div className="text-4xl mb-2">{stat.icon}</div>
                            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-gray-400 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Export Buttons */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="max-w-7xl mx-auto mb-6 flex gap-4 justify-end flex-wrap"
            >
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
            </motion.div>

            {/* Charts Grid */}
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Student Performance Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    id="performance-chart"
                    className="glass rounded-2xl p-6"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Student Performance</h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleExportChart('performance-chart')}
                            className="px-4 py-2 rounded-lg text-sm font-semibold text-white"
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            }}
                        >
                            📸 Export
                        </motion.button>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={studentPerformance.slice(0, 10)}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                            <XAxis dataKey="name" stroke="#fff" />
                            <YAxis stroke="#fff" />
                            <Tooltip
                                contentStyle={{
                                    background: 'rgba(0, 0, 0, 0.8)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '8px',
                                    color: '#fff'
                                }}
                            />
                            <Legend />
                            <Bar dataKey="attendancePercentage" fill="#667eea" name="Attendance %" />
                        </BarChart>
                    </ResponsiveContainer>
                </motion.div>

                {/* Late Arrivals Pie Chart and Heatmap */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Pie Chart */}
                    {lateArrivals && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            id="late-arrivals-chart"
                            className="glass rounded-2xl p-6"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(20px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                            }}
                        >
                            <h2 className="text-2xl font-bold text-white mb-6">Arrival Status</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'On Time', value: lateArrivals.onTime },
                                            { name: 'Late', value: lateArrivals.late }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieColors.map((color, index) => (
                                            <Cell key={`cell-${index}`} fill={color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{
                                            background: 'rgba(0, 0, 0, 0.8)',
                                            border: '1px solid rgba(255, 255, 255, 0.2)',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 text-center">
                                <p className="text-gray-300">
                                    <span className="text-green-400 font-bold">{lateArrivals.onTimePercentage}%</span> on time
                                    {' · '}
                                    <span className="text-red-400 font-bold">{lateArrivals.latePercentage}%</span> late
                                </p>
                            </div>
                        </motion.div>
                    )}

                    {/* Heatmap */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="glass rounded-2xl p-6"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Check-in Distribution</h2>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={heatmap}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="label" stroke="#fff" />
                                <YAxis stroke="#fff" />
                                <Tooltip
                                    contentStyle={{
                                        background: 'rgba(0, 0, 0, 0.8)',
                                        border: '1px solid rgba(255, 255, 255, 0.2)',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                />
                                <Bar dataKey="count" fill="#f093fb" name="Check-ins" />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Student Details Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="glass rounded-2xl overflow-hidden"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <div className="p-6 border-b border-gray-700 border-opacity-30">
                        <h2 className="text-2xl font-bold text-white">Detailed Performance</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
                                    }}
                                >
                                    <th className="px-6 py-4 text-left font-semibold text-white">#</th>
                                    <th className="px-6 py-4 text-left font-semibold text-white">Student ID</th>
                                    <th className="px-6 py-4 text-left font-semibold text-white">Name</th>
                                    <th className="px-6 py-4 text-center font-semibold text-white">Check-in</th>
                                    <th className="px-6 py-4 text-center font-semibold text-white">Check-out</th>
                                    <th className="px-6 py-4 text-center font-semibold text-white">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {studentPerformance.map((student, index) => {
                                    const statusColors = getStatusColor(student.status);
                                    return (
                                        <tr
                                            key={student.id}
                                            className="border-b border-gray-700 border-opacity-30 hover:bg-white hover:bg-opacity-5"
                                        >
                                            <td className="px-6 py-4 text-gray-300">{index + 1}</td>
                                            <td className="px-6 py-4 text-white font-semibold">{student.rollNumber}</td>
                                            <td className="px-6 py-4 text-white">{student.name}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-green-400">{student.checkin || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-orange-400">{student.checkout || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className="px-3 py-1 rounded-full text-xs font-semibold"
                                                    style={{
                                                        background: statusColors.bg,
                                                        color: statusColors.text
                                                    }}
                                                >
                                                    {student.status}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics;
