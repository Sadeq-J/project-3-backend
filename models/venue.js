const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      maxlength: 500,
    },

    location: {
      type: String,
      required: true,
    },

    sportType: {
      type: [String],
      required: true,
      enum: ["Football", "Padel", "Basketball", "Tennis", "Swimming"],
    },

    pricePerHour: {
      type: Number,
      required: true,
      min: 10,
      max: 30,
    },

    images: [
      {
        type: String,
      },
    ],

    facilities: [
      {
        type: String,
      },
    ],

    availability: [
      {
        date: Date,
        slots: [String],
      },
    ],
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Venue", venueSchema);
