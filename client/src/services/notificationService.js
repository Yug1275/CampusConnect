import api from "./api";

export const getMyNotifications = () => api.get("/notifications");

export const getUnreadCount = () => api.get("/notifications/unread-count");

export const markNotificationAsRead = (id) => api.put(`/notifications/${id}/read`);

export const markAllNotificationsAsRead = () => api.put("/notifications/read-all");