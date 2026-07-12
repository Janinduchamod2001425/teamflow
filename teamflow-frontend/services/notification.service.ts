import { api } from "./api";

export const NotificationService = {
  findAll() {
    return api.get("/notifications");
  },

  unreadCount() {
    return api.get("/notifications/unread-count");
  },

  markAsRead(notificationId: string) {
    return api.patch(`/notifications/${notificationId}/read`);
  },

  markAllAsRead() {
    return api.patch("/notifications/read-all");
  },
};
