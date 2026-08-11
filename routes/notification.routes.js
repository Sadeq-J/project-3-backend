const router = require('express').Router();
const { getNotifications, markAsRead } = require('../controllers/notification.controller');
const verifyToken = require('../middleware/verifyToken');

router.get('/', verifyToken, getNotifications);
router.put('/:id/read', verifyToken, markAsRead);

module.exports = router;