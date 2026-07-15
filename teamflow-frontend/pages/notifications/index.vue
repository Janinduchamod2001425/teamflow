<template>
  <section class="space-y-6">
    <!-- Header -->
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
        class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 transition"
        @click="markAll"
      >
        Mark all as read
      </button>
    </div>

    <!-- Notification list container with scroll -->
    <div
      class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
      <div class="max-h-[448px] overflow-y-auto divide-y divide-slate-100">
        <div
          v-for="notification in notificationStore.notifications"
          :key="notification.id"
          :class="[
            'group flex items-start gap-4 px-5 py-4 transition duration-200',
            notification.isRead
              ? 'bg-white'
              : 'bg-gradient-to-r from-indigo-50/70 to-white',
            isClickable(notification)
              ? 'cursor-pointer hover:bg-slate-50/80'
              : '',
          ]"
          @click="handleClick(notification)"
        >
          <!-- Unread indicator (dot) -->
          <div
            class="flex h-5 w-5 shrink-0 items-center justify-center self-center"
          >
            <div
              :class="[
                'h-2 w-2 rounded-full transition-all',
                notification.isRead
                  ? 'bg-slate-300'
                  : 'bg-indigo-500 ring-indigo-200',
              ]"
            />
          </div>

          <!-- Icon based on type -->
          <div
            :class="getIconBg(notification.type)"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          >
            <component
              :is="getIcon(notification.type)"
              :class="getIconColor(notification.type)"
              class="h-5 w-5"
            />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm font-semibold text-slate-900 truncate">
                {{ notification.title }}
              </p>
              <span class="text-xs text-slate-400 whitespace-nowrap">
                {{ formatDate(notification.createdAt) }}
              </span>
            </div>
            <p class="mt-0.5 text-sm text-slate-600 leading-relaxed">
              {{ notification.message }}
            </p>
          </div>

          <!-- Right action -->
          <div class="flex shrink-0 items-center">
            <button
              v-if="!notification.isRead && !isClickable(notification)"
              class="rounded-lg px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition"
              @click.stop="notificationStore.markAsRead(notification.id)"
            >
              Mark read
            </button>
            <svg
              v-else-if="isClickable(notification)"
              class="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 5l7 7-7 7"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
              />
            </svg>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="
            !notificationStore.loading &&
            notificationStore.notifications.length === 0
          "
          class="px-5 py-16 text-center"
        >
          <BellOff class="mx-auto h-12 w-12 text-slate-300" />
          <h3 class="mt-4 text-lg font-semibold text-slate-700">
            All caught up!
          </h3>
          <p class="mt-1 text-sm text-slate-500">
            No notifications at the moment.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import type { Notification } from "~/types/notification";
import {
  BellOff,
  Mail,
  CheckSquare,
  FileText,
  Users,
  MessageSquare,
  AlertCircle,
} from "lucide-vue-next";

function getIcon(type: string) {
  const map: Record<string, any> = {
    WORKSPACE_INVITE: Mail,
    TASK_ASSIGNED: CheckSquare,
    TASK_UPDATED: FileText,
    TASK_STATUS_UPDATED: AlertCircle,
    COMMENT_CREATED: MessageSquare,
  };
  return map[type] || BellOff;
}

function getIconBg(type: string) {
  const map: Record<string, string> = {
    WORKSPACE_INVITE: "bg-indigo-100",
    TASK_ASSIGNED: "bg-blue-100",
    TASK_UPDATED: "bg-amber-100",
    TASK_STATUS_UPDATED: "bg-purple-100",
    COMMENT_CREATED: "bg-emerald-100",
  };
  return map[type] || "bg-slate-100";
}

function getIconColor(type: string) {
  const map: Record<string, string> = {
    WORKSPACE_INVITE: "text-indigo-600",
    TASK_ASSIGNED: "text-blue-600",
    TASK_UPDATED: "text-amber-600",
    TASK_STATUS_UPDATED: "text-purple-600",
    COMMENT_CREATED: "text-emerald-600",
  };
  return map[type] || "text-slate-600";
}

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const notificationStore = useNotificationStore();
const toast = useToast();
const router = useRouter();

// Map notification.type -> destination route.
// Extend this map as new notification types get a dedicated page.
const routeMap: Record<string, string> = {
  WORKSPACE_INVITE: "/invitations",
  TASK_ASSIGNED: "/tasks",
  TASK_UPDATED: "/tasks",
  TASK_STATUS_UPDATED: "/tasks",
  COMMENT_CREATED: "/tasks",
};

function isClickable(notification: Notification) {
  return [
    "WORKSPACE_INVITE",
    "TASK_ASSIGNED",
    "TASK_UPDATED",
    "TASK_STATUS_UPDATED",
    "COMMENT_CREATED",
  ].includes(notification.type);
}

async function handleClick(notification: Notification) {
  if (!notification.isRead) {
    await notificationStore.markAsRead(notification.id);
  }

  const meta = notification.metadata;

  if (notification.type === "WORKSPACE_INVITE") {
    router.push("/invitations");
    return;
  }

  if (meta?.projectId && meta?.taskId) {
    router.push({
      path: "/tasks",
      query: { projectId: meta.projectId, taskId: meta.taskId },
    });
    return;
  }

  if (meta?.projectId) {
    router.push({ path: "/tasks", query: { projectId: meta.projectId } });
    return;
  }

  router.push("/tasks");
}

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
