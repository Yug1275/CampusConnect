const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Location name is required"],
      trim: true,
      unique: true,
    },
    category: {
      type: String,
      enum: [
        "Library",
        "Auditorium",
        "Hostel",
        "Cafeteria",
        "Sports Ground",
        "Placement Cell",
        "Labs",
        "Parking",
        "Admin Block",
        "Other",
      ],
      default: "Other",
    },
    latitude: {
      type: Number,
      required: [true, "Latitude is required"],
      min: -90,
      max: 90,
    },
    longitude: {
      type: Number,
      required: [true, "Longitude is required"],
      min: -180,
      max: 180,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    openingTime: {
      type: String, // stored as "HH:MM" 24-hour string for simplicity
      default: "",
    },
    closingTime: {
      type: String,
      default: "",
    },
    contactInfo: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Location = mongoose.model("Location", locationSchema);

module.exports = Location;