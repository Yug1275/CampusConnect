import api from "./api";

export const getEvents = (params) => api.get("/events", { params });

export const getEventById = (id) => api.get(`/events/${id}`);

export const createEvent = (data) => api.post("/events", data);

export const updateEvent = (id, data) => api.put(`/events/${id}`, data);

export const deleteEvent = (id) => api.delete(`/events/${id}`);

// Added in Task 4 - student registration actions
export const registerForEvent = (eventId) => api.post(`/events/${eventId}/register`);

export const cancelEventRegistration = (eventId) => api.delete(`/events/${eventId}/register`);

export const getMyRegistrations = () => api.get("/events/my/registrations");

export const getEventRegistrations = (eventId) => api.get(`/events/${eventId}/registrations`);