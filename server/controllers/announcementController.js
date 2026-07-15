const Announcement = require("../models/Announcement");
const User = require("../models/User");
const { createNotification } = require("./notificationController");

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

    // Fire-and-forget: notify every user matching this announcement's targeting.
    // Reuses the same relevance logic as getAnnouncements (Task 1), applied
    // in reverse: instead of filtering announcements for one user, find all
    // users matching this one announcement's audience.
    (async () => {
      try {
        const roleQuery =
          announcement.targetRole === "all"
            ? { role: { $in: ["student", "faculty"] } }
            : { role: announcement.targetRole };

        const departmentQuery = announcement.targetDepartment
          ? { department: announcement.targetDepartment }
          : {};

        const recipients = await User.find({ ...roleQuery, ...departmentQuery }).select("_id");

        await Promise.all(
          recipients.map((recipient) =>
            createNotification({
              recipient: recipient._id,
              title: "New Announcement",
              message: announcement.title,
              type: "announcement",
              link: "/announcements",
            })
          )
        );
      } catch (err) {
        console.error("Failed to send announcement notifications:", err.message);
      }
    })();
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