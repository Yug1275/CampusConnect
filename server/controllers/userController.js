const User = require("../models/User");

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
const getMyProfile = async (req, res, next) => {
  try {
    // req.user is already attached by the protect middleware, password excluded
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/users/profile
// @access  Private
const updateMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Whitelist of fields any user is allowed to update themselves.
    // Email, password, and role are intentionally excluded - they
    // require separate, more controlled flows (reset-password, admin actions).
    const editableFields = [
      "name",
      "department",
      "semester",
      "rollNumber",
      "qualification",
      "subjects",
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage,
        department: updatedUser.department,
        semester: updatedUser.semester,
        rollNumber: updatedUser.rollNumber,
        qualification: updatedUser.qualification,
        subjects: updatedUser.subjects,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyProfile, updateMyProfile };