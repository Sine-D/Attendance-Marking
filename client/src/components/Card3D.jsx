import React from 'react';
import { motion } from 'framer-motion';

const Card3D = ({
    children,
    className = '',
    gradient = false,
    glassEffect = true,
    hoverLift = true,
    delay = 0
}) => {
    const cardVariants = {
        hidden: {
            opacity: 0,
            y: 50,
            scale: 0.9
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                delay: delay,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    const hoverVariants = hoverLift ? {
        scale: 1.05,
        y: -10,
        transition: {
            duration: 0.3,
            ease: 'easeOut'
        }
    } : {};

    const baseClasses = glassEffect
        ? 'glass rounded-xl p-6 shadow-lg'
        : 'bg-white bg-opacity-10 rounded-xl p-6 shadow-lg';

    const gradientBorder = gradient
        ? 'relative before:absolute before:inset-0 before:rounded-xl before:p-[2px] before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:-z-10'
        : '';

    return (
        <motion.div
            className={`${baseClasses} ${gradientBorder} ${className} transform-3d`}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover={hoverVariants}
            style={{
                backdropFilter: glassEffect ? 'blur(10px)' : 'none',
                WebkitBackdropFilter: glassEffect ? 'blur(10px)' : 'none',
            }}
        >
            {children}
        </motion.div>
    );
};

export default Card3D;
