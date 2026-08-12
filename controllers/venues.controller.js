const Venue = require("../models/venue.js");
const { imagekit } = require("../middleware/upload.js"); // 👈 import imagekit

const normalizeVenuePayload = (req) => {
  const payload = { ...req.body };

  if (payload.sportType) {
    const sportTypes = Array.isArray(payload.sportType)
      ? payload.sportType
      : [payload.sportType];

    payload.sportType = sportTypes.map((value) => {
      if (typeof value !== "string") return value;

      const normalized = value.trim();
      const mapping = {
        football: "Football",
        padel: "Padel",
        basketball: "Basketball",
        tennis: "Tennis",
        swimming: "Swimming",
      };

      return mapping[normalized.toLowerCase()] || normalized;
    });
  }

  if (payload.pricePerHour && typeof payload.pricePerHour === "string") {
    payload.pricePerHour = Number(payload.pricePerHour);
  }

  return payload;
};

const getVenues = async (req, res) => {
  try {
    const { sportType, location, minPrice, maxPrice, search } = req.query;
    const filter = {};

    if (sportType) {
      const normalizedSport = String(sportType).trim();
      filter.sportType = { $regex: new RegExp(`^${normalizedSport}$`, "i") };
    }

    if (location) {
      const normalizedLocation = String(location).trim();
      filter.location = { $regex: new RegExp(`^${normalizedLocation}$`, "i") };
    }

    if (search && String(search).trim()) {
      const term = String(search).trim();
      filter.$or = [
        { name: { $regex: term, $options: "i" } },
        { location: { $regex: term, $options: "i" } },
        { description: { $regex: term, $options: "i" } },
        { sportType: { $regex: term, $options: "i" } },
      ];
    }

    if (minPrice || maxPrice) {
      filter.pricePerHour = {};
      if (minPrice) filter.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerHour.$lte = Number(maxPrice);
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
      return res.status(404).json({ message: "venue not found" });
    }
    res.status(200).json(venue);
  } catch (error) {
    res.status(500).json({
      message: "failed to get venue",
      error: error.message,
    });
  }
}

async function createVenue(req, res) {
  try {
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          // 🔥 Upload buffer directly to ImageKit
          const uploadResponse = await imagekit.upload({
            file: file.buffer, // buffer from multer memory storage
            fileName: `venue_${Date.now()}_${file.originalname}`,
            folder: "/venue-images",
          });

          imageUrls.push(uploadResponse.url);
        } catch (uploadErr) {
          console.warn("⚠️ ImageKit upload failed:", uploadErr.message);
        }
      }
    }

    if (imageUrls.length === 0) {
      imageUrls.push("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'%3E%3Crect width='800' height='500' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%2364748b'%3EVenue Image%3C/text%3E%3C/svg%3E");
    }

    const payload = normalizeVenuePayload(req);
    payload.images = imageUrls;

    if (!payload.name || !payload.location || !payload.pricePerHour) {
      return res.status(400).json({
        message: "Name, location, and price per hour are required.",
      });
    }

    if (!payload.sportType || payload.sportType.length === 0) {
      return res.status(400).json({
        message: "Please select at least one sport type.",
      });
    }

    const newVenue = await Venue.create(payload);
    res.status(201).json(newVenue);
  } catch (error) {
    console.error("Venue creation failed:", error);
    res.status(500).json({
      message: "Venue creation failed",
      error: error.message,
    });
  }
}

const updateVenue = async (req, res) => {
  try {
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const uploadResponse = await imagekit.upload({
            file: file.buffer,
            fileName: `venue_${Date.now()}_${file.originalname}`,
            folder: "/venue-images",
          });
          imageUrls.push(uploadResponse.url);
        } catch (uploadErr) {
          console.warn("⚠️ ImageKit update upload failed:", uploadErr.message);
        }
      }
    }

    const payload = normalizeVenuePayload(req);
    if (imageUrls.length > 0) {
      payload.images = imageUrls;
    }

    const venue = await Venue.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!venue) {
      return res.status(404).json({ message: "Venue not found" });
    }

    res.status(200).json(venue);
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }

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
      return res.status(404).json({ message: "Venue not found" });
    }
    res.status(200).json({ message: "Venue deleted successfully" });
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
