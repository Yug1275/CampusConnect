const express = require("express");
const router = express.Router();
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} = require("../controllers/eventController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, getEvents);
router.get("/:id", protect, getEventById);

router.post("/", protect, authorize("faculty", "admin"), createEvent);
router.put("/:id", protect, authorize("faculty", "admin"), updateEvent);
router.delete("/:id", protect, authorize("faculty", "admin"), deleteEvent);

module.exports = router;