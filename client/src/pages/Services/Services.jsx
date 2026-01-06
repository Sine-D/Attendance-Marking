import React, { useEffect } from 'react';
import { setStudents } from '../../store';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import api from '../../api/axios';

const Services = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { students } = useSelector((state) => state.students);

  const present = students.filter((student) => {
    return student.data.checkout === "";
  });

  const service = [
    {
      title: `Mark Attendance`,
      link: "/add-student",
      button: "Mark",
      icon: "✍️",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      description: "Mark employee attendance"
    },

    {
      title: "View Attendance",
      link: "/attendance",
      button: "View",
      icon: "📊",
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      description: "Check attendance records"
    },
    {
      title: `Total Employees`,
      count: students.length,
      link: "/add-student",
      button: "",
      icon: "👥",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      description: "Registered employees"
    },
    {
      title: `Employees Present Today`,
      count: present.length,
      link: "/add-student",
      button: "",
      icon: "✅",
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      description: "Currently at work"
    }
  ];

  useEffect(() => {
    const getStudent = async () => {
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
    };
    getStudent();
  }, [dispatch]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

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
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <>
      <div className="min-h-screen pt-24 pb-12 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-bold text-5xl md:text-6xl mb-4 gradient-text"
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Attendance Dashboard
          </h1>
          <p className="text-gray-300 text-lg">Manage and monitor employee attendance in real-time</p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {service.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.03,
                transition: { duration: 0.3 }
              }}
              className="glass rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
              }}
              onClick={() => item.button && navigate(item.link)}
            >
              {/* Card Header with Gradient */}
              <div
                className="p-6 relative overflow-hidden"
                style={{
                  background: item.gradient,
                  opacity: 0.9
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="text-5xl"
                    >
                      {item.icon}
                    </motion.div>
                    <div>
                      <h2 className="font-bold text-2xl text-white mb-1">
                        {item.title}
                      </h2>
                      <p className="text-white text-opacity-90 text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Animated Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
                  <motion.div
                    animate={{
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="w-full h-full rounded-full border-4 border-white"
                  />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                {item.count !== undefined ? (
                  <div className="text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                      className="text-6xl font-bold mb-2"
                      style={{
                        background: item.gradient,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      <CountUp
                        end={item.count}
                        duration={2}
                        delay={0.5 + index * 0.1}
                      />
                    </motion.div>
                    <p className="text-gray-300 text-sm uppercase tracking-wider">
                      {item.count === 1 ? 'Student' : 'Students'}
                    </p>
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 rounded-full font-semibold text-white"
                      style={{
                        background: item.gradient,
                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                      }}
                    >
                      {item.button}
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Hover Glow Effect */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                style={{
                  background: `radial-gradient(circle at center, ${item.gradient.split(',')[0].split('(')[1]} 0%, transparent 70%)`,
                  opacity: 0.1
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="max-w-6xl mx-auto mt-12 glass rounded-2xl p-6"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                <CountUp end={present.length} duration={2} delay={1} />
              </div>
              <div className="text-gray-400 text-sm">Present Today</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                <CountUp end={students.length - present.length} duration={2} delay={1.1} />
              </div>
              <div className="text-gray-400 text-sm">Absent Today</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-1">
                <CountUp
                  end={students.length > 0 ? Math.round((present.length / students.length) * 100) : 0}
                  duration={2}
                  delay={1.2}
                  suffix="%"
                />
              </div>
              <div className="text-gray-400 text-sm">Attendance Rate</div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Services;