import api from "./api";

export const getStudentsForSubject = (subjectId) =>
  api.get(`/attendance/subject/${subjectId}/students`);

export const getAttendanceForSubjectByDate = (subjectId, date) =>
  api.get(`/attendance/subject/${subjectId}`, { params: { date } });

export const markAttendance = (data) => api.post("/attendance/mark", data);

// Added in Task 5/6 - student's own attendance view
export const getMyAttendance = (params) => api.get("/attendance/my", { params });

export const getMyAttendanceSummary = () => api.get("/attendance/my/summary");