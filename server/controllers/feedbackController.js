const Feedback = require("../models/Feedback");

// @desc    Submit new feedback
// @route   POST /api/feedback
// @access  Private (student)
const submitFeedback = async (req, res, next) => {
  try {
    const { targetType, targetFaculty, targetSubject, rating, message, isAnonymous } = req.body;

    if (!message) {
      res.status(400);
      throw new Error("Feedback message is required");
    }

    if (targetType === "faculty" && !targetFaculty) {
      res.status(400);
      throw new Error("A target faculty member is required for faculty-specific feedback");
    }

    if (targetType === "subject" && !targetSubject) {
      res.status(400);
      throw new Error("A target subject is required for subject-specific feedback");
    }

    const feedback = await Feedback.create({
      student: req.user._id,
      targetType: targetType || "general",
      targetFaculty: targetType === "faculty" ? targetFaculty : null,
      targetSubject: targetType === "subject" ? targetSubject : null,
      rating: rating || null,
      message,
      isAnonymous: !!isAnonymous,
    });

    res.status(201).json({ success: true, message: "Feedback submitted successfully", feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the logged-in student's own feedback submission history
// @route   GET /api/feedback/my
// @access  Private (student)
const getMyFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find({ student: req.user._id })
      .populate("targetFaculty", "name")
      .populate("targetSubject", "name code")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: feedback.length, feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Get feedback targeted at the logged-in faculty member.
//          Submitter identity is hidden if the feedback was submitted anonymously.
// @route   GET /api/feedback/faculty
// @access  Private/Faculty
const getFeedbackForFaculty = async (req, res, next) => {
  try {
    const feedbackDocs = await Feedback.find({
      targetType: "faculty",
      targetFaculty: req.user._id,
    })
      .populate("student", "name")
      .populate("targetSubject", "name code")
      .sort({ createdAt: -1 });

    // Strip identity for anonymous submissions before sending to faculty
    const feedback = feedbackDocs.map((f) => {
      const obj = f.toObject();
      if (obj.isAnonymous) {
        obj.student = { name: "Anonymous" };
      }
      return obj;
    });

    res.status(200).json({ success: true, count: feedback.length, feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all feedback, unfiltered, with real identities regardless of anonymity
// @route   GET /api/feedback/all
// @access  Private/Admin
const getAllFeedback = async (req, res, next) => {
  try {
    const feedback = await Feedback.find()
      .populate("student", "name email")
      .populate("targetFaculty", "name")
      .populate("targetSubject", "name code")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: feedback.length, feedback });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a feedback entry's status (mark reviewed)
// @route   PUT /api/feedback/:id/status
// @access  Private/Faculty/Admin
const updateFeedbackStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!["new", "reviewed"].includes(status)) {
      res.status(400);
      throw new Error("Invalid status value");
    }

    const feedback = await Feedback.findById(req.params.id);

    if (!feedback) {
      res.status(404);
      throw new Error("Feedback not found");
    }

    // A faculty member may only update the status of feedback actually
    // targeted at them - prevents marking someone else's feedback as reviewed
    if (
      req.user.role === "faculty" &&
      (!feedback.targetFaculty || feedback.targetFaculty.toString() !== req.user._id.toString())
    ) {
      res.status(403);
      throw new Error("You can only update feedback targeted at you");
    }

    feedback.status = status;
    await feedback.save();

    res.status(200).json({ success: true, message: "Feedback status updated", feedback });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitFeedback,
  getMyFeedback,
  getFeedbackForFaculty,
  getAllFeedback,
  updateFeedbackStatus,
};