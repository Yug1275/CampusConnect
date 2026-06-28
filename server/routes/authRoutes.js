const express = require("express");
const router = express.Router();
const {registerUser,loginUser,getProfile,adminOnlyTest, forgotPassword,} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get("/admin-only", protect, authorize("admin"), adminOnlyTest);
router.post("/forgot-password", forgotPassword);

module.exports = router;