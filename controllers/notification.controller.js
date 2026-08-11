const Notification = require('../models/Notifications')



async function getNotifications(req, res) {
    try {
        const notifications = await Notification.find({ recipient: req.user._id })
            .populate('sender', 'username profilePicture')
            .populate('booking', 'date timeSlots')
            .sort({ createdAt: -1 })
        res.status(200).json(notifications)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

async function markAsRead(req, res) {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user._id },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" })
        }

        res.status(200).json({ message: "Marked as read", notification })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}


module.exports = {
    getNotifications,
    markAsRead
}