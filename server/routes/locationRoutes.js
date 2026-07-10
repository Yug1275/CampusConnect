const express = require("express");
const router = express.Router();
const {
  createLocation,
  getLocations,
  getLocationById,
  updateLocation,
  deleteLocation,
} = require("../controllers/locationController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, getLocations);
router.get("/:id", protect, getLocationById);

router.post("/", protect, authorize("admin"), createLocation);
router.put("/:id", protect, authorize("admin"), updateLocation);
router.delete("/:id", protect, authorize("admin"), deleteLocation);

module.exports = router;