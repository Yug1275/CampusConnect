import api from "./api";

export const generateQrSession = (subject, date) =>
  api.post("/attendance/qr/generate", { subject, date });

export const getActiveQrSession = (subject, date) =>
  api.get("/attendance/qr/active", { params: { subject, date } });

export const scanQrAttendance = (token) => api.post("/attendance/qr/scan", { token });