const router = require("express").Router();
const {
  getVenues,
  getVenuesById,
  createVenue,
  updateVenue,
  deleteVenue,
} = require("../controllers/venues.controller");

router.get("/", getVenues);
router.get("/:id", getVenuesById);
router.post("/", createVenue);
router.put("/:id", updateVenue);
router.delete("/:id", deleteVenue);

module.exports = router;
