import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find();
        if (!notifications) {
            return res
            .status(404).json({message: "No notification found"});
        }

        return res
        .status(200).json({message: "notifications fetched successfully", data: notifications})
    } catch (error) {
        return res
        .status(500).json({message: "error fetching notifications", error: error.message})
    }
}

export const markAsRead = async (req, res) => {
    try {
        const {id} = req.params
        const readNotification = await Notification.findOneAndUpdate({_id: req.params.id, userId: req.user._id}, {isRead: true}, {new: true, runValidators: true});
        if (!readNotification) {
            return res
            .status(404).json({message: "Notification not found"})
        };
        return res
        .status(200).json({message: "Notification updated successfully", data: readNotification.isRead})
    } catch (error) {
        return res
        .status(500).json({message: "error updating notification", error: error.message});
    }
}