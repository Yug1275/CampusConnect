const express = require("express");
const router = express.Router();
const {
  createFaculty,
  getFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
} = require("../controllers/facultyController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Read access is available to any authenticated user so student-facing views can populate
// faculty pickers, while write operations remain admin-only.
router.get("/", protect, getFaculty);
router.get("/:id", protect, getFacultyById);

router.post("/", protect, authorize("admin"), createFaculty);
router.put("/:id", protect, authorize("admin"), updateFaculty);
router.delete("/:id", protect, authorize("admin"), deleteFaculty);

module.exports = router;