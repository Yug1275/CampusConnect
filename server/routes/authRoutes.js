const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  adminOnlyTest,
  forgotPassword,
  resetPassword,
  googleLogin,
} = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.get("/admin-only", protect, authorize("admin"), adminOnlyTest);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/google", googleLogin);

module.exports = router;