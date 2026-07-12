<template>
  <section class="space-y-6">
    <div
      class="flex flex-col gap-4 rounded-3xl border border-white/20 bg-white/70 p-6 shadow-lg shadow-slate-200/20 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-3xl font-bold tracking-tight text-slate-900">
          Notifications
        </h1>
        <p class="mt-1 text-sm text-slate-500">
          {{ notificationStore.unreadCount }} unread
        </p>
      </div>

      <button
        v-if="notificationStore.unreadCount > 0"
        class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        @click="markAll"
      >
        Mark all as read
      </button>
    </div>

    <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        :class="notification.isRead ? 'bg-white' : 'bg-indigo-50/40'"
        class="flex items-start gap-3 border-b border-slate-100 px-5 py-4 last:border-0 transition"
      >
        <div
          :class="notification.isRead ? 'bg-transparent' : 'bg-indigo-500'"
          class="mt-1.5 h-2 w-2 shrink-0 rounded-full"
        />

        <div class="flex-1">
          <p class="text-sm font-semibold text-slate-900">
            {{ notification.title }}
          </p>
          <p class="mt-0.5 text-sm text-slate-600">
            {{ notification.message }}
          </p>
          <p class="mt-1 text-xs text-slate-400">
            {{ formatDate(notification.createdAt) }}
          </p>
        </div>

        <button
          v-if="!notification.isRead"
          class="shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-700"
          @click="notificationStore.markAsRead(notification.id)"
        >
          Mark read
        </button>
      </div>

      <p
        v-if="
          !notificationStore.loading &&
          notificationStore.notifications.length === 0
        "
        class="px-5 py-16 text-center text-slate-400"
      >
        No notifications yet.
      </p>
    </div>
  </section>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const notificationStore = useNotificationStore();
const toast = useToast();

onMounted(async () => {
  await notificationStore.fetchAll();
});

async function markAll() {
  try {
    await notificationStore.markAllAsRead();
    toast.success("All notifications marked as read");
  } catch (err: any) {
    toast.error(
      err?.response?.data?.message || "Failed to update notifications",
    );
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
</script>
