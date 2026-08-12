const router = require("express").Router();
const {upload} = require("../middleware/upload");
const verifyToken = require("../middleware/verifyToken");
const isAdmin = require("../middleware/isAdmin");

const {
  getVenues,
  getVenuesById,
  createVenue,
  updateVenue,
  deleteVenue,
} = require("../controllers/venues.controller");

// Public routes (Anyone can view venues)
router.get("/", getVenues);
router.get("/:id", getVenuesById);

// Protected Admin routes (Only admins can create, update, or delete)
router.post("/", verifyToken, isAdmin, upload.array("images", 5), createVenue);
router.put("/:id", verifyToken, isAdmin, upload.array("images", 5), updateVenue);
router.delete("/:id", verifyToken, isAdmin, deleteVenue);

module.exports = router;
