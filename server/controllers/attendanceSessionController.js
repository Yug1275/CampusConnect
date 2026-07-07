const crypto = require("crypto");
const AttendanceSession = require("../models/AttendanceSession");
const Subject = require("../models/Subject");
const Attendance = require("../models/Attendance");

const normalizeDate = (dateInput) => {
  const d = new Date(dateInput);
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

const SESSION_DURATION_MS = 5 * 60 * 1000; // 5 minutes

// @desc    Generate a new QR attendance session for a subject/date
// @route   POST /api/attendance/qr/generate
// @access  Private/Faculty/Admin
const generateSession = async (req, res, next) => {
  try {
    const { subject, date } = req.body;

    if (!subject || !date) {
      res.status(400);
      throw new Error("Subject and date are required");
    }

    const subjectDoc = await Subject.findById(subject);
    if (!subjectDoc) {
      res.status(404);
      throw new Error("Subject not found");
    }

    const attendanceDate = normalizeDate(date);
    const sessionToken = crypto.randomBytes(16).toString("hex");
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

    const session = await AttendanceSession.create({
      subject,
      date: attendanceDate,
      faculty: req.user._id,
      sessionToken,
      expiresAt,
    });

    res.status(201).json({
      success: true,
      session: {
        id: session._id,
        sessionToken: session.sessionToken,
        expiresAt: session.expiresAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the currently active (non-expired) session for a subject/date, if any
// @route   GET /api/attendance/qr/active?subject=&date=
// @access  Private/Faculty/Admin
const getActiveSession = async (req, res, next) => {
  try {
    const { subject, date } = req.query;

    if (!subject || !date) {
      res.status(400);
      throw new Error("Subject and date query parameters are required");
    }

    const attendanceDate = normalizeDate(date);

    const session = await AttendanceSession.findOne({
      subject,
      date: attendanceDate,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      session: session
        ? { id: session._id, sessionToken: session.sessionToken, expiresAt: session.expiresAt }
        : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark the logged-in student present by scanning a QR session token
// @route   POST /api/attendance/qr/scan
// @access  Private/Student
const markAttendanceViaQr = async (req, res, next) => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400);
      throw new Error("QR token is required");
    }

    const session = await AttendanceSession.findOne({ sessionToken: token }).populate({
      path: "subject",
      populate: { path: "department", select: "name" },
    });

    if (!session) {
      res.status(404);
      throw new Error("Invalid QR code. No matching session found");
    }

    if (session.expiresAt < new Date()) {
      res.status(400);
      throw new Error("This QR code has expired. Ask your faculty to generate a new one");
    }

    const subject = session.subject;

    // Eligibility check - student must belong to the subject's department + semester
    if (req.user.department !== subject.department.name || req.user.semester !== subject.semester) {
      res.status(403);
      throw new Error("You are not eligible to mark attendance for this subject");
    }

    // Upsert - same behavior as manual marking (Task 3): re-scanning just confirms "present" again
    await Attendance.findOneAndUpdate(
      { subject: subject._id, student: req.user._id, date: session.date },
      {
        $set: {
          status: "present",
          markedBy: session.faculty,
        },
      },
      { upsert: true, new: true }
    );

    res.status(200).json({
      success: true,
      message: `Attendance marked present for ${subject.name} (${subject.code})`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { generateSession, getActiveSession, markAttendanceViaQr };