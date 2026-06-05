import mongoose from "mongoose";

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

export default mongoose.model("Notification", notificationSchema)