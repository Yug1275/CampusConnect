import api from "./api";

export const getDepartments = () => api.get("/departments");

export const getDepartmentById = (id) => api.get(`/departments/${id}`);

export const getDepartmentStats = (id) => api.get(`/departments/${id}/stats`);

export const createDepartment = (data) => api.post("/departments", data);

export const updateDepartment = (id, data) => api.put(`/departments/${id}`, data);

export const deleteDepartment = (id) => api.delete(`/departments/${id}`);