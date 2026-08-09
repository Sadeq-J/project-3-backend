const express = require('express')
const router = express.Router()
const ChallengeCtrl = require('../controllers/Challenge.controller')


router.get('/', ChallengeCtrl.fetchChallenges)
router.post('/', ChallengeCtrl.createChallenge)
router.post('/:id/accept', ChallengeCtrl.acceptChallenge)


module.exports = router