import api from "./api";

export const getAttendanceTrend = () => api.get("/analytics/attendance-trend");

export const getStudentsPerDepartment = () => api.get("/analytics/students-per-department");

export const getFacultyDistribution = () => api.get("/analytics/faculty-distribution");

export const getClubMembershipStats = () => api.get("/analytics/club-membership");

export const getEventParticipationStats = () => api.get("/analytics/event-participation");