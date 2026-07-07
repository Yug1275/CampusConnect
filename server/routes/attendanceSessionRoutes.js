const express = require("express");
const router = express.Router();
const {
  generateSession,
  getActiveSession,
  markAttendanceViaQr,
} = require("../controllers/attendanceSessionController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/generate", protect, authorize("faculty", "admin"), generateSession);
router.get("/active", protect, authorize("faculty", "admin"), getActiveSession);
router.post("/scan", protect, authorize("student"), markAttendanceViaQr);

module.exports = router;