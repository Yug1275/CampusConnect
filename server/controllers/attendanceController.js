const Attendance = require("../models/Attendance");
const Subject = require("../models/Subject");
const User = require("../models/User");

// Normalizes a date to midnight UTC, so "2026-01-05T14:30:00" and
// "2026-01-05T09:00:00" are treated as the same attendance day.
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

    // Students store department as a name string (Phase 2 schema);
    // Subject stores department as a reference - bridge via the populated name.
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
// @body    { subject, date, records: [{ student, status }] }
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

    // Build one upsert operation per student - creates if new,
    // updates status if already marked for this subject/date.
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
//          (used to pre-fill the marking UI if re-opened same day)
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

module.exports = {
  getStudentsForSubject,
  markAttendance,
  getAttendanceForSubjectByDate,
};