const Badge = require("../models/Badge");
const User = require("../models/User");
const Attendance = require("../models/Attendance");
const ClubMembership = require("../models/ClubMembership");
const EventRegistration = require("../models/EventRegistration");
const mongoose = require("mongoose");

const BADGE_LABELS = {
  high_attendance: "High Attendance",
  club_member: "Club Member",
  event_participant: "Event Participant",
  top_performer: "Top Performer",
  volunteer: "Volunteer",
};

// Awards a badge if the student doesn't already have it - silently
// no-ops on duplicate (relies on the unique index) rather than checking first,
// avoiding a race between check-then-create.
const awardBadgeIfEligible = async (studentId, type) => {
  try {
    await Badge.create({ student: studentId, type, label: BADGE_LABELS[type] });
  } catch (error) {
    // Duplicate key error (11000) means they already have it - expected, not a failure
    if (error.code !== 11000) {
      console.error(`Failed to award badge ${type}:`, error.message);
    }
  }
};

// @desc    Get the logged-in student's earned badges
// @route   GET /api/badges/my
// @access  Private (student)
const getMyBadges = async (req, res, next) => {
  try {
    const badges = await Badge.find({ student: req.user._id }).sort({ awardedAt: -1 });
    res.status(200).json({ success: true, count: badges.length, badges });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a specific student's badges (admin/faculty view)
// @route   GET /api/badges/student/:studentId
// @access  Private/Faculty/Admin
const getStudentBadges = async (req, res, next) => {
  try {
    const badges = await Badge.find({ student: req.params.studentId }).sort({ awardedAt: -1 });
    res.status(200).json({ success: true, count: badges.length, badges });
  } catch (error) {
    next(error);
  }
};

// @desc    Recompute and award any newly-eligible badges for the logged-in student.
//          Called on-demand (e.g., when visiting the dashboard/profile) rather than
//          via a background job, since this project has no persistent scheduler.
// @route   POST /api/badges/check
// @access  Private (student)
const checkAndAwardBadges = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    // High Attendance: overall attendance >= 90%
    const attendanceAgg = await Attendance.aggregate([
      { $match: { student: new mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
        },
      },
    ]);
    if (attendanceAgg.length > 0) {
      const { total, present } = attendanceAgg[0];
      if (total >= 5 && present / total >= 0.9) {
        await awardBadgeIfEligible(studentId, "high_attendance");
      }
    }

    // Club Member: joined at least one club
    const clubCount = await ClubMembership.countDocuments({ student: studentId });
    if (clubCount > 0) {
      await awardBadgeIfEligible(studentId, "club_member");
    }

    // Event Participant: registered for at least one event
    const eventCount = await EventRegistration.countDocuments({ student: studentId });
    if (eventCount > 0) {
      await awardBadgeIfEligible(studentId, "event_participant");
    }

    const badges = await Badge.find({ student: studentId }).sort({ awardedAt: -1 });

    res.status(200).json({ success: true, badges });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyBadges, getStudentBadges, checkAndAwardBadges };