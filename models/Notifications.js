const mongoose = require('mongoose')


const notificationsSchema = new mongoose.Schema({
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    type: { 
        type: String, 
        enum: ['follow', 'invite'], 
        required: true 
    },
    booking: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Booking' 
    }, // Only used if type is 'invite'
    read: { 
        type: Boolean, 
        default: false 
    }
}, {timestamps: true})

const Notification = mongoose.model('Notification', notificationsSchema)

module.exports = Notification