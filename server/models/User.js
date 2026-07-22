const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["student", "faculty", "admin"],
      default: "student",
    },
    profileImage: {
      type: String,
      default: "",
    },

    // Student-specific fields
    department: {
      type: String,
      default: "",
    },
    semester: {
      type: Number,
      default: null,
    },
    rollNumber: {
      type: String,
      default: "",
    },
    bloodGroup: {
      type: String,
      default: "",
    },
    emergencyContact: {
      type: String,
      default: "",
    },

    // Faculty-specific fields
    qualification: {
      type: String,
      default: "",
    },
    subjects: {
      type: [String],
      default: [],
    },

    // Auth-related fields (used in later tasks)
    googleId: {
      type: String,
      default: null,
    },
    resetOtp: {
      type: String,
      default: null,
    },
    resetOtpExpiry: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving, only if it was modified
userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;