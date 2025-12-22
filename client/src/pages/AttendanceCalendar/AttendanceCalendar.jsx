import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import './AttendanceCalendar.css'; // We will create this for custom styling

const AttendanceCalendar = () => {
    const [date, setDate] = useState(new Date());
    const [attendanceData, setAttendanceData] = useState({});
    const [selectedDateStudents, setSelectedDateStudents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalyticsData();
    }, []);

    const fetchAnalyticsData = async () => {
        try {
            const response = await api.get('/');
            // Group students by date
            // Assuming response.data is an array of student records with createdAt or checkin time
            // However, the current API structure seems to return current status or all students?
            // Let's assume for now we fetch all records. If the API only returns current day, we might need a different endpoint 
            // or we process what we have. 
            // Based on previous files, GET / returns all students. Let's assume they have a date field or we use createdAt.

            // Note: The current simple backend might purely be "today's attendance". 
            // If historical data isn't persisted securely with dates, this might be limited.
            // But let's build the UI assuming we can group by `createdAt` or `updatedAt`.

            const data = response.data;
            const grouped = {};

            data.forEach(record => {
                const recordDate = new Date(record.createdAt).toDateString(); // Group by date string
                if (!grouped[recordDate]) {
                    grouped[recordDate] = [];
                }
                grouped[recordDate].push(record);
            });

            setAttendanceData(grouped);
        } catch (error) {
            console.error("Error fetching attendance:", error);
            toast.error("Failed to load attendance data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const handleDateClick = (value) => {
        setDate(value);
        const dateString = value.toDateString();
        const students = attendanceData[dateString] || [];
        setSelectedDateStudents(students);
        setShowModal(true);
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateString = date.toDateString();
            const count = attendanceData[dateString]?.length || 0;

            if (count > 0) {
                return (
                    <div className="flex justify-center flex-col items-center mt-1">
                        <div className="w-2 h-2 rounded-full bg-green-400 mb-1"></div>
                        <span className="text-xs text-gray-300">{count} Present</span>
                    </div>
                );
            }
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 w-full">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl mx-auto"
            >
                <h1 className="text-4xl font-bold text-center mb-10 gradient-text"
                    style={{
                        background: 'linear-gradient(135deg, #A18CD1 0%, #FBC2EB 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Attendance Calendar
                </h1>

                <div className="glass p-8 rounded-2xl shadow-2xl relative z-10"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <Calendar
                        onChange={setDate}
                        value={date}
                        onClickDay={handleDateClick}
                        tileContent={tileContent}
                        className="custom-calendar w-full border-none bg-transparent text-white"
                        tileClassName="rounded-lg hover:bg-white/10 transition-colors p-2"
                    />
                </div>
            </motion.div>

            {/* Modal for Details */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowModal(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {format(date, 'MMMM d, yyyy')}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            {selectedDateStudents.length > 0 ? (
                                <div className="space-y-4">
                                    {selectedDateStudents.map((student, idx) => (
                                        <div key={idx} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-800 border border-gray-700">
                                            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300 font-bold border border-purple-500/30">
                                                {student.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-white font-semibold">{student.name}</p>
                                                <p className="text-sm text-gray-400">ID: {student.rollNumber}</p>
                                            </div>
                                            <div className="ml-auto text-right text-xs text-gray-400">
                                                <p>In: {student.checkin}</p>
                                                <p>Out: {student.checkout || 'Active'}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-gray-500">
                                    <p>No attendance records for this date.</p>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AttendanceCalendar;
