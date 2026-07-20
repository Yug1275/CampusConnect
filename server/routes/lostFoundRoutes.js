const express = require("express");
const router = express.Router();
const {
  reportItem,
  getItems,
  getMyItems,
  claimItem,
  verifyClaim,
  deleteItem,
} = require("../controllers/lostFoundController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/my", protect, getMyItems);
router.get("/", protect, getItems);

router.post("/", protect, reportItem);
router.post("/:id/claim", protect, claimItem);
router.put("/:id/verify", protect, authorize("admin"), verifyClaim);
router.delete("/:id", protect, deleteItem);

module.exports = router;