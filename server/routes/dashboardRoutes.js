const express = require("express");
const router = express.Router();
const {
  getAdminRecentActivities,
  getStudentDashboardOverview,
  getFacultyDashboardOverview,
} = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/admin/recent-activities", protect, authorize("admin"), getAdminRecentActivities);
router.get("/student/overview", protect, authorize("student"), getStudentDashboardOverview);
router.get("/faculty/overview", protect, authorize("faculty"), getFacultyDashboardOverview);

module.exports = router;
