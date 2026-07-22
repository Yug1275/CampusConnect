const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["high_attendance", "club_member", "event_participant", "top_performer", "volunteer"],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    awardedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// A student can only earn each specific badge type once
badgeSchema.index({ student: 1, type: 1 }, { unique: true });

const Badge = mongoose.model("Badge", badgeSchema);

module.exports = Badge;