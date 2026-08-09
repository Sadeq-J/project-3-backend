
import Booking from '../models/Booking.js'
import Venue from '../models/Venue.js'


async function createBooking(req, res){
    try {
        const { date, timeSlots, status, invitedPlayers, teams } = req.body
        const venue = await Venue.find(req.params.id)
        if(venue.sportType === "football"){
            const createdBook = await Booking.create({
                venue: venue._id,
                owner: req.user._id,
                date: date,
                timeSlots: timeSlots,
                status: status,
                invitedPlayers: invitedPlayers,
                teams: teams
            })
        }else{
            const createdBook = await Booking.create({
                venue: venue._id,
                owner: req.user._id,
                date: date,
                timeSlots: timeSlots,
                status: status,
            })
        }
        res.status(201).json(venue);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}

async function getBooking(req, res){
    try {
        const foundBook = await Booking.find({owner: req.user._id})
        res.status(200).json(foundBook);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}


async function updateBooking(req, res){
    try {
        const book = await Booking.find(req.params.id).populate('venue')
        const venue = await Venue.findById(book.venue._id)
        if(venue.sportType === "football"){
            await Booking.findByIdAndUpdate(book._id, req.body)
        }
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}



export{
    createBooking,
    getBooking,
    updateBooking
}