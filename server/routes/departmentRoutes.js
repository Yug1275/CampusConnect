const express = require("express");
const router = express.Router();
const {
  createDepartment,
  getDepartments,
  getDepartmentById,
  getDepartmentStats,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, getDepartments);
router.get("/:id", protect, getDepartmentById);
router.get("/:id/stats", protect, getDepartmentStats);

router.post("/", protect, authorize("admin"), createDepartment);
router.put("/:id", protect, authorize("admin"), updateDepartment);
router.delete("/:id", protect, authorize("admin"), deleteDepartment);

module.exports = router;