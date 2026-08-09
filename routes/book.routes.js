const router = require('express').Router()
const {createBooking, getBooking, updateBooking} = require('../controllers/booking.controller')
const verifyToken = require('../middleware/verifyToken')




router.post('/:id', verifyToken ,createBooking)
router.get('/my-booking', getBooking)
router.put('/:id/edit', updateBooking)


module.exports = router