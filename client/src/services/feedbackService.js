import api from "./api";

export const submitFeedback = (data) => api.post("/feedback", data);

export const getMyFeedback = () => api.get("/feedback/my");

export const getFeedbackForFaculty = () => api.get("/feedback/faculty");

export const getAllFeedback = () => api.get("/feedback/all");

export const updateFeedbackStatus = (id, status) => api.put(`/feedback/${id}/status`, { status });