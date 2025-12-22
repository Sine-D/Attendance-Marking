import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
    let Links = [
        { name: "Home", link: "/" },

        { name: "Reports", link: "/reports" },
        { name: "Analytics", link: "/analytics" },
        { name: "Calendar", link: "/calendar" },
        { name: "HR Assistant", link: "/hr-assistant" },
        { name: "View Attendance", link: "/attendance" },
        { name: "Mark Attendance", link: "/add-student" },
    ];

    let [open, setOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const isActive = (path) => location.pathname === path;

    const navbarVariants = {
        hidden: { y: -100 },
        visible: {
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 20
            }
        }
    };

    return (
        <motion.nav
            initial="hidden"
            animate="visible"
            variants={navbarVariants}
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'
                }`}
        >
            <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{
                    background: scrolled ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(16px)',
                    WebkitBackdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                    boxShadow: scrolled ? '0 4px 30px rgba(0, 0, 0, 0.1)' : 'none'
                }}
            />

            <div className='relative md:flex items-center justify-between px-6 md:px-10 max-w-7xl mx-auto'>
                {/* Logo Section */}
                <div className='font-bold text-2xl cursor-pointer flex items-center font-[Poppins]'>
                    <span className='w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center mr-2 shadow-lg shadow-blue-500/30'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </span>
                    <span className='text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400'>
                        AttendEase
                    </span>
                </div>

                {/* Mobile Menu Button */}
                <div onClick={() => setOpen(!open)} className='text-3xl absolute right-6 top-1 cursor-pointer md:hidden'>
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg text-white"
                    >
                        <AnimatePresence mode="wait">
                            {open ? (
                                <motion.svg
                                    key="close"
                                    initial={{ rotate: -90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: 90, opacity: 0 }}
                                    className="w-8 h-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </motion.svg>
                            ) : (
                                <motion.svg
                                    key="menu"
                                    initial={{ rotate: 90, opacity: 0 }}
                                    animate={{ rotate: 0, opacity: 1 }}
                                    exit={{ rotate: -90, opacity: 0 }}
                                    className="w-8 h-8"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </motion.svg>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                {/* Desktop & Mobile Menu */}
                <AnimatePresence>
                    <motion.ul
                        className={`md:flex md:items-center md:pb-0 pb-8 absolute md:static md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-0 transition-all duration-500 ease-in-out ${open ? 'top-16 opacity-100 visible' : 'top-[-490px] md:opacity-100 opacity-0 invisible md:visible'
                            }`}
                        style={{
                            background: open ? 'rgb(15 23 42 / 0.95)' : 'transparent',
                            backdropFilter: open ? 'blur(20px)' : 'none',
                        }}
                    >
                        {Links.map((link, index) => (
                            <motion.li
                                key={link.name}
                                className='md:ml-4 text-sm font-medium md:my-0 my-6 text-left pl-8 md:pl-0'
                                initial={false}
                                animate={open ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
                            >
                                <Link
                                    to={link.link}
                                    onClick={() => setOpen(false)}
                                    className={`relative px-4 py-2 rounded-xl transition-all duration-300 inline-block group w-full md:w-auto ${isActive(link.link) ? 'text-white' : 'text-slate-300 hover:text-white'
                                        }`}
                                >
                                    {isActive(link.link) && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        >
                                            <div className="absolute inset-0 rounded-xl border border-blue-500/30" />
                                        </motion.div>
                                    )}

                                    <span className="relative z-10">{link.name}</span>

                                    <div className={`absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${isActive(link.link) ? 'scale-x-100' : ''}`} />
                                </Link>
                            </motion.li>
                        ))}
                    </motion.ul>
                </AnimatePresence>
            </div>
        </motion.nav>
    );
};

export default Navbar;