import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AnimatedBackground from '../../components/AnimatedBackground';

const Home = () => {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50 }
    }
  };

  const features = [
    {
      title: "Real-time Tracking",
      description: "Monitor employee attendance instantly with precision and ease.",
      icon: "⏱️",
      color: "from-blue-500 to-cyan-400",
      link: "/attendance"
    },
    {
      title: "Smart Analytics",
      description: "Gain insights with comprehensive reports and visual data.",
      icon: "📊",
      color: "from-purple-500 to-pink-400",
      link: "/reports"
    },
    {
      title: "Leave Management",
      description: "Streamline leave requests and approvals with ease.",
      icon: "📝",
      color: "from-orange-500 to-yellow-400",
      link: "/hr-assistant"
    }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AnimatedBackground showSpheres={true} />

      <div className="relative z-10 pt-32 pb-20 px-4 md:px-10 max-w-7xl mx-auto flex flex-col items-center">

        {/* Hero Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-4xl mx-auto mb-20 w-full"
        >
          <motion.div
            variants={itemVariants}
            className="inline-block px-4 py-1 mb-6 rounded-full border border-blue-400/30 bg-blue-500/10 backdrop-blur-md"
          >
            <span className="text-blue-300 font-medium text-sm tracking-wide">NEXT GEN ATTENDANCE SYSTEM</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-8xl font-black mb-8 tracking-tight"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400">
              Effortless
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Management
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Streamline your workforce management with AttendEase.
            Experience the future of attendance tracking with real-time insights and seamless integration.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all border border-white/10"
            >
              Get Started Now
            </motion.button>


          </motion.div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              onClick={() => navigate(feature.link)}
              className="p-8 rounded-3xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all group relative overflow-hidden cursor-pointer"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />

              <div className="text-5xl mb-6 bg-white/10 w-20 h-20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-inner">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </div>
  );
};

export default Home;