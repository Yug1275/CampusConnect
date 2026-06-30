import api from "./api";

export const getMyProfile = () => api.get("/users/profile");

export const updateMyProfile = (data) => api.put("/users/profile", data);