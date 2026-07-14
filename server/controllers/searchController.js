const User = require("../models/User");
const Department = require("../models/Department");
const Club = require("../models/Club");
const Event = require("../models/Event");
const Announcement = require("../models/Announcement");

const MIN_QUERY_LENGTH = 2;

// @desc    Search across Students, Faculty, Departments, Clubs, Events, and Announcements
// @route   GET /api/search?q=
// @access  Private (any authenticated user - results scoped per category by role)
const globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length < MIN_QUERY_LENGTH) {
      return res.status(200).json({
        success: true,
        query: q || "",
        results: {
          students: [],
          faculty: [],
          departments: [],
          clubs: [],
          events: [],
          announcements: [],
        },
        totalCount: 0,
      });
    }

    const query = q.trim();
    const regex = { $regex: query, $options: "i" };
    const isAdmin = req.user.role === "admin";

    const [studentsRaw, facultyRaw, departmentsRaw, clubsRaw, eventsRaw, announcementsRaw] =
      await Promise.all([
        // Students - admin only, matches Phase 4's access model
        isAdmin
          ? User.find({
              role: "student",
              $or: [{ name: regex }, { email: regex }, { rollNumber: regex }],
            }).limit(10)
          : Promise.resolve([]),

        // Faculty - admin only, matches Phase 4's access model
        isAdmin
          ? User.find({
              role: "faculty",
              $or: [{ name: regex }, { email: regex }, { qualification: regex }],
            }).limit(10)
          : Promise.resolve([]),

        // Departments - open to all roles (Phase 4)
        Department.find({
          $or: [{ name: regex }, { code: regex }],
        }).limit(10),

        // Clubs - open to all roles (Phase 6)
        Club.find({
          $or: [{ name: regex }, { category: regex }, { description: regex }],
        }).limit(10),

        // Events - open to all roles (Phase 6)
        Event.find({
          $or: [{ title: regex }, { description: regex }, { location: regex }],
        }).limit(10),

        // Announcements - relevance-filtered exactly like getAnnouncements (Task 1)
        Announcement.find({
          $and: [
            { $or: [{ targetRole: "all" }, { targetRole: req.user.role }] },
            {
              $or: [
                { targetDepartment: "" },
                { targetDepartment: req.user.department || "" },
              ],
            },
            { $or: [{ title: regex }, { body: regex }] },
          ],
        }).limit(10),
      ]);

    // Normalize every result type into a consistent shape for the frontend
    const students = studentsRaw.map((s) => ({
      id: s._id,
      title: s.name,
      subtitle: `${s.email}${s.rollNumber ? ` · ${s.rollNumber}` : ""}`,
      type: "student",
      link: "/admin/students",
    }));

    const faculty = facultyRaw.map((f) => ({
      id: f._id,
      title: f.name,
      subtitle: `${f.email}${f.qualification ? ` · ${f.qualification}` : ""}`,
      type: "faculty",
      link: "/admin/faculty",
    }));

    const departments = departmentsRaw.map((d) => ({
      id: d._id,
      title: d.name,
      subtitle: d.code,
      type: "department",
      link: `/admin/departments/${d._id}`,
    }));

    const clubs = clubsRaw.map((c) => ({
      id: c._id,
      title: c.name,
      subtitle: c.category,
      type: "club",
      link: "/student/clubs",
    }));

    const events = eventsRaw.map((e) => ({
      id: e._id,
      title: e.title,
      subtitle: new Date(e.date).toLocaleDateString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      type: "event",
      link: "/student/events",
    }));

    const announcements = announcementsRaw.map((a) => ({
      id: a._id,
      title: a.title,
      subtitle: a.body.length > 60 ? `${a.body.slice(0, 60)}...` : a.body,
      type: "announcement",
      link: "/announcements",
    }));

    const totalCount =
      students.length +
      faculty.length +
      departments.length +
      clubs.length +
      events.length +
      announcements.length;

    res.status(200).json({
      success: true,
      query,
      results: { students, faculty, departments, clubs, events, announcements },
      totalCount,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { globalSearch };