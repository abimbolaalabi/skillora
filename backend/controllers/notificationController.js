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
        const readNotification = await Notification.findByIdAndUpdate(id, {isRead: true}, {new: true, runValidators: true});//{_id: id, userId: req.user._id}
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

export const markMyAssignmentAsRead = async (req, res) => {
    try {
        const userId = req.user._id || req.user.id
        const notification = await Notification.findOneAndUpdate({userId: userId}, {isRead: true}, {new: true});
        if (!notification) {
            return res
            .status(404).json({message: "notification not found"})
        }
        return res
        .status(200).json({message: "Notification read", isRead: notification.isRead})
    } catch (error) {
        return res
        .status(500).json({message: "error updating notification", error: error.message});
    }
}