
import Booking from '../models/Booking.js'
import Venue from '../models/Venue.js'


async function createBooking(req, res) {
    try {
        const { date, timeSlots, status, invitedPlayers, teams } = req.body

        const venue = await Venue.findById(req.params.id)
        if (!venue) {
            return res.status(404).json({
                error: 'Venue not found'
            })
        }
        
        let createdBook
        if (venue.sportType === "football") {
            createdBook = await Booking.create({
                venue: venue._id,
                owner: req.user._id,
                date,
                timeSlots,
                status,
                invitedPlayers,
                teams
            })
        } else {
            createdBook = await Booking.create({
                venue: venue._id,
                owner: req.user._id,
                date,
                timeSlots,
                status,
            })
        }
        res.status(201).json(createdBook);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}

async function getBooking(req, res) {
    try {
        const foundBook = await Booking.find({ owner: req.user._id })
        res.status(200).json(foundBook);
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}


async function updateBooking(req, res) {
    try {
        const book = await Booking.findById(req.params.id).populate('venue')

        if (!book) {
            return res.status(404).json({
                error: 'Booking not found'
            })
        }

        if (book.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                error: 'Not authorized'
            })
        }

        const venue = await Venue.findById(book.venue._id)
        if (!venue) {
            return res.status(404).json({
                error: 'Venue not found'
            })
        }

        if (venue.sportType !== "football") {
            return res.status(400).json({
                error: 'Only football bookings can be updated'
            })
        }

        const updatedBook = await Booking.findByIdAndUpdate(
            book._id,
            req.body,
            { new: true, runValidators: true }
        )

        res.status(200).json(updatedBook)
    } catch (error) {
        res.status(500).json({
            error: error.message,
        });
    }
}



export {
    createBooking,
    getBooking,
    updateBooking
}