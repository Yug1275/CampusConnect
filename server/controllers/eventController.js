const Event = require("../models/Event");

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Faculty/Admin
const createEvent = async (req, res, next) => {
  try {
    const { title, description, date, location, capacity } = req.body;

    if (!title || !date) {
      res.status(400);
      throw new Error("Title and date are required");
    }

    const event = await Event.create({
      title,
      description,
      date,
      location,
      capacity: capacity || null,
      createdBy: req.user._id,
    });

    const populated = await event.populate("createdBy", "name email");

    res.status(201).json({ success: true, event: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all events, optionally filtered by upcoming/past
// @route   GET /api/events?filter=upcoming|past
// @access  Private (any authenticated user)
const getEvents = async (req, res, next) => {
  try {
    const { filter } = req.query;

    const query = {};
    const now = new Date();

    if (filter === "upcoming") {
      query.date = { $gte: now };
    } else if (filter === "past") {
      query.date = { $lt: now };
    }

    const events = await Event.find(query)
      .populate("createdBy", "name email")
      .sort({ date: filter === "past" ? -1 : 1 });

    res.status(200).json({ success: true, count: events.length, events });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single event by ID
// @route   GET /api/events/:id
// @access  Private (any authenticated user)
const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id).populate("createdBy", "name email");

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    res.status(200).json({ success: true, event });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Faculty/Admin
const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    const { title, description, date, location, capacity } = req.body;

    if (title !== undefined) event.title = title;
    if (description !== undefined) event.description = description;
    if (date !== undefined) event.date = date;
    if (location !== undefined) event.location = location;
    if (capacity !== undefined) event.capacity = capacity || null;

    const updated = await event.save();
    const populated = await updated.populate("createdBy", "name email");

    res.status(200).json({ success: true, message: "Event updated successfully", event: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Faculty/Admin
const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      res.status(404);
      throw new Error("Event not found");
    }

    await event.deleteOne();

    res.status(200).json({ success: true, message: "Event deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
};