const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    rollNumber: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    profileImage: {
        type: String,
        default: ""
    },
    checkin: {
        type: String,
        default: ""
    },
    checkout: {
        type: String,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
