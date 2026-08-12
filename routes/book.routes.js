const router = require('express').Router()
const {createBooking, getBooking, updateBooking, invitePlayer, getMyInnvitations, joinBookingTeam, getBookingsByVenue, getAllBookings} = require('../controllers/booking.controller')
const verifyToken = require('../middleware/verifyToken')



router.get('/', verifyToken, getAllBookings)
router.post('/:id', verifyToken ,createBooking)
router.get("/venue/:id", verifyToken, getBookingsByVenue)
router.get('/my-booking', getBooking)
router.put('/:id/edit', updateBooking)
router.post('/:id/invite', verifyToken, invitePlayer)
router.get('/invitations/me', verifyToken, getMyInnvitations)
router.post('/:id/join', verifyToken, joinBookingTeam)


module.exports = router
