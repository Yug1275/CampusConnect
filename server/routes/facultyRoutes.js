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

// All faculty management routes are admin-only
router.use(protect, authorize("admin"));

router.route("/").get(getFaculty).post(createFaculty);
router.route("/:id").get(getFacultyById).put(updateFaculty).delete(deleteFaculty);

module.exports = router;