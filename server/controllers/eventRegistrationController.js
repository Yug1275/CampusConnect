const EventRegistration = require("../models/EventRegistration");
const Event = require("../models/Event");

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

    // Enforce capacity if one is set
    if (event.capacity) {
      const currentCount = await EventRegistration.countDocuments({ event: req.params.eventId });
      if (currentCount >= event.capacity) {
        res.status(400);
        throw new Error("This event has reached full capacity");
      }
    }

    const registration = await EventRegistration.create({
      event: req.params.eventId,
      student: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Successfully registered for the event",
      registration,
    });
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

module.exports = {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations,
};