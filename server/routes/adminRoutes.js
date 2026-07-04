const express = require("express");
const router = express.Router();
const { getAdminSummary } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/summary", protect, authorize("admin"), getAdminSummary);

module.exports = router;