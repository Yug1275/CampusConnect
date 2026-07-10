const express = require("express");
const router = express.Router();
const {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub,
} = require("../controllers/clubController");
const {
  joinClub,
  leaveClub,
  getMyClubs,
  getClubMembers,
} = require("../controllers/clubMembershipController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/my/memberships", protect, getMyClubs);

router.get("/", protect, getClubs);
router.get("/:id", protect, getClubById);

router.post("/", protect, authorize("admin"), createClub);
router.put("/:id", protect, authorize("admin"), updateClub);
router.delete("/:id", protect, authorize("admin"), deleteClub);

router.post("/:clubId/join", protect, joinClub);
router.delete("/:clubId/join", protect, leaveClub);
router.get("/:clubId/members", protect, authorize("admin"), getClubMembers);

module.exports = router;