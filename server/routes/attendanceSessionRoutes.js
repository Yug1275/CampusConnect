const express = require("express");
const router = express.Router();
const { generateSession, getActiveSession } = require("../controllers/attendanceSessionController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/generate", protect, authorize("faculty", "admin"), generateSession);
router.get("/active", protect, authorize("faculty", "admin"), getActiveSession);

module.exports = router;