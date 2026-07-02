const User = require("../models/User");
const generateOtp = require("../utils/generateOtp");

// @desc    Create a new faculty account (admin-provisioned)
// @route   POST /api/faculty
// @access  Private/Admin
const createFaculty = async (req, res, next) => {
  try {
    const { name, email, department, qualification, subjects } = req.body;

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
    // Faculty use "Forgot Password" (Phase 2) to set their own on first login.
    const tempPassword = generateOtp() + generateOtp();

    const faculty = await User.create({
      name,
      email,
      password: tempPassword,
      role: "faculty",
      department: department || "",
      qualification: qualification || "",
      subjects: Array.isArray(subjects) ? subjects : [],
    });

    res.status(201).json({
      success: true,
      message: "Faculty created successfully",
      faculty: {
        id: faculty._id,
        name: faculty.name,
        email: faculty.email,
        role: faculty.role,
        department: faculty.department,
        qualification: faculty.qualification,
        subjects: faculty.subjects,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all faculty with search, department filter, and pagination
// @route   GET /api/faculty?search=&department=&page=&limit=
// @access  Private/Admin
const getFaculty = async (req, res, next) => {
  try {
    const { search = "", department = "", page = 1, limit = 10 } = req.query;

    const query = { role: "faculty" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { qualification: { $regex: search, $options: "i" } },
      ];
    }

    if (department) {
      query.department = department;
    }

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [faculty, total] = await Promise.all([
      User.find(query)
        .select("-password -resetOtp -resetOtpExpiry")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: faculty.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      faculty,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single faculty member by ID
// @route   GET /api/faculty/:id
// @access  Private/Admin
const getFacultyById = async (req, res, next) => {
  try {
    const faculty = await User.findOne({ _id: req.params.id, role: "faculty" }).select(
      "-password -resetOtp -resetOtpExpiry"
    );

    if (!faculty) {
      res.status(404);
      throw new Error("Faculty member not found");
    }

    res.status(200).json({ success: true, faculty });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a faculty member
// @route   PUT /api/faculty/:id
// @access  Private/Admin
const updateFaculty = async (req, res, next) => {
  try {
    const faculty = await User.findOne({ _id: req.params.id, role: "faculty" });

    if (!faculty) {
      res.status(404);
      throw new Error("Faculty member not found");
    }

    // Whitelist - email/password/role changes intentionally excluded
    const editableFields = ["name", "department", "qualification", "subjects"];
    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        faculty[field] = req.body[field];
      }
    });

    const updated = await faculty.save();

    res.status(200).json({
      success: true,
      message: "Faculty updated successfully",
      faculty: {
        id: updated._id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        department: updated.department,
        qualification: updated.qualification,
        subjects: updated.subjects,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a faculty member
// @route   DELETE /api/faculty/:id
// @access  Private/Admin
const deleteFaculty = async (req, res, next) => {
  try {
    const faculty = await User.findOne({ _id: req.params.id, role: "faculty" });

    if (!faculty) {
      res.status(404);
      throw new Error("Faculty member not found");
    }

    await faculty.deleteOne();

    res.status(200).json({ success: true, message: "Faculty deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFaculty,
  getFaculty,
  getFacultyById,
  updateFaculty,
  deleteFaculty,
};