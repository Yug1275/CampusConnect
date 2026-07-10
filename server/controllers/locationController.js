const Location = require("../models/Location");

// @desc    Create a new campus location
// @route   POST /api/locations
// @access  Private/Admin
const createLocation = async (req, res, next) => {
  try {
    const {
      name,
      category,
      latitude,
      longitude,
      description,
      imageUrl,
      openingTime,
      closingTime,
      contactInfo,
    } = req.body;

    if (!name || latitude === undefined || longitude === undefined) {
      res.status(400);
      throw new Error("Name, latitude, and longitude are required");
    }

    const existing = await Location.findOne({ name });
    if (existing) {
      res.status(400);
      throw new Error("A location with this name already exists");
    }

    const location = await Location.create({
      name,
      category: category || "Other",
      latitude,
      longitude,
      description,
      imageUrl,
      openingTime,
      closingTime,
      contactInfo,
    });

    res.status(201).json({ success: true, location });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all campus locations, optionally filtered by category
// @route   GET /api/locations?category=
// @access  Private (any authenticated user)
const getLocations = async (req, res, next) => {
  try {
    const { category } = req.query;

    const query = {};
    if (category) query.category = category;

    const locations = await Location.find(query).sort({ name: 1 });

    res.status(200).json({ success: true, count: locations.length, locations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single location by ID
// @route   GET /api/locations/:id
// @access  Private (any authenticated user)
const getLocationById = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      res.status(404);
      throw new Error("Location not found");
    }

    res.status(200).json({ success: true, location });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a location
// @route   PUT /api/locations/:id
// @access  Private/Admin
const updateLocation = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      res.status(404);
      throw new Error("Location not found");
    }

    const fields = [
      "name",
      "category",
      "latitude",
      "longitude",
      "description",
      "imageUrl",
      "openingTime",
      "closingTime",
      "contactInfo",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        location[field] = req.body[field];
      }
    });

    const updated = await location.save();

    res.status(200).json({ success: true, message: "Location updated successfully", location: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a location
// @route   DELETE /api/locations/:id
// @access  Private/Admin
const deleteLocation = async (req, res, next) => {
  try {
    const location = await Location.findById(req.params.id);

    if (!location) {
      res.status(404);
      throw new Error("Location not found");
    }

    await location.deleteOne();

    res.status(200).json({ success: true, message: "Location deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
};