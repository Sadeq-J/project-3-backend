const mongoose = require('mongoose')

const teamChallengeSchema = new mongoose.Schema({
    
    challenger:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true

    },
    opponent:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    booking:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true

    },
    status:{
        type: String,
        enum: ['pending', 'accepted', 'declined', 'completed'],
        default: 'pending'
    }
},{timestamps:true})


const TeamChalleng = mongoose.model("TeamChalleng", teamChallengeSchema)

module.exports = TeamChalleng