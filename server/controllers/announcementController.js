const Announcement = require("../models/Announcement");

// @desc    Create a new announcement
// @route   POST /api/announcements
// @access  Private/Faculty/Admin
const createAnnouncement = async (req, res, next) => {
  try {
    const { title, body, targetRole, targetDepartment } = req.body;

    if (!title || !body) {
      res.status(400);
      throw new Error("Title and body are required");
    }

    const announcement = await Announcement.create({
      title,
      body,
      targetRole: targetRole || "all",
      targetDepartment: targetDepartment || "",
      createdBy: req.user._id,
    });

    const populated = await announcement.populate("createdBy", "name role");

    res.status(201).json({ success: true, announcement: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get announcements relevant to the logged-in user
//          (matches their role and, if set, their department)
// @route   GET /api/announcements
// @access  Private (any authenticated user)
const getAnnouncements = async (req, res, next) => {
  try {
    const query = {
      $or: [{ targetRole: "all" }, { targetRole: req.user.role }],
    };

    // If the announcement targets a specific department, only show it to
    // users in that department; announcements with no department target (empty string) show to everyone
    const departmentQuery = {
      $or: [{ targetDepartment: "" }, { targetDepartment: req.user.department || "" }],
    };

    const announcements = await Announcement.find({ $and: [query, departmentQuery] })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: announcements.length, announcements });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all announcements, unfiltered (management view)
// @route   GET /api/announcements/all
// @access  Private/Faculty/Admin
const getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await Announcement.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: announcements.length, announcements });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single announcement by ID
// @route   GET /api/announcements/:id
// @access  Private (any authenticated user)
const getAnnouncementById = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate(
      "createdBy",
      "name role"
    );

    if (!announcement) {
      res.status(404);
      throw new Error("Announcement not found");
    }

    res.status(200).json({ success: true, announcement });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an announcement
// @route   PUT /api/announcements/:id
// @access  Private/Faculty/Admin
const updateAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      res.status(404);
      throw new Error("Announcement not found");
    }

    const { title, body, targetRole, targetDepartment } = req.body;

    if (title !== undefined) announcement.title = title;
    if (body !== undefined) announcement.body = body;
    if (targetRole !== undefined) announcement.targetRole = targetRole;
    if (targetDepartment !== undefined) announcement.targetDepartment = targetDepartment;

    const updated = await announcement.save();
    const populated = await updated.populate("createdBy", "name role");

    res.status(200).json({
      success: true,
      message: "Announcement updated successfully",
      announcement: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Faculty/Admin
const deleteAnnouncement = async (req, res, next) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      res.status(404);
      throw new Error("Announcement not found");
    }

    await announcement.deleteOne();

    res.status(200).json({ success: true, message: "Announcement deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};