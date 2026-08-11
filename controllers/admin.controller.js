const User = require('../models/User')
const Venue = require('../models/Venue')
const Booking = require('../models/Booking')


async function getAllUsers(req , res) {
    try{
        const users = await User.find()
        res.status(200).json(users)
    }
    catch(error){
        res.status(500).json({ error: error.message })
    }
}


async function deleteUser(req , res) {
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: "User Deleted Successfully"})
    }
    catch(error){
        res.status(500).json({ error: error.message })
    }
}


async function getAllVenuesAdmin(req, res) {
    try {
        const venues = await Venue.find();
        res.status(200).json(venues);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function deleteVenue(req, res) {
    try {
        await Venue.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Venue deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function getAllBookingsAdmin(req, res) {
    try {
        const bookings = await Booking.find()
            .populate('owner', 'username')
            .populate('venue');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



async function deleteBookingAdmin(req, res) {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Booking deleted by admin" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getAllUsers,
    deleteUser,
    getAllVenuesAdmin,
    deleteVenue,
    getAllBookingsAdmin,
    deleteBookingAdmin
}
