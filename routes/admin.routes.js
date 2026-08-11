const router = require('express').Router()
const {getAllUsers, deleteUser, getAllVenuesAdmin, deleteVenue, getAllBookingsAdmin, deleteBookingAdmin} = require('../controllers/admin.controller')
const verifyToken = require('../middleware/verifyToken')
const isAdmin = require('../middleware/isAdmin')


router.get('/users', verifyToken, isAdmin ,getAllUsers)
router.delete('/users/:id', verifyToken, isAdmin ,deleteUser)
router.get('/venues', verifyToken, isAdmin ,getAllVenuesAdmin)
router.delete('/venues/:id', verifyToken, isAdmin ,deleteVenue)
router.get('/bookings', verifyToken, isAdmin ,getAllBookingsAdmin)
router.delete('/bookings/:id', verifyToken, isAdmin ,deleteBookingAdmin)


module.exports = router