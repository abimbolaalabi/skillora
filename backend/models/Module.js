const mongoose = require('mongoose');

const moduleSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model('Module', moduleSchema);
