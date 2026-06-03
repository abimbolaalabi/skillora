const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId
    },
    message: {
        type: String
    },
    isRead: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model("Notification", notificationSchema)