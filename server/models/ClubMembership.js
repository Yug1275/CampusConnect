const mongoose = require("mongoose");

const clubMembershipSchema = new mongoose.Schema(
  {
    club: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Club",
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// A student can only join a club once
clubMembershipSchema.index({ club: 1, student: 1 }, { unique: true });

const ClubMembership = mongoose.model("ClubMembership", clubMembershipSchema);

module.exports = ClubMembership;