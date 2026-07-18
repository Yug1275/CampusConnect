const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // always stored, even if isAnonymous - needed for admin oversight
    },
    targetType: {
      type: String,
      enum: ["general", "faculty", "subject"],
      default: "general",
    },
    targetFaculty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    targetSubject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      default: null,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    message: {
      type: String,
      required: [true, "Feedback message is required"],
      trim: true,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["new", "reviewed"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;