const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model('Progress', progressSchema);
