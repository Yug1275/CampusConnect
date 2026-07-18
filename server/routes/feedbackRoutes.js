const express = require("express");
const router = express.Router();
const {
  submitFeedback,
  getMyFeedback,
  getFeedbackForFaculty,
  getAllFeedback,
  updateFeedbackStatus,
} = require("../controllers/feedbackController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/", protect, authorize("student"), submitFeedback);
router.get("/my", protect, authorize("student"), getMyFeedback);
router.get("/faculty", protect, authorize("faculty"), getFeedbackForFaculty);
router.get("/all", protect, authorize("admin"), getAllFeedback);
router.put("/:id/status", protect, authorize("faculty", "admin"), updateFeedbackStatus);

module.exports = router;