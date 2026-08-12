const router = require('express').Router()
const {getAllUsers, deleteUser, getAllVenuesAdmin, deleteVenue, getAllBookingsAdmin, deleteBookingAdmin, updateUserRole} = require('../controllers/admin.controller')
const verifyToken = require('../middleware/verifyToken')
const isAdmin = require('../middleware/isAdmin')
const {upload} = require('../middleware/upload')
const { createVenue, updateVenue, getVenuesById } = require('../controllers/venues.controller')


router.get('/users', verifyToken, isAdmin ,getAllUsers)
router.delete('/users/:id', verifyToken, isAdmin ,deleteUser)
router.get('/venues', verifyToken, isAdmin ,getAllVenuesAdmin)
router.get('/venues/:id', verifyToken, isAdmin, getVenuesById)
router.post('/venues', verifyToken, isAdmin, upload.array('images', 5), createVenue)
router.put('/venues/:id', verifyToken, isAdmin, upload.array('images', 5), updateVenue)
router.delete('/venues/:id', verifyToken, isAdmin ,deleteVenue)
router.get('/bookings', verifyToken, isAdmin ,getAllBookingsAdmin)
router.delete('/bookings/:id', verifyToken, isAdmin ,deleteBookingAdmin)
router.patch('/users/:id/role', verifyToken, isAdmin, updateUserRole)


module.exports = router