const router = require("express").Router();
const { getProfile, getUserProfile, followUser, unfollowUser, updateProfile} = require("../controllers/profile.controller");
const { veverifyToken } = require("../middleware/verifyToken");

router.get("/me", verifyToken, getProfile);
router.get("/:userId", getUserProfile);
router.post("/follow", verifyToken, followUser);
router.post("/unfollow", verifyToken, unfollowUser);
router.put("/update", verifyToken, updateProfile);

module.exports = router;