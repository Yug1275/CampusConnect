const EventRegistration = require("../models/EventRegistration");
const Event = require("../models/Event");
const { createNotification } = require("./notificationController");

// @desc    Register the logged-in student for an event
// @route   POST /api/events/:eventId/register
// @access  Private
const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.eventId);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    if (new Date(event.date) < new Date()) {
      res.status(400);
      throw new Error("Cannot register for a past event");
    }

    const existing = await EventRegistration.findOne({
      event: req.params.eventId,
      student: req.user._id,
    });
    if (existing) {
      res.status(400);
      throw new Error("You are already registered for this event");
    }

    if (event.capacity) {
      const currentCount = await EventRegistration.countDocuments({ event: req.params.eventId });
      if (currentCount >= event.capacity) {
        res.status(400);
        throw new Error("This event has reached full capacity");
      }
    }

    const crypto = require("crypto");
    const ticketCode = crypto.randomBytes(12).toString("hex");

    const registration = await EventRegistration.create({
      event: req.params.eventId,
      student: req.user._id,
      ticketCode,
    });

    res.status(201).json({
      success: true,
      message: "Successfully registered for the event",
      registration,
    });

    // Fire-and-forget: registration confirmation notification
    createNotification({
      recipient: req.user._id,
      title: "Event Registration Confirmed",
      message: `You're registered for ${event.title} on ${new Date(event.date).toLocaleDateString()}. Your ticket is ready.`,
      type: "event",
      link: `/student/events/${event._id}/ticket`,
    }).catch((err) => console.error("Failed to send registration notification:", err.message));
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel the logged-in student's registration for an event
// @route   DELETE /api/events/:eventId/register
// @access  Private
const cancelRegistration = async (req, res, next) => {
  try {
    const registration = await EventRegistration.findOne({
      event: req.params.eventId,
      student: req.user._id,
    });

    if (!registration) {
      res.status(404);
      throw new Error("You are not registered for this event");
    }

    await registration.deleteOne();

    res.status(200).json({ success: true, message: "Registration cancelled successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the logged-in student's registered events
// @route   GET /api/events/my/registrations
// @access  Private
const getMyRegistrations = async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({ student: req.user._id })
      .populate("event")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: registrations.length, registrations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get list of students registered for a specific event (organizer view)
// @route   GET /api/events/:eventId/registrations
// @access  Private/Faculty/Admin
const getEventRegistrations = async (req, res, next) => {
  try {
    const registrations = await EventRegistration.find({ event: req.params.eventId })
      .populate("student", "name email rollNumber")
      .sort({ createdAt: 1 });

    res.status(200).json({ success: true, count: registrations.length, registrations });
  } catch (error) {
    next(error);
  }
};

// @desc    Get the logged-in student's ticket (QR payload) for a specific event
// @route   GET /api/events/:eventId/ticket
// @access  Private (student)
const getMyTicket = async (req, res, next) => {
  try {
    const registration = await EventRegistration.findOne({
      event: req.params.eventId,
      student: req.user._id,
    }).populate("event", "title date location");

    if (!registration) {
      res.status(404);
      throw new Error("You are not registered for this event");
    }

    res.status(200).json({
      success: true,
      ticket: {
        ticketCode: registration.ticketCode,
        checkedIn: registration.checkedIn,
        checkedInAt: registration.checkedInAt,
        event: registration.event,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify and check in a ticket by its code (organizer scan)
// @route   POST /api/events/tickets/verify
// @access  Private/Faculty/Admin
const verifyTicket = async (req, res, next) => {
  try {
    const { ticketCode } = req.body;

    if (!ticketCode) {
      res.status(400);
      throw new Error("Ticket code is required");
    }

    const registration = await EventRegistration.findOne({ ticketCode })
      .populate("event", "title date")
      .populate("student", "name email rollNumber");

    if (!registration) {
      res.status(404);
      throw new Error("Invalid ticket. No matching registration found");
    }

    if (registration.checkedIn) {
      res.status(400);
      throw new Error(
        `This ticket was already checked in at ${new Date(registration.checkedInAt).toLocaleTimeString()}`
      );
    }

    registration.checkedIn = true;
    registration.checkedInAt = new Date();
    await registration.save();

    res.status(200).json({
      success: true,
      message: `Checked in: ${registration.student.name} for ${registration.event.title}`,
      student: registration.student,
      event: registration.event,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
  getMyTicket,
  verifyTicket,
};