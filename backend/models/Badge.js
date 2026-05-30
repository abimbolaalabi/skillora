const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({}, { timestamps: true });

module.exports = mongoose.model('Badge', badgeSchema);
