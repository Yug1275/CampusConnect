import api from "./api";

export const getAdminRecentActivities = () => api.get("/dashboard/admin/recent-activities");

export const getStudentDashboardOverview = () => api.get("/dashboard/student/overview");

export const getFacultyDashboardOverview = () => api.get("/dashboard/faculty/overview");
