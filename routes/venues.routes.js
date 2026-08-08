const router = require("express").Router();
const {
  getVenues,
  getVenuesById,
  createVenue,
} = require("../controllers/venues.controller");

router.get("/", getVenues);
router.get("/:id", getVenuesById);
router.post("/", createVenue);

module.exports = router;
