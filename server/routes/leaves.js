const express = require('express');
const router = express.Router();
const Leave = require('../models/Leave');

// POST apply for leave
router.post('/', async (req, res) => {
    const leave = new Leave({
        rollNumber: req.body.rollNumber,
        name: req.body.name,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        reason: req.body.reason
    });

    try {
        const newLeave = await leave.save();
        res.status(201).json(newLeave);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all leave requests
router.get('/', async (req, res) => {
    try {
        const leaves = await Leave.find().sort({ createdAt: -1 });
        res.json(leaves);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT update leave details or status
// PUT update leave details or status
router.put('/:id', async (req, res) => {
    try {
        console.log('PUT request received for ID:', req.params.id);
        console.log('Request body:', req.body);

        // Usage of findByIdAndUpdate is cleaner and handles partial updates if we pass { new: true }
        // We simply pass req.body since it matches the schema fields we want to update
        const updatedLeave = await Leave.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true } // Return the updated document
        );

        if (updatedLeave) {
            res.json(updatedLeave);
        } else {
            res.status(404).json({ message: 'Leave not found' });
        }
    } catch (err) {
        console.error('Update error:', err);
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
