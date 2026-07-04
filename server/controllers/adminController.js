const User = require("../models/User");
const Department = require("../models/Department");

// @desc    Get high-level counts for the admin dashboard
// @route   GET /api/admin/summary
// @access  Private/Admin
const getAdminSummary = async (req, res, next) => {
  try {
    const [totalStudents, totalFaculty, totalDepartments] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "faculty" }),
      Department.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      summary: {
        totalStudents,
        totalFaculty,
        totalDepartments,
        // Active Events intentionally omitted - Events module doesn't exist
        // until Phase 6. Frontend keeps this as a static placeholder for now.
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAdminSummary };