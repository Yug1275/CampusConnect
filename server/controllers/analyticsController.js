const User = require("../models/User");
const Attendance = require("../models/Attendance");
const Club = require("../models/Club");
const ClubMembership = require("../models/ClubMembership");
const Event = require("../models/Event");
const EventRegistration = require("../models/EventRegistration");

// @desc    Get average attendance percentage per day for the last 14 days
// @route   GET /api/analytics/attendance-trend
// @access  Private/Admin
const getAttendanceTrend = async (req, res, next) => {
  try {
    const fourteenDaysAgo = new Date();
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
    fourteenDaysAgo.setUTCHours(0, 0, 0, 0);

    const trend = await Attendance.aggregate([
      { $match: { date: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          total: { $sum: 1 },
          present: { $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] } },
        },
      },
      {
        $project: {
          _id: 0,
          date: "$_id",
          percentage: {
            $round: [{ $multiply: [{ $divide: ["$present", "$total"] }, 100] }, 1],
          },
        },
      },
      { $sort: { date: 1 } },
    ]);

    res.status(200).json({ success: true, trend });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student count grouped by department
// @route   GET /api/analytics/students-per-department
// @access  Private/Admin
const getStudentsPerDepartment = async (req, res, next) => {
  try {
    const data = await User.aggregate([
      { $match: { role: "student", department: { $ne: "" } } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $project: { _id: 0, department: "$_id", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get faculty count grouped by department
// @route   GET /api/analytics/faculty-distribution
// @access  Private/Admin
const getFacultyDistribution = async (req, res, next) => {
  try {
    const data = await User.aggregate([
      { $match: { role: "faculty", department: { $ne: "" } } },
      { $group: { _id: "$department", count: { $sum: 1 } } },
      { $project: { _id: 0, department: "$_id", count: 1 } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get member count per club
// @route   GET /api/analytics/club-membership
// @access  Private/Admin
const getClubMembershipStats = async (req, res, next) => {
  try {
    const clubs = await Club.find().select("name");

    const data = await Promise.all(
      clubs.map(async (club) => {
        const count = await ClubMembership.countDocuments({ club: club._id });
        return { club: club.name, count };
      })
    );

    data.sort((a, b) => b.count - a.count);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

// @desc    Get registration count per event (top 10)
// @route   GET /api/analytics/event-participation
// @access  Private/Admin
const getEventParticipationStats = async (req, res, next) => {
  try {
    const data = await EventRegistration.aggregate([
      { $group: { _id: "$event", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "_id",
          as: "eventInfo",
        },
      },
      { $unwind: "$eventInfo" },
      {
        $project: {
          _id: 0,
          event: "$eventInfo.title",
          count: 1,
        },
      },
    ]);

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAttendanceTrend,
  getStudentsPerDepartment,
  getFacultyDistribution,
  getClubMembershipStats,
  getEventParticipationStats,
};