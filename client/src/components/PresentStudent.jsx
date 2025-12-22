import React, { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import api from '../api/axios';
import { useSelector, useDispatch } from 'react-redux';
import { setStudents } from '../store';
import { motion } from 'framer-motion';
import AlertComponent from "./AlertComponent";
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PresentStudent = () => {
    const { students } = useSelector((state) => state.students);
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredStudents = students.filter(student =>
        student.data.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.data.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStudent = useCallback(async () => {
        try {
            const response = await api.get('/');
            const student = response.data.map(doc => ({
                data: doc,
                id: doc._id
            }));
            dispatch(setStudents(student));
        } catch (error) {
            console.log(error);
        }
    }, [dispatch]);

    useEffect(() => {
        getStudent();
    }, [getStudent]);

    const [editingId, setEditingId] = useState(null);
    const [manualTime, setManualTime] = useState("");

    const handleCheckout = async (id, name) => {
        if (!manualTime) {
            toast.error("Please enter a checkout time");
            return;
        }
        try {
            await api.put(`/${id}`, {
                checkout: manualTime
            });
            toast.success(`${name} checked-out successfully!`);
            setEditingId(null);
            setManualTime("");
            getStudent();
        } catch (error) {
            toast.error(error.message);
            console.log(error);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Employees at Work Today", 20, 10);

        const tableColumn = ["Sr. No.", "Employee Name", "ID", "Clock-in", "Clock-out"];
        const tableRows = [];

        filteredStudents.forEach((student, index) => {
            const studentData = [
                index + 1,
                student.data.name,
                student.data.rollNumber,
                student.data.checkin,
                student.data.checkout || "Present"
            ];
            tableRows.push(studentData);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("attendance_report.pdf");
        toast.success("PDF exported successfully!");
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const rowVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3
            }
        }
    };

    return (
        <>
            <AlertComponent />
            <div className='w-full pt-24 pb-12 px-4 min-h-screen'>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <h1 className='text-4xl md:text-5xl font-bold mb-3 gradient-text'
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Employees at Work Today
                    </h1>
                    <p className="text-gray-300 text-lg">
                        {students.filter(s => !s.data.checkout).length} employees currently present
                    </p>

                    {/* Controls Container */}
                    <div className="mt-8 max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
                        {/* Search Bar */}
                        <div className="relative w-full max-w-md">
                            <input
                                type="text"
                                placeholder="Search by Name or ID..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-6 py-3 rounded-full text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                            <span className="absolute right-4 top-3 text-2xl">🔍</span>
                        </div>

                        {/* PDF Export Button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={exportToPDF}
                            className="px-6 py-3 rounded-full font-semibold text-white flex items-center gap-2"
                            style={{
                                background: 'linear-gradient(135deg, #FF512F 0%, #DD2476 100%)',
                                boxShadow: '0 4px 15px rgba(221, 36, 118, 0.3)'
                            }}
                        >
                            <span>📥</span> Export PDF
                        </motion.button>
                    </div>
                </motion.div>

                {/* Table Container */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-7xl mx-auto glass rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr
                                    className="text-white"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
                                    }}
                                >
                                    <th className="px-6 py-4 text-left font-semibold">Sr. No.</th>
                                    <th className="px-6 py-4 text-left font-semibold">Employee</th>
                                    <th className="px-6 py-4 text-center font-semibold">Clock-in Time</th>
                                    <th className="px-6 py-4 text-center font-semibold">Clock-out Time</th>
                                </tr>
                            </thead>
                            <motion.tbody
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {filteredStudents.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                                            <div className="flex flex-col items-center">
                                                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                                </svg>
                                                <p className="text-lg">No employees present today</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredStudents.map((student, index) => (
                                        <motion.tr
                                            key={index}
                                            variants={rowVariants}
                                            className="border-b border-gray-700 border-opacity-30 hover:bg-white hover:bg-opacity-5 transition-all duration-300"
                                            whileHover={{
                                                scale: 1.01,
                                                boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)'
                                            }}
                                        >
                                            <td className="px-6 py-4 text-gray-300">{index + 1}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500">
                                                        <img
                                                            src={student.data.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(student.data.name)}&background=random`}
                                                            alt={student.data.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white text-lg">{student.data.name}</div>
                                                        <div className="text-sm text-gray-400 text-opacity-80">ID: {student.data.rollNumber}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <motion.span
                                                    whileHover={{ scale: 1.05 }}
                                                    className="inline-block px-4 py-2 rounded-full font-semibold text-white text-sm"
                                                    style={{
                                                        background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                                                        boxShadow: '0 2px 10px rgba(67, 233, 123, 0.3)'
                                                    }}
                                                >
                                                    {student.data.checkin}
                                                </motion.span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {student.data.checkout ? (
                                                    <motion.span
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        className="inline-block px-4 py-2 rounded-full font-semibold text-white text-sm"
                                                        style={{
                                                            background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                                                            boxShadow: '0 2px 10px rgba(250, 112, 154, 0.3)'
                                                        }}
                                                    >
                                                        {student.data.checkout}
                                                    </motion.span>
                                                ) : (
                                                    <>
                                                        {editingId === student.id ? (
                                                            <div className="flex items-center space-x-2">
                                                                <input
                                                                    type="text"
                                                                    value={manualTime}
                                                                    onChange={(e) => setManualTime(e.target.value)}
                                                                    className="w-24 px-2 py-1 rounded text-black outline-none"
                                                                    placeholder="Time"
                                                                    autoFocus
                                                                />
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => handleCheckout(student.id, student.data.name)}
                                                                    className="p-1 rounded-full bg-green-500 text-white"
                                                                >
                                                                    ✓
                                                                </motion.button>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.1 }}
                                                                    whileTap={{ scale: 0.9 }}
                                                                    onClick={() => {
                                                                        setEditingId(null);
                                                                        setManualTime("");
                                                                    }}
                                                                    className="p-1 rounded-full bg-red-500 text-white"
                                                                >
                                                                    ✕
                                                                </motion.button>
                                                            </div>
                                                        ) : (
                                                            <motion.button
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                className="px-6 py-2 rounded-full font-semibold text-white text-sm"
                                                                style={{
                                                                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                                                    boxShadow: '0 2px 10px rgba(240, 147, 251, 0.3)'
                                                                }}
                                                                onClick={() => {
                                                                    setEditingId(student.id);
                                                                    setManualTime(new Date().toLocaleTimeString());
                                                                }}
                                                            >
                                                                Leave Work
                                                            </motion.button>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </motion.tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Summary Stats */}
                {students.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        <div className="glass rounded-xl p-4 text-center"
                            style={{
                                background: 'rgba(67, 233, 123, 0.1)',
                                border: '1px solid rgba(67, 233, 123, 0.2)',
                            }}
                        >
                            <div className="text-3xl font-bold text-white mb-1">
                                {students.filter(s => !s.data.checkout).length}
                            </div>
                            <div className="text-green-300 text-sm">Currently Present</div>
                        </div>
                        <div className="glass rounded-xl p-4 text-center"
                            style={{
                                background: 'rgba(250, 112, 154, 0.1)',
                                border: '1px solid rgba(250, 112, 154, 0.2)',
                            }}
                        >
                            <div className="text-3xl font-bold text-white mb-1">
                                {students.filter(s => s.data.checkout).length}
                            </div>
                            <div className="text-pink-300 text-sm">Already Left</div>
                        </div>
                        <div className="glass rounded-xl p-4 text-center"
                            style={{
                                background: 'rgba(102, 126, 234, 0.1)',
                                border: '1px solid rgba(102, 126, 234, 0.2)',
                            }}
                        >
                            <div className="text-3xl font-bold text-white mb-1">
                                {students.length}
                            </div>
                            <div className="text-purple-300 text-sm">Total Today</div>
                        </div>
                    </motion.div>
                )}
            </div>
        </>
    );
};

export default PresentStudent;
