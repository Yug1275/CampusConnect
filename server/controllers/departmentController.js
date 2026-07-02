const Department = require("../models/Department");
const User = require("../models/User");

// @desc    Create a new department
// @route   POST /api/departments
// @access  Private/Admin
const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description, headOfDepartment } = req.body;

    if (!name || !code) {
      res.status(400);
      throw new Error("Department name and code are required");
    }

    const existing = await Department.findOne({
      $or: [{ name }, { code: code.toUpperCase() }],
    });
    if (existing) {
      res.status(400);
      throw new Error("A department with this name or code already exists");
    }

    const department = await Department.create({
      name,
      code,
      description,
      headOfDepartment: headOfDepartment || null,
    });

    res.status(201).json({ success: true, department });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all departments
// @route   GET /api/departments
// @access  Private (any authenticated user)
const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find()
      .populate("headOfDepartment", "name email")
      .sort({ name: 1 });

    res.status(200).json({ success: true, count: departments.length, departments });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single department by ID
// @route   GET /api/departments/:id
// @access  Private (any authenticated user)
const getDepartmentById = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id).populate(
      "headOfDepartment",
      "name email"
    );

    if (!department) {
      res.status(404);
      throw new Error("Department not found");
    }

    res.status(200).json({ success: true, department });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student/faculty statistics for a department
// @route   GET /api/departments/:id/stats
// @access  Private (any authenticated user)
const getDepartmentStats = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id).populate(
      "headOfDepartment",
      "name email"
    );

    if (!department) {
      res.status(404);
      throw new Error("Department not found");
    }

    // Students/Faculty reference department by name (matches User schema - Phase 2)
    const [studentCount, facultyCount] = await Promise.all([
      User.countDocuments({ role: "student", department: department.name }),
      User.countDocuments({ role: "faculty", department: department.name }),
    ]);

    res.status(200).json({
      success: true,
      department: {
        id: department._id,
        name: department.name,
        code: department.code,
        description: department.description,
        headOfDepartment: department.headOfDepartment,
        createdAt: department.createdAt,
      },
      stats: {
        studentCount,
        facultyCount,
        totalHeadcount: studentCount + facultyCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a department
// @route   PUT /api/departments/:id
// @access  Private/Admin
const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404);
      throw new Error("Department not found");
    }

    const { name, code, description, headOfDepartment } = req.body;

    if (name !== undefined) department.name = name;
    if (code !== undefined) department.code = code;
    if (description !== undefined) department.description = description;
    if (headOfDepartment !== undefined) department.headOfDepartment = headOfDepartment || null;

    const updated = await department.save();

    res.status(200).json({ success: true, message: "Department updated successfully", department: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a department
// @route   DELETE /api/departments/:id
// @access  Private/Admin
const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      res.status(404);
      throw new Error("Department not found");
    }

    await department.deleteOne();

    res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDepartment,
  getDepartments,
  getDepartmentById,
  getDepartmentStats,
  updateDepartment,
  deleteDepartment,
};