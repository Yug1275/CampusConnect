import api from "./api";

export const reportItem = (data) => api.post("/lostfound", data);

export const getItems = (params) => api.get("/lostfound", { params });

export const getMyItems = () => api.get("/lostfound/my");

export const claimItem = (id) => api.post(`/lostfound/${id}/claim`);

export const verifyClaim = (id) => api.put(`/lostfound/${id}/verify`);

export const deleteItem = (id) => api.delete(`/lostfound/${id}`);