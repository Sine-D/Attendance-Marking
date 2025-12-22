const express = require('express');
const router = express.Router();
const Student = require('../models/Student');

// GET all students
router.get('/', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new student (Check-in)
router.post('/', async (req, res) => {
    const student = new Student({
        rollNumber: req.body.rollNumber,
        name: req.body.name,
        profileImage: req.body.profileImage,
        checkin: req.body.checkin,
        checkout: req.body.checkout
    });

    try {
        const newStudent = await student.save();
        res.status(201).json(newStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update student (Check-out)
router.put('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (req.body.checkout) {
            student.checkout = req.body.checkout;
        }
        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
