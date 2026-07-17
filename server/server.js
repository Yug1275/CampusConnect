require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const requestLogger = require("./middleware/requestLogger");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const studentRoutes = require("./routes/studentRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const adminRoutes = require("./routes/adminRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const attendanceSessionRoutes = require("./routes/attendanceSessionRoutes");
const eventRoutes = require("./routes/eventRoutes");
const eventRegistrationRoutes = require("./routes/eventRegistrationRoutes");
const clubRoutes = require("./routes/clubRoutes");
const locationRoutes = require("./routes/locationRoutes");
const announcementRoutes = require("./routes/announcementRoutes");
const searchRoutes = require("./routes/searchRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

connectDB();

const app = express();

app.use(express.json());
app.use(cors());
app.use(requestLogger);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "CampusConnect API is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/attendance/qr", attendanceSessionRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/events", eventRegistrationRoutes);
app.use("/api/clubs", clubRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});