const router = require('express').Router();
const { getAllProfiles, getProfile, getUserProfile, followUser, unfollowUser, updateProfile, getfriends, searchFriends, searchFollowers, getMyFollowers, getMyFollowing} = require('../controllers/profile.controller');
const verifyToken = require('../middleware/verifyToken');
const {upload} = require('../middleware/upload'); // Cloudinary/Multer middleware

router.get('/', verifyToken, getAllProfiles)
router.get('/followers', verifyToken, getMyFollowers)
router.get('/followers/search', verifyToken, searchFollowers)
router.get('/following', verifyToken, getMyFollowing)
router.get('/me', verifyToken, getProfile);
router.put('/me', verifyToken, upload.single('profilePicture'), updateProfile);
router.get('/friends', verifyToken, getfriends);
router.get('/friends/search', verifyToken, searchFriends)
router.get('/:id', verifyToken, getUserProfile);
router.post('/:id/follow', verifyToken, followUser)
router.post('/:id/unfollow', verifyToken, unfollowUser)


module.exports = router;
