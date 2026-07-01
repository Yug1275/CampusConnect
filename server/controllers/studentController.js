const User = require("../models/User");
const generateOtp = require("../utils/generateOtp");

// @desc    Create a new student account (admin-provisioned)
// @route   POST /api/students
// @access  Private/Admin
const createStudent = async (req, res, next) => {
  try {
    const { name, email, department, semester, rollNumber } = req.body;

    if (!name || !email) {
      res.status(400);
      throw new Error("Name and email are required");
    }

    const existing = await User.findOne({ email });
    if (existing) {
      res.status(400);
      throw new Error("A user with this email already exists");
    }

    // Admin-created accounts get a random temporary password.
    // The student uses "Forgot Password" (Phase 2) to set their own on first login.
    const tempPassword = generateOtp() + generateOtp();

    const student = await User.create({
      name,
      email,
      password: tempPassword,
      role: "student",
      department: department || "",
      semester: semester || null,
      rollNumber: rollNumber || "",
    });

    res.status(201).json({
      success: true,
      message: "Student created successfully",
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        role: student.role,
        department: student.department,
        semester: student.semester,
        rollNumber: student.rollNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students with search, department filter, and pagination
// @route   GET /api/students?search=&department=&page=&limit=
// @access  Private/Admin
const getStudents = async (req, res, next) => {
  try {
    const { search = "", department = "", page = 1, limit = 10 } = req.query;

    const query = { role: "student" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { rollNumber: { $regex: search, $options: "i" } },
      ];
    }

    if (department) {
      query.department = department;
    }

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [students, total] = await Promise.all([
      User.find(query)
        .select("-password -resetOtp -resetOtpExpiry")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      students,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single student by ID
// @route   GET /api/students/:id
// @access  Private/Admin
const getStudentById = async (req, res, next) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: "student" }).select(
      "-password -resetOtp -resetOtpExpiry"
    );

    if (!student) {
      res.status(404);
      throw new Error("Student not found");
    }

    res.status(200).json({ success: true, student });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private/Admin
const updateStudent = async (req, res, next) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: "student" });

    if (!student) {
      res.status(404);
      throw new Error("Student not found");
    }

    // Whitelist - email/password/role changes are intentionally excluded here too
    const editableFields = ["name", "department", "semester", "rollNumber"];
    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    const updated = await student.save();

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      student: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        department: updated.department,
        semester: updated.semester,
        rollNumber: updated.rollNumber,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res, next) => {
  try {
    const student = await User.findOne({ _id: req.params.id, role: "student" });

    if (!student) {
      res.status(404);
      throw new Error("Student not found");
    }

    await student.deleteOne();

    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};