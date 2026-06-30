const express = require("express");
const router = express.Router();
const { getMyProfile, updateMyProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateMyProfile);

module.exports = router;