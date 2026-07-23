const User = require("../models/User");
const Event = require("../models/Event");
const Announcement = require("../models/Announcement");
const Subject = require("../models/Subject");
const Feedback = require("../models/Feedback");
const AttendanceSession = require("../models/AttendanceSession");

const getRelativeTime = (dateInput) => {
  const date = new Date(dateInput);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? "" : "s"} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
};

const formatDateTime = (dateInput) =>
  new Date(dateInput).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const getTodayDateBoundaryUtc = () => {
  const now = new Date();
  const dayStart = new Date(now);
  dayStart.setUTCHours(0, 0, 0, 0);
  return dayStart;
};

// @desc    Get dynamic recent activities for admin dashboard
// @route   GET /api/dashboard/admin/recent-activities
// @access  Private/Admin
const getAdminRecentActivities = async (req, res, next) => {
  try {
    const [latestStudents, latestFaculty, latestEvents, latestAnnouncements] = await Promise.all([
      User.find({ role: "student" }).select("name createdAt").sort({ createdAt: -1 }).limit(5),
      User.find({ role: "faculty" }).select("name department createdAt").sort({ createdAt: -1 }).limit(5),
      Event.find().select("title createdAt").sort({ createdAt: -1 }).limit(5),
      Announcement.find()
        .select("title createdAt")
        .populate("createdBy", "name")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    const activities = [
      ...latestStudents.map((student) => ({
        primary: `New student registered - ${student.name}`,
        at: student.createdAt,
      })),
      ...latestFaculty.map((faculty) => ({
        primary: `Faculty added${faculty.department ? ` to ${faculty.department} dept.` : ""} - ${faculty.name}`,
        at: faculty.createdAt,
      })),
      ...latestEvents.map((event) => ({
        primary: `New event created: ${event.title}`,
        at: event.createdAt,
      })),
      ...latestAnnouncements.map((announcement) => ({
        primary: `Announcement posted by ${announcement.createdBy?.name || "Admin"}`,
        at: announcement.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.at) - new Date(a.at))
      .slice(0, 8)
      .map((activity) => ({
        primary: activity.primary,
        secondary: getRelativeTime(activity.at),
      }));

    res.status(200).json({ success: true, count: activities.length, activities });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic student dashboard data based on today's attendance sessions
// @route   GET /api/dashboard/student/overview
// @access  Private/Student
const getStudentDashboardOverview = async (req, res, next) => {
  try {
    const today = getTodayDateBoundaryUtc();

    const subjectsBySemester = await Subject.find({
      semester: req.user.semester,
    })
      .populate("department", "name")
      .select("_id name code department");

    const subjects = subjectsBySemester.filter(
      (subject) => subject.department?.name === req.user.department
    );

    const subjectIds = subjects.map((subject) => subject._id);

    const sessions =
      subjectIds.length > 0
        ? await AttendanceSession.find({
            subject: { $in: subjectIds },
            date: today,
          })
            .populate("subject", "name code")
            .populate("faculty", "name")
            .sort({ createdAt: 1 })
        : [];

    const todaysClasses = sessions.map((session) => ({
      primary: session.subject?.name || "Class",
      secondary: `${formatDateTime(session.createdAt)}${session.faculty?.name ? `, ${session.faculty.name}` : ""}`,
      tag: "Live Session",
    }));

    res.status(200).json({
      success: true,
      overview: {
        todaysClasses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic faculty dashboard data
// @route   GET /api/dashboard/faculty/overview
// @access  Private/Faculty
const getFacultyDashboardOverview = async (req, res, next) => {
  try {
    const today = getTodayDateBoundaryUtc();
    const inThreeDays = new Date();
    inThreeDays.setDate(inThreeDays.getDate() + 3);

    const [subjects, todaySessions, pendingFeedback, upcomingEvents] = await Promise.all([
      Subject.find({ faculty: req.user._id })
        .populate("department", "name code")
        .select("name code semester department"),
      AttendanceSession.find({ faculty: req.user._id, date: today })
        .populate({ path: "subject", populate: { path: "department", select: "code name" } })
        .sort({ createdAt: 1 }),
      Feedback.find({ targetType: "faculty", targetFaculty: req.user._id, status: "new" })
        .select("message createdAt")
        .sort({ createdAt: -1 })
        .limit(5),
      Event.find({ createdBy: req.user._id, date: { $gte: new Date(), $lte: inThreeDays } })
        .select("title date")
        .sort({ date: 1 })
        .limit(5),
    ]);

    const todaysClasses = todaySessions.map((session) => {
      const deptCode = session.subject?.department?.code || session.subject?.department?.name || "Dept";
      const semester = session.subject?.semester ? ` Sem ${session.subject.semester}` : "";
      return {
        primary: `${session.subject?.name || "Class"} - ${deptCode}${semester}`,
        secondary: `Session opened ${formatDateTime(session.createdAt)}`,
      };
    });

    const subjectsWithoutSession = subjects
      .filter(
        (subject) =>
          !todaySessions.some(
            (session) => session.subject && session.subject._id.toString() === subject._id.toString()
          )
      )
      .slice(0, 3)
      .map((subject) => ({
        primary: `Open attendance for ${subject.name}`,
        secondary: "No session opened today",
        tag: "Pending",
      }));

    const feedbackTasks = pendingFeedback.map((feedback) => ({
      primary: `Review feedback submission`,
      secondary: `${feedback.message.slice(0, 48)}${feedback.message.length > 48 ? "..." : ""}`,
      tag: "Pending",
    }));

    const eventTasks = upcomingEvents.map((event) => ({
      primary: `Prepare event: ${event.title}`,
      secondary: `Due ${new Date(event.date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      })}`,
      tag: "Pending",
    }));

    const pendingTasks = [...subjectsWithoutSession, ...feedbackTasks, ...eventTasks].slice(0, 6);

    res.status(200).json({
      success: true,
      overview: {
        todaysClasses,
        pendingTasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAdminRecentActivities,
  getStudentDashboardOverview,
  getFacultyDashboardOverview,
};
