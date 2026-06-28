const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const generateOtp = require("../utils/generateOtp");
const sendEmail = require("../utils/sendEmail");
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


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

    // Password strength validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!passwordRegex.test(password)) {
      res.status(400);
      throw new Error(
        "Password must be at least 8 characters and include 1 uppercase letter, 1 digit, and 1 special character"
      );
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

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400);
      throw new Error("Email is required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If this email is registered, an OTP has been sent",
      });
    }

    // Generate OTP and set 10-minute expiry
    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Respond to the client immediately - do NOT make them wait for email sending
    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
    });

    // Send the email AFTER responding (fire-and-forget, errors logged only)
    sendEmail({
      to: user.email,
      subject: "CampusConnect - Password Reset OTP",
      text: `Your OTP for password reset is ${otp}. It is valid for 10 minutes. If you did not request this, please ignore this email.`,
    }).catch((emailError) => {
      console.error("Failed to send OTP email:", emailError.message);
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      res.status(400);
      throw new Error("Email, OTP, and new password are required");
    }

    if (newPassword.length < 6) {
      res.status(400);
      throw new Error("New password must be at least 6 characters");
    }

    const user = await User.findOne({ email });

    if (!user) {
      res.status(400);
      throw new Error("Invalid email or OTP");
    }

    // Check OTP exists and matches
    if (!user.resetOtp || user.resetOtp !== otp) {
      res.status(400);
      throw new Error("Invalid email or OTP");
    }

    // Check OTP has not expired
    if (!user.resetOtpExpiry || user.resetOtpExpiry < Date.now()) {
      res.status(400);
      throw new Error("OTP has expired. Please request a new one");
    }

    // Update password (re-hashed automatically by pre-save hook)
    user.password = newPassword;

    // Clear OTP fields so they cannot be reused
    user.resetOtp = null;
    user.resetOtpExpiry = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      res.status(400);
      throw new Error("Google ID token is required");
    }

    // Verify the token with Google
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    if (!email) {
      res.status(400);
      throw new Error("Google account has no email associated");
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Link googleId if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }
    } else {
      // Create a new user with a random unusable password
      const randomPassword = generateOtp() + generateOtp(); // 12-digit random string

      user = await User.create({
        name: name || email.split("@")[0],
        email,
        password: randomPassword,
        role: "student", // default role for self-registered Google users
        googleId,
      });
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
    res.status(401);
    next(new Error("Google authentication failed. Please try again"));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  adminOnlyTest,
  forgotPassword,
  resetPassword,
  googleLogin,
};