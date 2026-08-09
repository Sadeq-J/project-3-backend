const TeamChalleng = require('../models/TeamChallenge')







//Get /challenges
async function fetchChallenges(req, res){
    try{
        const {sportType, venueId} = req.query
        const filter = {status: "Looking for Opponent"}

        if(sportType) filter.sportType = sportType
        if(venueId) filter.venueId = venueId

        const challenges = await TeamChalleng.find(filter).populate('venueId', 'name location').populate('challengerTeam.leaderId', 'name phone')

        res.status(200).json(challenges)
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}


//post /challenges
async function createChallenge(req , res) {
    try{
        const {venueId, sportType, date, timeSlot, challengerTeam, bookingId} = req.body

        const newChallenge = await TeamChalleng.create({
            venueId,
            sportType,
            date,
            timeSlot,
            challengerTeam,
            booking: bookingId,
            status: "Looking for Opponent"
        })

        res.status(201).json(newChallenge)
    }
    catch(err){
        res.status(400).json({message: err.message})
    }
}


//post /challenges/:id/accept
async function acceptChallenge(req , res){
    try{
        const { id } = req.params
        const { opponentTeam } = req.body

        const challenge = await TeamChalleng.findById(id)

        if (!challenge){
            return res.status(404).json({message: "Challenge not found"})
        }

        if(challenge.status !== "Looking for Opponent"){
            return res.status(400).json({message: "This challenge has already been matched or completed."})
        }

        challenge.opponentTeam = opponentTeam
        challenge.status = "Matched & Booked"

        await challenge.save()

        res.status(200).json({
            message: "Challenge accepted successfully! Booking slot is now locked.", challenge
        })
    }
    catch(err){
        res.status(500).json({message: err.message})
    }
}



module.exports = {
    fetchChallenges,
    createChallenge,
    acceptChallenge
}