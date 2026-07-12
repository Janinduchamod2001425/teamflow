import { defineStore } from "pinia";
import { ref } from "vue";
import { NotificationService } from "~/services/notification.service";
import type { Notification } from "~/types/notification";

export const useNotificationStore = defineStore("notification", () => {
  const notifications = ref<Notification[]>([]);
  const unreadCount = ref(0);
  const loading = ref(false);
  let listening = false;

  async function fetchAll() {
    loading.value = true;
    try {
      const response = await NotificationService.findAll();
      notifications.value = response.data.data;
    } finally {
      loading.value = false;
    }
  }

  async function fetchUnreadCount() {
    const response = await NotificationService.unreadCount();
    unreadCount.value = response.data.data.count;
  }

  async function markAsRead(notificationId: string) {
    await NotificationService.markAsRead(notificationId);

    const item = notifications.value.find((n) => n.id === notificationId);
    if (item && !item.isRead) {
      item.isRead = true;
      unreadCount.value = Math.max(0, unreadCount.value - 1);
    }
  }

  async function markAllAsRead() {
    await NotificationService.markAllAsRead();
    notifications.value.forEach((n) => (n.isRead = true));
    unreadCount.value = 0;
  }

  function listenForLiveUpdates() {
    if (!import.meta.client || listening) return;
    listening = true;

    const { $socket } = useNuxtApp();
    const socket = $socket as any;
    const toast = useToast();

    socket.on("notification.created", (notification: Notification) => {
      notifications.value.unshift(notification);
      unreadCount.value += 1;
      toast.info(notification.message);
    });
  }

  function reset() {
    notifications.value = [];
    unreadCount.value = 0;
    listening = false;
  }

  return {
    notifications,
    unreadCount,
    loading,
    fetchAll,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    listenForLiveUpdates,
    reset,
  };
});
