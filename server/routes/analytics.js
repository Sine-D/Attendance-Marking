const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// Helper function to parse time string to minutes since midnight
const timeToMinutes = (timeString) => {
    if (!timeString) return null;
    const [time, period] = timeString.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    
    return hours * 60 + minutes;
};

// Helper function to check if arrival is late (after 9:00 AM)
const isLateArrival = (checkinTime) => {
    const checkinMinutes = timeToMinutes(checkinTime);
    const standardStartTime = 9 * 60; // 9:00 AM in minutes
    return checkinMinutes !== null && checkinMinutes > standardStartTime;
};

// GET /api/analytics/summary - Overall attendance summary
router.get('/summary', async (req, res) => {
    try {
        const students = await Student.find();
        
        const totalStudents = students.length;
        const presentToday = students.filter(s => s.checkin && s.checkin !== '').length;
        const checkedOut = students.filter(s => s.checkout && s.checkout !== '').length;
        const lateArrivals = students.filter(s => s.checkin && isLateArrival(s.checkin)).length;
        
        const attendanceRate = totalStudents > 0 
            ? ((presentToday / totalStudents) * 100).toFixed(1) 
            : 0;
        
        res.json({
            totalStudents,
            presentToday,
            checkedOut,
            lateArrivals,
            attendanceRate: parseFloat(attendanceRate),
            absentToday: totalStudents - presentToday
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/analytics/student-performance - Individual student attendance percentages
router.get('/student-performance', async (req, res) => {
    try {
        const students = await Student.find();
        
        const performance = students.map(student => {
            // Calculate attendance percentage (simplified - based on checkout completion)
            const hasAttended = student.checkout && student.checkout !== '';
            const attendancePercentage = hasAttended ? 100 : 0;
            
            return {
                id: student._id,
                name: student.name,
                rollNumber: student.rollNumber,
                attendancePercentage,
                checkin: student.checkin,
                checkout: student.checkout,
                status: hasAttended ? 'Complete' : student.checkin ? 'Present' : 'Absent'
            };
        });
        
        // Sort by attendance percentage (descending)
        performance.sort((a, b) => b.attendancePercentage - a.attendancePercentage);
        
        res.json(performance);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/analytics/late-arrivals - Late arrival statistics
router.get('/late-arrivals', async (req, res) => {
    try {
        const students = await Student.find();
        
        const presentStudents = students.filter(s => s.checkin && s.checkin !== '');
        const lateStudents = presentStudents.filter(s => isLateArrival(s.checkin));
        const onTimeStudents = presentStudents.filter(s => !isLateArrival(s.checkin));
        
        const lateArrivalData = lateStudents.map(s => ({
            name: s.name,
            rollNumber: s.rollNumber,
            checkin: s.checkin,
            minutesLate: timeToMinutes(s.checkin) - (9 * 60)
        }));
        
        res.json({
            total: presentStudents.length,
            onTime: onTimeStudents.length,
            late: lateStudents.length,
            onTimePercentage: presentStudents.length > 0 
                ? ((onTimeStudents.length / presentStudents.length) * 100).toFixed(1)
                : 0,
            latePercentage: presentStudents.length > 0
                ? ((lateStudents.length / presentStudents.length) * 100).toFixed(1)
                : 0,
            lateArrivals: lateArrivalData
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/analytics/trends - Attendance trends (simplified for current day)
router.get('/trends', async (req, res) => {
    try {
        const students = await Student.find();
        
        // Group by creation date (simplified - in real app, you'd query by date range)
        const today = new Date().toLocaleDateString();
        
        const trendData = [{
            date: today,
            present: students.filter(s => s.checkin && s.checkin !== '').length,
            absent: students.filter(s => !s.checkin || s.checkin === '').length,
            total: students.length,
            attendanceRate: students.length > 0
                ? ((students.filter(s => s.checkin && s.checkin !== '').length / students.length) * 100).toFixed(1)
                : 0
        }];
        
        res.json(trendData);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET /api/analytics/heatmap - Attendance heatmap data
router.get('/heatmap', async (req, res) => {
    try {
        const students = await Student.find();
        
        // Create hourly distribution of check-ins
        const hourlyData = Array(24).fill(0).map((_, hour) => ({
            hour,
            count: 0,
            label: `${hour}:00`
        }));
        
        students.forEach(student => {
            if (student.checkin) {
                const checkinMinutes = timeToMinutes(student.checkin);
                if (checkinMinutes !== null) {
                    const hour = Math.floor(checkinMinutes / 60);
                    if (hour >= 0 && hour < 24) {
                        hourlyData[hour].count++;
                    }
                }
            }
        });
        
        // Filter to working hours (6 AM - 6 PM)
        const workingHours = hourlyData.filter(h => h.hour >= 6 && h.hour <= 18);
        
        res.json(workingHours);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
