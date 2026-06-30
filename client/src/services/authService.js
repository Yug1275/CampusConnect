import api from "./api";

export const registerUser = (data) => api.post("/auth/register", data);

export const loginUser = (data) => api.post("/auth/login", data);

export const googleLoginUser = (idToken) =>
  api.post("/auth/google", { idToken });

export const forgotPasswordRequest = (email) =>
  api.post("/auth/forgot-password", { email });

export const resetPasswordRequest = (data) =>
  api.post("/auth/reset-password", data);