const express = require("express");
const router = express.Router();
const {
  getAttendanceTrend,
  getStudentsPerDepartment,
  getFacultyDistribution,
  getClubMembershipStats,
  getEventParticipationStats,
} = require("../controllers/analyticsController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/attendance-trend", protect, authorize("admin"), getAttendanceTrend);
router.get("/students-per-department", protect, authorize("admin"), getStudentsPerDepartment);
router.get("/faculty-distribution", protect, authorize("admin"), getFacultyDistribution);
router.get("/club-membership", protect, authorize("admin"), getClubMembershipStats);
router.get("/event-participation", protect, authorize("admin"), getEventParticipationStats);

module.exports = router;