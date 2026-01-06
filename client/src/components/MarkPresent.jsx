import React, { useState } from 'react';
import { useDispatch } from "react-redux";
import { motion } from 'framer-motion';
import api from '../api/axios';
import { setStudents } from '../store';
import showAlert from '../utils/swal';

const MarkPresent = () => {
    const [rollNumber, setRollNumber] = useState('');
    const [name, setName] = useState('');
    const [isFocusedName, setIsFocusedName] = useState(false);
    const [isFocusedRoll, setIsFocusedRoll] = useState(false);
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (name === "" || rollNumber === "") {
            showAlert("Empty Fields", "All the Fields are required!", "warning");
        } else {
            try {
                // Add student to MongoDB
                const response = await api.post('/', {
                    rollNumber,
                    name,
                    checkin: new Date().toLocaleTimeString(),
                    checkout: ""
                });
                console.log(response.data);

                setRollNumber('');
                setName('');

                // Fetch updated data from MongoDB
                const studentsResponse = await api.get('/');
                const studentData = studentsResponse.data.map(doc => ({
                    data: doc,
                    id: doc._id
                }));

                dispatch(setStudents(studentData));
                showAlert("Attendance Marked", `${name}'s Attendance is Marked`, "success");
            } catch (error) {
                showAlert("Error!", error.message, "error");
                console.log(error);
            }
        }
    };

    return (
        <>
            <div className="flex justify-center min-h-screen items-center flex-wrap px-4 pt-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    {/* Title */}
                    <motion.h1
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl font-bold mb-8 text-center gradient-text"
                        style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Mark Attendance
                    </motion.h1>

                    {/* Form Card */}
                    <motion.form
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass rounded-2xl p-8 shadow-2xl"
                        style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                        }}
                        method="POST"
                        autoComplete="off"
                        onSubmit={handleSubmit}
                    >
                        {/* Student Name Input */}
                        <div className="mb-6 relative">
                            <motion.label
                                className={`absolute left-4 transition-all duration-300 pointer-events-none ${isFocusedName || name
                                    ? 'text-xs -top-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 rounded'
                                    : 'text-base top-3 text-gray-400'
                                    }`}
                                htmlFor="username"
                            >
                                Employee Full Name
                            </motion.label>
                            <input
                                className="w-full py-3 px-4 rounded-lg text-white transition-all duration-300 focus:outline-none"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: isFocusedName
                                        ? '2px solid #667eea'
                                        : '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: isFocusedName ? '0 0 20px rgba(102, 126, 234, 0.3)' : 'none',
                                }}
                                id="username"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onFocus={() => setIsFocusedName(true)}
                                onBlur={() => setIsFocusedName(false)}
                            />
                        </div>

                        {/* Roll Number Input */}
                        <div className="mb-8 relative">
                            <motion.label
                                className={`absolute left-4 transition-all duration-300 pointer-events-none ${isFocusedRoll || rollNumber
                                    ? 'text-xs -top-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 rounded'
                                    : 'text-base top-3 text-gray-400'
                                    }`}
                                htmlFor="rollNumber"
                            >
                                Employee ID
                            </motion.label>
                            <input
                                className="w-full py-3 px-4 rounded-lg text-white transition-all duration-300 focus:outline-none"
                                style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: isFocusedRoll
                                        ? '2px solid #667eea'
                                        : '1px solid rgba(255, 255, 255, 0.1)',
                                    boxShadow: isFocusedRoll ? '0 0 20px rgba(102, 126, 234, 0.3)' : 'none',
                                }}
                                id="rollNumber"
                                type="text"
                                value={rollNumber}
                                onChange={(e) => setRollNumber(e.target.value)}
                                onFocus={() => setIsFocusedRoll(true)}
                                onBlur={() => setIsFocusedRoll(false)}
                            />
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(102, 126, 234, 0.6)' }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full py-4 rounded-full font-bold text-lg text-white relative overflow-hidden"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                                }}
                                type="submit"
                            >
                                <span className="relative z-10">Mark Present</span>
                            </motion.button>
                        </div>

                        {/* Info Text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                            className="text-center text-gray-400 text-sm mt-6"
                        >
                            Enter employee details to mark attendance
                        </motion.p>
                    </motion.form>
                </motion.div>
            </div>
        </>
    );
};

export default MarkPresent;
