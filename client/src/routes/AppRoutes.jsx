import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import DashboardRouter from "../pages/DashboardRouter";
import Profile from "../pages/Profile";
import DepartmentManagement from "../pages/admin/DepartmentManagement";
import DepartmentDetail from "../pages/admin/DepartmentDetail";
import StudentManagement from "../pages/admin/StudentManagement";
import FacultyManagement from "../pages/admin/FacultyManagement";
import SubjectManagement from "../pages/admin/SubjectManagement";
import MarkAttendance from "../pages/faculty/MarkAttendance";
import AttendanceHistory from "../pages/student/AttendanceHistory";
import ScanAttendance from "../pages/student/ScanAttendance";
import EventManagement from "../pages/shared/EventManagement";
import BrowseEvents from "../pages/student/BrowseEvents";
import EventTicket from "../pages/student/EventTicket";
import ScanEventTicket from "../pages/shared/ScanEventTicket";
import ProtectedRoute from "./ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/departments"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DepartmentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/departments/:id"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DepartmentDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/students"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <StudentManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/faculty"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <FacultyManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/subjects"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <SubjectManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/attendance"
        element={
          <ProtectedRoute allowedRoles={["faculty", "admin"]}>
            <MarkAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/attendance"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <AttendanceHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/scan-attendance"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <ScanAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/manage"
        element={
          <ProtectedRoute allowedRoles={["faculty", "admin"]}>
            <EventManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/events"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <BrowseEvents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/events/:eventId/ticket"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <EventTicket />
          </ProtectedRoute>
        }
      />
      <Route
        path="/events/scan-ticket"
        element={
          <ProtectedRoute allowedRoles={["faculty", "admin"]}>
            <ScanEventTicket />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;