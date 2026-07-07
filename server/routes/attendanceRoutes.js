const express = require("express");
const router = express.Router();
const {
  getStudentsForSubject,
  markAttendance,
  getAttendanceForSubjectByDate,
  getMyAttendance,
  getMyAttendanceSummary,
} = require("../controllers/attendanceController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get(
  "/subject/:subjectId/students",
  protect,
  authorize("faculty", "admin"),
  getStudentsForSubject
);
router.get(
  "/subject/:subjectId",
  protect,
  authorize("faculty", "admin"),
  getAttendanceForSubjectByDate
);
router.post("/mark", protect, authorize("faculty", "admin"), markAttendance);

router.get("/my", protect, getMyAttendance);
router.get("/my/summary", protect, getMyAttendanceSummary);

module.exports = router;