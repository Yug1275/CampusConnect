const crypto = require("crypto");
const AttendanceSession = require("../models/AttendanceSession");
const Subject = require("../models/Subject");

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

module.exports = { generateSession, getActiveSession };