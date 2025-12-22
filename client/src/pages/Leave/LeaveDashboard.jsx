import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const LeaveDashboard = () => {
    const [leaves, setLeaves] = useState([]);

    const fetchLeaves = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/leaves'); // Adjust URL
            setLeaves(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`http://localhost:5000/api/leaves/${id}`, { status });
            toast.success(`Leave request ${status.toLowerCase()}!`);
            fetchLeaves();
        } catch (error) {
            toast.error('Failed to update status.');
        }
    };

    return (
        <div className="min-h-screen pt-24 px-4 pb-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-7xl mx-auto"
            >
                <h1 className="text-4xl font-bold mb-8 text-center text-white gradient-text">Leave Requests</h1>

                <div className="grid gap-6">
                    {leaves.map((leave) => (
                        <motion.div
                            key={leave._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="glass p-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4"
                            style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-white">{leave.name}</h3>
                                    <span className="text-sm text-gray-400">({leave.rollNumber})</span>
                                </div>
                                <p className="text-gray-300 text-sm mb-1">
                                    <span className="font-semibold text-purple-400">Date:</span> {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                                </p>
                                <p className="text-gray-300 text-sm">
                                    <span className="font-semibold text-purple-400">Reason:</span> {leave.reason}
                                </p>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className={`px-4 py-1 rounded-full text-sm font-semibold 
                                    ${leave.status === 'Approved' ? 'bg-green-500/20 text-green-300' :
                                        leave.status === 'Rejected' ? 'bg-red-500/20 text-red-300' :
                                            'bg-yellow-500/20 text-yellow-300'}`}>
                                    {leave.status}
                                </span>

                                {leave.status === 'Pending' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateStatus(leave._id, 'Approved')}
                                            className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => updateStatus(leave._id, 'Rejected')}
                                            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {leaves.length === 0 && (
                        <p className="text-center text-gray-400 mt-8">No leave requests found.</p>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default LeaveDashboard;
