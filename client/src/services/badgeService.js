import api from "./api";

export const getMyBadges = () => api.get("/badges/my");

export const checkAndAwardBadges = () => api.post("/badges/check");

export const getStudentBadges = (studentId) => api.get(`/badges/student/${studentId}`);
