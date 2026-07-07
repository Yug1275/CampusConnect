const Attendance = require("../models/Attendance");
const Subject = require("../models/Subject");
const User = require("../models/User");
const mongoose = require("mongoose");

const normalizeDate = (dateInput) => {
  const d = new Date(dateInput);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

// @desc    Get students eligible for a subject (same department + semester)
// @route   GET /api/attendance/subject/:subjectId/students
// @access  Private/Faculty/Admin
const getStudentsForSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findById(req.params.subjectId).populate("department", "name");

    if (!subject) {
      res.status(404);
      throw new Error("Subject not found");
    }

    const students = await User.find({
      role: "student",
      department: subject.department.name,
      semester: subject.semester,
    })
      .select("name email rollNumber")
      .sort({ rollNumber: 1, name: 1 });

    res.status(200).json({ success: true, subject, count: students.length, students });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark attendance for multiple students in a subject on a given date
// @route   POST /api/attendance/mark
// @access  Private/Faculty/Admin
const markAttendance = async (req, res, next) => {
  try {
    const { subject, date, records } = req.body;

    if (!subject || !date || !Array.isArray(records) || records.length === 0) {
      res.status(400);
      throw new Error("Subject, date, and at least one attendance record are required");
    }

    const subjectDoc = await Subject.findById(subject);
    if (!subjectDoc) {
      res.status(404);
      throw new Error("Subject not found");
    }

    const attendanceDate = normalizeDate(date);

    const bulkOps = records.map(({ student, status }) => ({
      updateOne: {
        filter: { subject, student, date: attendanceDate },
        update: {
          $set: {
            status,
            markedBy: req.user._id,
          },
        },
        upsert: true,
      },
    }));

    const result = await Attendance.bulkWrite(bulkOps);

    res.status(200).json({
      success: true,
      message: "Attendance marked successfully",
      summary: {
        matched: result.matchedCount,
        created: result.upsertedCount,
        modified: result.modifiedCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get attendance already marked for a subject on a given date
// @route   GET /api/attendance/subject/:subjectId?date=
// @access  Private/Faculty/Admin
const getAttendanceForSubjectByDate = async (req, res, next) => {
  try {
    const { date } = req.query;

    if (!date) {
      res.status(400);
      throw new Error("Date query parameter is required");
    }

    const attendanceDate = normalizeDate(date);

    const records = await Attendance.find({
      subject: req.params.subjectId,
      date: attendanceDate,
    }).select("student status");

    res.status(200).json({ success: true, records });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the logged-in student's own attendance history
// @route   GET /api/attendance/my?subject=
// @access  Private (student)
const getMyAttendance = async (req, res, next) => {
  try {
    const { subject } = req.query;

    const query = { student: req.user._id };
    if (subject) query.subject = subject;

    const records = await Attendance.find(query)
      .populate("subject", "name code")
      .sort({ date: -1 });

    res.status(200).json({ success: true, count: records.length, records });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the logged-in student's attendance percentage,
//          overall and broken down per subject
// @route   GET /api/attendance/my/summary
// @access  Private (student)
const getMyAttendanceSummary = async (req, res, next) => {
  try {
    const studentId = req.user._id;

    const perSubject = await Attendance.aggregate([
      { $match: { student: new mongoose.Types.ObjectId(studentId) } },
      {
        $group: {
          _id: "$subject",
          totalClasses: { $sum: 1 },
          presentCount: {
            $sum: { $cond: [{ $eq: ["$status", "present"] }, 1, 0] },
          },
        },
      },
      {
        $lookup: {
          from: "subjects",
          localField: "_id",
          foreignField: "_id",
          as: "subjectInfo",
        },
      },
      { $unwind: "$subjectInfo" },
      {
        $project: {
          _id: 0,
          subjectId: "$_id",
          subjectName: "$subjectInfo.name",
          subjectCode: "$subjectInfo.code",
          totalClasses: 1,
          presentCount: 1,
          percentage: {
            $round: [
              { $multiply: [{ $divide: ["$presentCount", "$totalClasses"] }, 100] },
              1,
            ],
          },
        },
      },
      { $sort: { subjectName: 1 } },
    ]);

    const totalClasses = perSubject.reduce((sum, s) => sum + s.totalClasses, 0);
    const totalPresent = perSubject.reduce((sum, s) => sum + s.presentCount, 0);
    const overallPercentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 1000) / 10 : 0;

    res.status(200).json({
      success: true,
      overall: {
        totalClasses,
        totalPresent,
        percentage: overallPercentage,
      },
      perSubject,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudentsForSubject,
  markAttendance,
  getAttendanceForSubjectByDate,
  getMyAttendance,
  getMyAttendanceSummary,
};