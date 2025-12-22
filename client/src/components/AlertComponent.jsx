import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { setAlertBox } from "../store";
import { useCallback, useEffect } from "react";

const AlertComponent = () => {
    const { message, color, show, title } = useSelector((state) => state.students.alertBox);
    const dispatch = useDispatch();

    const handleClose = useCallback(() => {
        dispatch(setAlertBox({ title: "", message: "", color: "teal", show: false }));
    }, [dispatch]);

    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                handleClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, handleClose]);

    const colorMap = {
        teal: {
            bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            border: 'rgba(67, 233, 123, 0.5)'
        },
        orange: {
            bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            border: 'rgba(250, 112, 154, 0.5)'
        },
        red: {
            bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            border: 'rgba(240, 147, 251, 0.5)'
        }
    };

    const currentColor = colorMap[color] || colorMap.teal;

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -100, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -100, scale: 0.9 }}
                    transition={{ duration: 0.4, type: "spring" }}
                    className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
                >
                    <div
                        className="glass rounded-2xl p-6 shadow-2xl relative overflow-hidden"
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: `2px solid ${currentColor.border}`,
                        }}
                    >
                        {/* Gradient Background */}
                        <div
                            className="absolute inset-0 opacity-20"
                            style={{
                                background: currentColor.bg,
                            }}
                        />

                        {/* Content */}
                        <div className="relative z-10">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <strong className="font-bold text-xl text-white block mb-2">
                                        {title}
                                    </strong>
                                    <span className="text-gray-200 text-sm">
                                        {message}
                                    </span>
                                </div>

                                {/* Close Button */}
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={handleClose}
                                    className="ml-4 p-2 rounded-full"
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                    }}
                                >
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </motion.button>
                            </div>

                            {/* Progress Bar */}
                            <motion.div
                                className="mt-4 h-1 rounded-full"
                                style={{
                                    background: currentColor.bg,
                                }}
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 5, ease: "linear" }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AlertComponent;