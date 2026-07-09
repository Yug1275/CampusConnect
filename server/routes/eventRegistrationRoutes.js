const express = require("express");
const router = express.Router();
const {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
  getMyTicket,
  verifyTicket,
} = require("../controllers/eventRegistrationController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/my/registrations", protect, getMyRegistrations);
router.post("/tickets/verify", protect, authorize("faculty", "admin"), verifyTicket);

router.post("/:eventId/register", protect, registerForEvent);
router.delete("/:eventId/register", protect, cancelRegistration);
router.get("/:eventId/ticket", protect, getMyTicket);
router.get(
  "/:eventId/registrations",
  protect,
  authorize("faculty", "admin"),
  getEventRegistrations
);

module.exports = router;