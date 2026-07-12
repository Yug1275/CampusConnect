const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    body: {
      type: String,
      required: [true, "Announcement body is required"],
      trim: true,
    },
    targetRole: {
      type: String,
      enum: ["all", "student", "faculty"],
      default: "all",
    },
    targetDepartment: {
      type: String,
      default: "", // empty string = all departments
      trim: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;