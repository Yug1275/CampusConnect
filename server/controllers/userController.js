const User = require("../models/User");

// @desc    Get logged-in user's profile
// @route   GET /api/users/profile
// @access  Private
const getMyProfile = async (req, res, next) => {
  try {
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

    // server/controllers/userController.js - editableFields array
    const editableFields = [
      "name", "department", "semester", "rollNumber",
      "qualification", "subjects", "bloodGroup", "emergencyContact",
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
        bloodGroup: updatedUser.bloodGroup,
        emergencyContact: updatedUser.emergencyContact,
        qualification: updatedUser.qualification,
        subjects: updatedUser.subjects,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload/update logged-in user's profile picture
// @route   POST /api/users/profile/picture
// @access  Private
const updateProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error("Please upload an image file");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Store relative path - frontend will prefix with the backend base URL
    user.profileImage = `/uploads/${req.file.filename}`;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      profileImage: user.profileImage,
    });
  } catch (error) {
    next(error);
  }
};



module.exports = { getMyProfile, updateMyProfile, updateProfilePicture };