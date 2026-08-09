const Venue = require("../models/Venue");

async function getVenues(req, res) {
  try {
    const { sportType, location } = req.query;
    const filter = {};
    if (sportType) {
      filter.sportType = sportType;
    }
    if (location) {
      filter.location = location;
    }
    const venues = await Venue.find(filter);
    res.status(200).json(venues);
  } catch (err) {
    res.status(500).json({
      message: error.message,
    });
  }
}

async function getVenuesById(req, res) {
  try {
    const venue = await Venue.findById(req.params.id);
    if (!venue) {
      return res.status(404).json({
        message: "venue not found",
      });
    }
    res.status(200).json(venue);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "failed to get venue",
      error: error.message,
    });
  }
}

async function createVenue(req, res) {
  try {
    const venue = await Venue.create(req.body);
    res.status(201).json(venue);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      error: error.message,
    });
  }
}

module.exports = {
  getVenues,
  getVenuesById,
  createVenue,
};
