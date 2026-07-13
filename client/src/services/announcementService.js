import api from "./api";

export const getAnnouncements = () => api.get("/announcements");

export const getAllAnnouncements = () => api.get("/announcements/all");

export const getAnnouncementById = (id) => api.get(`/announcements/${id}`);

export const createAnnouncement = (data) => api.post("/announcements", data);

export const updateAnnouncement = (id, data) => api.put(`/announcements/${id}`, data);

export const deleteAnnouncement = (id) => api.delete(`/announcements/${id}`);