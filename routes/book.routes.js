const router = require('express').Router()
const {createBooking, getBooking, updateBooking} = require('../controllers/booking.controller')




router.post('/', createBooking)
router.get('/my-booking', getBooking)
router.put('/:id/edit', updateBooking)


module.exports = router