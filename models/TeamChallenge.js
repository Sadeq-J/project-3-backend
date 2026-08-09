const mongoose = require('mongoose')
const { data } = require('react-router')

const teamChallengeSchema = new mongoose.Schema({
    
    venueId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Venue",
        required: true
    },
    sportType:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true
    },
    challengerTeam:{
        leaderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        teamName:{
            type: String,
            required: true
        },
        players:{
            tupe: [String],
            default: []
        } 
    },
    opponentTeam:{
        leaderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        teamName: {
            type: String,
            required: true
        },
        players: {
            type: [String],
            default: []
        }
        
    },
    booking:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking',
        required: true

    },
    status:{
        type: String,
        enum: ['Looking for Opponent', 'Matched & Booked', 'completed'],
        default: 'Looking for Opponent'
    }
},{timestamps:true})


const TeamChalleng = mongoose.model("TeamChalleng", teamChallengeSchema)

module.exports = TeamChalleng