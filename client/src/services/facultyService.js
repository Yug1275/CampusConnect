import api from "./api";

export const getFaculty = (params) => api.get("/faculty", { params });

export const getFacultyById = (id) => api.get(`/faculty/${id}`);

export const createFaculty = (data) => api.post("/faculty", data);

export const updateFaculty = (id, data) => api.put(`/faculty/${id}`, data);

export const deleteFaculty = (id) => api.delete(`/faculty/${id}`);