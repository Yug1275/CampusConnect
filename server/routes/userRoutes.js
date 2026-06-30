const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  updateProfilePicture,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

router.get("/profile", protect, getMyProfile);
router.put("/profile", protect, updateMyProfile);
router.post("/profile/picture", protect, upload.single("profileImage"), updateProfilePicture);

module.exports = router;