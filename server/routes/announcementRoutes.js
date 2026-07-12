const express = require("express");
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncements,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, getAnnouncements);
router.get("/all", protect, authorize("faculty", "admin"), getAllAnnouncements);
router.get("/:id", protect, getAnnouncementById);

router.post("/", protect, authorize("faculty", "admin"), createAnnouncement);
router.put("/:id", protect, authorize("faculty", "admin"), updateAnnouncement);
router.delete("/:id", protect, authorize("faculty", "admin"), deleteAnnouncement);

module.exports = router;