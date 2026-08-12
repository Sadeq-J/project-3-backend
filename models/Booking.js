const mongoose = require('mongoose')


// Schema

const bookingSchema = new mongoose.Schema({
    venue:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        required: true
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date:{
        type: Date,
    },
    timeSlots:{
        type: String,
        required: true
    },
    status:{
        type: String,
        enum: ['Confirmed', 'Cancelled'],
        default: 'Confirmed'
    },
    invitedPlayers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    teams:{
        teamA:[{
            type: String
        }],
        teamB:[{
            type: String
        }],
    }
}, {timestamps: true})



// model
const Booking = mongoose.model('Booking', bookingSchema)



module.exports = Booking
