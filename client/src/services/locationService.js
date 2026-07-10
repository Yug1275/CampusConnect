import api from "./api";

export const getLocations = (params) => api.get("/locations", { params });

export const getLocationById = (id) => api.get(`/locations/${id}`);

export const createLocation = (data) => api.post("/locations", data);

export const updateLocation = (id, data) => api.put(`/locations/${id}`, data);

export const deleteLocation = (id) => api.delete(`/locations/${id}`);