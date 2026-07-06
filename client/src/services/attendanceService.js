import api from "./api";

export const getStudentsForSubject = (subjectId) =>
  api.get(`/attendance/subject/${subjectId}/students`);

export const getAttendanceForSubjectByDate = (subjectId, date) =>
  api.get(`/attendance/subject/${subjectId}`, { params: { date } });

export const markAttendance = (data) => api.post("/attendance/mark", data);