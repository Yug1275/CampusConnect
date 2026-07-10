import api from "./api";

export const getClubs = (params) => api.get("/clubs", { params });

export const getClubById = (id) => api.get(`/clubs/${id}`);

export const createClub = (data) => api.post("/clubs", data);

export const updateClub = (id, data) => api.put(`/clubs/${id}`, data);

export const deleteClub = (id) => api.delete(`/clubs/${id}`);

export const joinClub = (clubId) => api.post(`/clubs/${clubId}/join`);

export const leaveClub = (clubId) => api.delete(`/clubs/${clubId}/join`);

export const getMyClubs = () => api.get("/clubs/my/memberships");

export const getClubMembers = (clubId) => api.get(`/clubs/${clubId}/members`);