const express = require("express");
const router = express.Router();
const { getMyBadges, getStudentBadges, checkAndAwardBadges } = require("../controllers/badgeController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/my", protect, authorize("student"), getMyBadges);
router.post("/check", protect, authorize("student"), checkAndAwardBadges);
router.get("/student/:studentId", protect, authorize("faculty", "admin"), getStudentBadges);

module.exports = router;