const Venue = require("../models/Venue");

const getVenues = async (req, res) => {
  try {
    const { sportType, location, minPrice, maxPrice } = req.query;

    const filter = {};

    if (sportType) {
      filter.sportType = sportType;
    }

    if (location) {
      filter.location = location;
    }

    if (minPrice || maxPrice) {
      filter.pricePerHour = {};

      if (minPrice) {
        filter.pricePerHour.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.pricePerHour.$lte = Number(maxPrice);
      }
    }

    const venues = await Venue.find(filter);

    res.status(200).json(venues);
  } catch (error) {
    res.status(500).json({
      message: "Failed to get venues",
      error: error.message,
    });
  }
};

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
      error: error.message
    });
  }
}
const updateVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!venue) {
      return res.status(404).json({
        message: "Venue not found",
      });
    }

    res.status(200).json(venue);
  } catch (error) {
    res.status(400).json({
      message: "Failed to update venue",
      error: error.message,
    });
  }
};
const deleteVenue = async (req, res) => {
  try {
    const venue = await Venue.findByIdAndDelete(req.params.id);

    if (!venue) {
      return res.status(404).json({
        message: "Venue not found",
      });
    }

    res.status(200).json({
      message: "Venue deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete venue",
      error: error.message,
    });
  }
};

module.exports = {
  getVenues,
  getVenuesById,
  createVenue,
  updateVenue,
  deleteVenue,
};
