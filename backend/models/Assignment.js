const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);
