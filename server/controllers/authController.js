const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error("User with this email already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
    });

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login an existing user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error("Email and password are required");
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Generic error message - do not reveal whether email exists
    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    // Compare entered password with stored hash
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    // req.user is already attached by the protect middleware
    res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

const adminOnlyTest = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: `Welcome, admin ${req.user.name}. You have access to this resource.`,
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req,res,next) => {
  try{
    const { email } = req.body;

    if(!email){
      res.status(400);
      throw new Error("Email is required");
    }

    const user = await User.findOne({email});

    // Always respond the same way, whether or not the email exists,
    // to avoid revealing which emails are registered

    if(!user){
      return res.status(200).json({
        success:true,
        message: "If this email is registeres, an OTP has been sent",
      });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // send OTP via email
    await sendEmail({
      to: user.email,
      subject: "CampusConnect - Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes. If you did not request this, please ignore this email.`
    });
  }catch(error){
    next(error);
  }
};

module.exports = { registerUser, loginUser, getProfile, adminOnlyTest, forgotPassword, };