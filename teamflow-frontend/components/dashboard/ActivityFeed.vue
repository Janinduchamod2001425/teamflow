<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 class="text-sm font-semibold text-slate-700">Recent Activity</h3>

    <div v-if="activities.length === 0" class="mt-4 text-sm text-slate-400">
      No recent activity yet.
    </div>

    <ul v-else class="mt-4 max-h-[270px] space-y-4 overflow-y-auto pr-1">
      <li v-for="activity in activities" :key="activity.id" class="flex gap-3">
        <div
          :class="iconStyle(activity.action)"
          class="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
        >
          {{ activity.user.name.charAt(0).toUpperCase() }}
        </div>

        <div class="flex-1">
          <p class="text-sm text-slate-700">
            <span class="font-medium text-slate-900">{{
              activity.user.name
            }}</span>
            {{ describe(activity) }}
          </p>
          <p class="text-xs text-slate-400">
            {{ formatRelative(activity.createdAt) }}
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type { Activity } from "~/types/dashboard";

defineProps<{
  activities: Activity[];
}>();

const styles: Record<string, string> = {
  PROJECT_CREATED: "bg-indigo-100 text-indigo-700",
  PROJECT_UPDATED: "bg-indigo-100 text-indigo-700",
  PROJECT_DELETED: "bg-red-100 text-red-700",
  TASK_CREATED: "bg-blue-100 text-blue-700",
  TASK_UPDATED: "bg-blue-100 text-blue-700",
  TASK_STATUS_UPDATED: "bg-purple-100 text-purple-700",
  TASK_DELETED: "bg-red-100 text-red-700",
  COMMENT_CREATED: "bg-emerald-100 text-emerald-700",
  COMMENT_UPDATED: "bg-emerald-100 text-emerald-700",
  COMMENT_DELETED: "bg-red-100 text-red-700",
  MEMBER_INVITED: "bg-amber-100 text-amber-700",
  MEMBER_ROLE_UPDATED: "bg-amber-100 text-amber-700",
  MEMBER_REMOVED: "bg-red-100 text-red-700",
  WORKSPACE_CREATED: "bg-slate-100 text-slate-700",
};

function iconStyle(action: string) {
  return styles[action] || "bg-slate-100 text-slate-600";
}

function describe(activity: Activity) {
  return activity.description.replace(/^\S+/, (word) => word.toLowerCase());
}

function formatRelative(dateStr: string) {
  const date = new Date(dateStr);
  const diffMin = Math.floor((Date.now() - date.getTime()) / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}
</script>
