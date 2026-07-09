const express = require("express");
const router = express.Router();
const {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub,
} = require("../controllers/clubController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, getClubs);
router.get("/:id", protect, getClubById);

router.post("/", protect, authorize("admin"), createClub);
router.put("/:id", protect, authorize("admin"), updateClub);
router.delete("/:id", protect, authorize("admin"), deleteClub);

module.exports = router;