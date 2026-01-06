import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import showAlert from '../../utils/swal';
import axios from 'axios';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line
} from 'recharts';

const ApplyLeave = () => {
    const [activeTab, setActiveTab] = useState('apply'); // 'apply', 'manage', 'reports'
    const [leaves, setLeaves] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [editingId, setEditingId] = useState(null);
    const [lastActionTime, setLastActionTime] = useState(0);
    const [formData, setFormData] = useState({
        rollNumber: '',
        name: '',
        startDate: '',
        endDate: '',
        reason: ''
    });

    // Fetch leaves when switching to manage or reports tab
    const fetchLeaves = React.useCallback(async () => {
        // Prevent fetching if we just performed a local update
        if (Date.now() - lastActionTime < 2000) return;

        try {
            const response = await axios.get(`http://localhost:5000/api/leaves?t=${Date.now()}`);
            setLeaves(response.data);
        } catch (error) {
            console.error(error);
            showAlert('Error', 'Failed to fetch leave records', 'error');
        }
    }, [lastActionTime]);

    useEffect(() => {
        if (activeTab === 'manage' || activeTab === 'reports') {
            fetchLeaves();
        }
    }, [activeTab, fetchLeaves]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                // Update existing leave
                // Ensure all fields are sent
                console.log('Updating leave', editingId, 'with data:', formData);
                const res = await axios.put(`http://localhost:5000/api/leaves/${editingId}`, {
                    ...formData,
                });

                // Update local state immediately with authoritative server response
                setLeaves(prev => prev.map(leave =>
                    leave._id === editingId ? { ...leave, ...res.data } : leave
                ));

                setLastActionTime(Date.now());
                showAlert('Success', 'Leave updated successfully!', 'success');
                setEditingId(null);
            } else {
                // Create new leave
                await axios.post('http://localhost:5000/api/leaves', formData);
                showAlert('Success', 'Leave application submitted successfully!', 'success');
            }

            // Reset form
            setFormData({
                rollNumber: '',
                name: '',
                startDate: '',
                endDate: '',
                reason: ''
            });

            // Switch to manage view to see changes and trigger fetch via useEffect
            setActiveTab('manage');

        } catch (error) {
            showAlert('Error', editingId ? 'Failed to update leave.' : 'Failed to submit leave application.', 'error');
            console.error(error);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/leaves/${id}`, { status });
            showAlert('Success', `Leave ${status} successfully`, 'success');
            fetchLeaves(); // Refresh list immediately
        } catch (error) {
            showAlert('Error', `Failed to ${status} leave`, 'error');
            console.error(error);
        }
    };

    const handleEdit = (leave) => {
        setFormData({
            rollNumber: leave.rollNumber,
            name: leave.name,
            startDate: leave.startDate.split('T')[0],
            endDate: leave.endDate.split('T')[0],
            reason: leave.reason
        });
        setEditingId(leave._id);
        setActiveTab('apply');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({
            rollNumber: '',
            name: '',
            startDate: '',
            endDate: '',
            reason: ''
        });
    };

    // Analytics Data Calculation
    const analyticsData = useMemo(() => {
        if (!leaves.length) return { statusData: [], personData: [], weeklyData: [], monthlyReport: [] };

        // Helper to calculate days between dates (inclusive)
        const calculateDuration = (start, end) => {
            const startDate = new Date(start);
            const endDate = new Date(end);
            const diffTime = Math.abs(endDate - startDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
            return diffDays > 0 ? diffDays : 1;
        };

        // 4. Monthly Report Data
        const monthlyReport = [];
        if (selectedMonth) {
            const filteredLeaves = leaves.filter(leave => {
                const leaveDate = new Date(leave.startDate);
                const leaveMonth = leaveDate.toISOString().slice(0, 7);
                return leaveMonth === selectedMonth;
            });

            const employeeMap = {};
            filteredLeaves.forEach(leave => {
                const duration = calculateDuration(leave.startDate, leave.endDate);

                if (!employeeMap[leave.name]) {
                    employeeMap[leave.name] = {
                        name: leave.name,
                        rollNumber: leave.rollNumber,
                        count: 0,
                        approved: 0,
                        rejected: 0,
                        pending: 0
                    };
                }

                // Accumulate duration instead of count
                employeeMap[leave.name].count += duration;

                if (leave.status === 'Approved') employeeMap[leave.name].approved += duration;
                else if (leave.status === 'Rejected') employeeMap[leave.name].rejected += duration;
                else employeeMap[leave.name].pending += duration;
            });

            monthlyReport.push(...Object.values(employeeMap));
        }

        // 1. Status Distribution
        const statusCounts = leaves.reduce((acc, leave) => {
            const duration = calculateDuration(leave.startDate, leave.endDate);
            acc[leave.status] = (acc[leave.status] || 0) + duration;
            return acc;
        }, {});
        const statusData = Object.keys(statusCounts).map(status => ({
            name: status,
            value: statusCounts[status],
            color: status === 'Approved' ? '#4ade80' : status === 'Rejected' ? '#f87171' : '#facc15'
        }));

        // 2. Leaves by Person
        const personCounts = leaves.reduce((acc, leave) => {
            const duration = calculateDuration(leave.startDate, leave.endDate);
            acc[leave.name] = (acc[leave.name] || 0) + duration;
            return acc;
        }, {});
        const personData = Object.keys(personCounts).map(name => ({
            name,
            count: personCounts[name]
        }));

        // 3. Weekly Trends (Grouping by Week Start Date)
        const weeklyCounts = leaves.reduce((acc, leave) => {
            const duration = calculateDuration(leave.startDate, leave.endDate);
            const date = new Date(leave.startDate);
            // Get start of week (Sunday)
            const day = date.getDay();
            const diff = date.getDate() - day; // adjust when day is sunday
            const weekStart = new Date(date.setDate(diff)).toLocaleDateString();

            acc[weekStart] = (acc[weekStart] || 0) + duration;
            return acc;
        }, {});
        const weeklyData = Object.keys(weeklyCounts).map(date => ({
            date,
            leaves: weeklyCounts[date]
        })).sort((a, b) => new Date(a.date) - new Date(b.date));

        return { statusData, personData, weeklyData, monthlyReport };
    }, [leaves, selectedMonth]);

    return (
        <div className="min-h-screen pt-24 px-4 pb-12 flex flex-col items-center">

            {/* Tabs */}
            <div className="flex space-x-2 md:space-x-4 mb-8 bg-white/5 p-1 rounded-xl backdrop-blur-md border border-white/10 overflow-x-auto max-w-full">
                <button
                    onClick={() => { setActiveTab('apply'); if (!editingId) handleCancelEdit(); }}
                    className={`px-4 md:px-6 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${activeTab === 'apply'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    {editingId ? 'Edit Valid Leave' : 'Apply Leave'}
                </button>
                <button
                    onClick={() => setActiveTab('manage')}
                    className={`px-4 md:px-6 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${activeTab === 'manage'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Manage Leaves
                </button>
                <button
                    onClick={() => setActiveTab('reports')}
                    className={`px-4 md:px-6 py-2 rounded-lg font-medium transition-all duration-300 whitespace-nowrap ${activeTab === 'reports'
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                        }`}
                >
                    Reports & Charts
                </button>
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'apply' && (
                    <motion.div
                        key="apply"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="max-w-2xl w-full glass p-8 rounded-2xl shadow-2xl relative"
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-3xl font-bold text-white">
                                {editingId ? 'Edit Leave Request' : 'HR Assistant - Apply Leave'}
                            </h2>
                            {editingId && (
                                <button
                                    onClick={handleCancelEdit}
                                    className="text-sm text-gray-400 hover:text-white underline"
                                >
                                    Cancel Edit
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-300 mb-2">Roll Number</label>
                                    <input
                                        type="text"
                                        name="rollNumber"
                                        value={formData.rollNumber}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter your Roll No"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                        placeholder="Enter your Name"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-gray-300 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-gray-300 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-300 mb-2">Reason</label>
                                <textarea
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    placeholder="Reason for leave..."
                                ></textarea>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                className="w-full py-3 rounded-lg font-bold text-white shadow-lg"
                                style={{
                                    background: editingId
                                        ? 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)'
                                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                }}
                            >
                                {editingId ? 'Update Leave' : 'Submit Application'}
                            </motion.button>
                        </form>
                    </motion.div>
                )}

                {activeTab === 'manage' && (
                    <motion.div
                        key="manage"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-6xl w-full space-y-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {leaves.map((leave) => (
                                <motion.div
                                    key={leave._id}
                                    layout
                                    className="glass p-6 rounded-xl relative overflow-hidden group"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        backdropFilter: 'blur(10px)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)'
                                    }}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{leave.name}</h3>
                                            <p className="text-gray-400 text-sm">{leave.rollNumber}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${leave.status === 'Approved' ? 'bg-green-500/20 text-green-400' :
                                                leave.status === 'Rejected' ? 'bg-red-500/20 text-red-400' :
                                                    'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {leave.status}
                                            </span>

                                            <button
                                                onClick={() => handleEdit(leave)}
                                                className="text-xs text-blue-300 hover:text-blue-200 underline"
                                            >
                                                Edit
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">From:</span>
                                            <span className="text-white">{new Date(leave.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-400">To:</span>
                                            <span className="text-white">{new Date(leave.endDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="mt-4 p-3 rounded-lg bg-white/5 text-sm text-gray-300">
                                            {leave.reason}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateStatus(leave._id, 'Approved')}
                                            className="flex-1 py-2 rounded-lg bg-green-600/20 text-green-400 hover:bg-green-600/30 transition-colors text-sm font-semibold disabled:opacity-50"
                                            disabled={leave.status === 'Approved'}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(leave._id, 'Rejected')}
                                            className="flex-1 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors text-sm font-semibold disabled:opacity-50"
                                            disabled={leave.status === 'Rejected'}
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {leaves.length === 0 && (
                            <div className="text-center text-gray-400 py-20">
                                No leave requests found.
                            </div>
                        )}
                    </motion.div>
                )}

                {activeTab === 'reports' && (
                    <motion.div
                        key="reports"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {/* Monthly Report Section */}
                        <div className="glass p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-white mb-4 md:mb-0">Monthly Report</h3>
                                <div className="flex items-center space-x-4">
                                    <label className="text-gray-300">Select Month:</label>
                                    <input
                                        type="month"
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-white">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="py-3 px-4">Employee Name</th>
                                            <th className="py-3 px-4">Roll Number</th>
                                            <th className="py-3 px-4 text-center">Total Requests</th>
                                            <th className="py-3 px-4 text-center text-green-400">Approved</th>
                                            <th className="py-3 px-4 text-center text-red-400">Rejected</th>
                                            <th className="py-3 px-4 text-center text-yellow-400">Pending</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {analyticsData.monthlyReport.length > 0 ? (
                                            analyticsData.monthlyReport.map((row, index) => (
                                                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-3 px-4">{row.name}</td>
                                                    <td className="py-3 px-4">{row.rollNumber}</td>
                                                    <td className="py-3 px-4 text-center font-bold">{row.count}</td>
                                                    <td className="py-3 px-4 text-center text-green-400">{row.approved}</td>
                                                    <td className="py-3 px-4 text-center text-red-400">{row.rejected}</td>
                                                    <td className="py-3 px-4 text-center text-yellow-400">{row.pending}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="py-8 text-center text-gray-400">
                                                    No leave records found for {selectedMonth}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Leaves by Person */}
                        <div className="glass p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <h3 className="text-xl font-bold text-white mb-4">Leaves by Student</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={analyticsData.personData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis dataKey="name" stroke="#ffffff80" />
                                    <YAxis stroke="#ffffff80" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                    <Bar dataKey="count" fill="#8884d8" name="Leaves" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Status Distribution */}
                        <div className="glass p-6 rounded-2xl" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <h3 className="text-xl font-bold text-white mb-4">Status Distribution</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={analyticsData.statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {analyticsData.statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Weekly Trends */}
                        <div className="glass p-6 rounded-2xl md:col-span-2" style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <h3 className="text-xl font-bold text-white mb-4">Weekly Leave Trends</h3>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={analyticsData.weeklyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                                    <XAxis dataKey="date" stroke="#ffffff80" />
                                    <YAxis stroke="#ffffff80" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                    <Line type="monotone" dataKey="leaves" stroke="#f472b6" strokeWidth={3} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ApplyLeave;
