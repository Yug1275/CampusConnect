import api from "./api";

export const getStudentsForSubject = (subjectId) =>
  api.get(`/attendance/subject/${subjectId}/students`);

export const getAttendanceForSubjectByDate = (subjectId, date) =>
  api.get(`/attendance/subject/${subjectId}`, { params: { date } });

export const markAttendance = (data) => api.post("/attendance/mark", data);

export const getMyAttendance = (params) => api.get("/attendance/my", { params });

export const getMyAttendanceSummary = () => api.get("/attendance/my/summary");

// Added in Task 9 - faculty's average attendance across their subjects
export const getFacultyAttendanceSummary = () => api.get("/attendance/faculty/summary");