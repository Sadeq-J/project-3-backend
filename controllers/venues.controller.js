const Venue = require("../models/Venue");
const { cloudinary } = require("../middleware/upload"); // 👈 Import cloudinary from your upload middleware
const { Readable } = require("stream")

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
    const { sportType, location, minPrice, maxPrice } = req.query;
    const filter = {};

    if (sportType) filter.sportType = sportType;
    if (location) filter.location = location;

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

const uploadBufferToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "venue-images" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from(fileBuffer).pipe(uploadStream);
  });
};

async function createVenue(req, res) {
  try {
    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          const b64 = Buffer.from(file.buffer).toString("base64");
          let dataURI = `data:${file.mimetype};base64,${b64}`;
          
          const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: "venue-images",
          });
          
          // 🔥 Wrap successful upload in an object matching your subdocument schema
          imageUrls.push({ url: uploadResponse.secure_url });
        } catch (uploadErr) {
          console.warn("⚠️ Cloudinary upload failed:", uploadErr.message);
        }
      }
    }

    // 🔥 If Cloudinary failed or no files were uploaded, use a valid object fallback
    if (imageUrls.length === 0) {
      imageUrls.push({ url: "https://via.placeholder.com/800x500?text=Venue+Image" });
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
          const b64 = Buffer.from(file.buffer).toString("base64");
          let dataURI = `data:${file.mimetype};base64,${b64}`;
          
          const uploadResponse = await cloudinary.uploader.upload(dataURI, {
            folder: "venue-images",
          });
          imageUrls.push({ url: uploadResponse.secure_url });
        } catch (uploadErr) {
          console.warn("⚠️ Cloudinary update upload failed:", uploadErr.message);
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
