import api from "./api";

export const getAdminSummary = () => api.get("/admin/summary");