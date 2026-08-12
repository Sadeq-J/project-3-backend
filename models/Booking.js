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
    teamName: {
        type: String,
        trim: true
    },
    opponentTeamName: {
        type: String,
        trim: true
    },
    matchRequestNote: {
        type: String,
        trim: true
    },
    invitedPlayers:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    teams:{
        teamA:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        teamB:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
    }
}, {timestamps: true})



// model
const Booking = mongoose.model('Booking', bookingSchema)



module.exports = Booking
