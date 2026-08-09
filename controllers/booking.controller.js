
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

        console.log("1. Venue sportType from DB:", venue.sportType)

        let isFootball = false;
        if (Array.isArray(venue.sportType)) {
            isFootball = venue.sportType.some(s => typeof s === 'string' && s.toLowerCase() === 'football');
        } else if (typeof venue.sportType === 'string') {
            isFootball = venue.sportType.toLowerCase() === 'football';
        }

        console.log("2. Is Football?:", isFootball)

        let createdBook
        if (isFootball) {
            console.log("3. SUCCESS: Hit the football block!")
            createdBook = await Booking.create({
                venue: req.params.id,
                owner: req.user._id,
                date,
                timeSlots,
                status,
                invitedPlayers: invitedPlayers || [],
                teams: teams || { teamA: [], teamB: [] }
            })
        } else {
            console.log("3. WARNING: Hit the ELSE block (sportType didn't match 'football')")
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
        console.log(error)
        res.status(500).json({
            error: error.message
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
