const router = require('express').Router();
const { getProfile, getUserProfile, followUser, unfollowUser, updateProfile, getfriends, searchFriends} = require('../controllers/profile.controller');
const verifyToken = require('../middleware/verifyToken');
const upload = require('../middleware/upload'); // Cloudinary/Multer middleware

router.get('/me', verifyToken, getProfile);
router.put('/me', verifyToken, upload.single('profilePicture'), updateProfile);
router.get('/friends', verifyToken, getfriends);
router.get('/friends/search', verifyToken, searchFriends)
router.get('/:id', verifyToken, getUserProfile);
router.post('/follow', verifyToken, followUser);
router.post('/unfollow', verifyToken, unfollowUser);


module.exports = router;