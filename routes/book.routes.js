const router = require('express').Router()
const {createBooking, getBooking, updateBooking, invitePlayer, getMyInnvitations, joinBookingTeam} = require('../controllers/booking.controller')
const verifyToken = require('../middleware/verifyToken')




router.post('/:id', verifyToken ,createBooking)
router.get('/my-booking', getBooking)
router.put('/:id/edit', updateBooking)
router.post('/:id/invite', verifyToken, invitePlayer)
router.get('/invitations/me', verifyToken, getMyInnvitations)
router.post('/:id/join', verifyToken, joinBookingTeam)


module.exports = router
