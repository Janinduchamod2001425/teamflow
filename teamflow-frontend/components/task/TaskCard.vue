<template>
  <div
    :style="{ background: statusGradient }"
    class="card-enter group relative cursor-pointer overflow-hidden rounded-lg border p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-200/60"
    @click="$emit('open', task)"
  >
    <!-- Priority accent stripe -->
    <div
      :class="priorityAccent[task.priority]"
      class="absolute left-0 top-0 h-full w-1"
    />

    <div class="flex items-start justify-between gap-2 pl-1.5">
      <span
        :class="priorityStyles[task.priority]"
        class="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      >
        <span
          :class="priorityDot[task.priority]"
          class="h-1.5 w-1.5 rounded-full"
        />
        {{ task.priority }}
      </span>

      <button
        v-if="canDelete"
        class="rounded p-1 text-slate-400 opacity-0 transition hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
        @click.stop="$emit('delete', task)"
      >
        <svg
          class="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M4 7h16M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          />
        </svg>
      </button>
    </div>

    <h3
      class="mt-2 pl-1.5 text-sm font-semibold text-slate-900 line-clamp-2 transition-colors group-hover:text-indigo-700"
    >
      {{ task.title }}
    </h3>
    <p
      v-if="task.description"
      class="mt-1 pl-1.5 text-xs text-slate-500 line-clamp-2"
    >
      {{ task.description }}
    </p>

    <div class="mt-3 flex items-center justify-between pl-1.5">
      <div class="flex items-center gap-1.5">
        <div
          v-if="task.assignee"
          :title="task.assignee.name"
          class="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700 ring-2 ring-white"
        >
          {{ task.assignee.name.charAt(0).toUpperCase() }}
        </div>
        <span v-else class="text-xs text-slate-400">Unassigned</span>
      </div>

      <span
        v-if="task.dueDate"
        :class="
          isOverdue(task.dueDate)
            ? 'font-medium text-red-500'
            : 'text-slate-400'
        "
        class="flex items-center gap-1 text-xs"
      >
        <svg
          class="h-3 w-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
          />
        </svg>
        {{ formatDate(task.dueDate) }}
      </span>
    </div>

    <div
      class="mt-3 flex items-center justify-between border-t border-slate-100 pl-1.5 pt-2.5"
    >
      <button
        :disabled="!prevStatus"
        class="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25 disabled:hover:bg-transparent"
        @click.stop="prevStatus && $emit('move', task, prevStatus)"
      >
        <svg
          class="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M15 19l-7-7 7-7"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
          />
        </svg>
      </button>

      <div class="flex items-center gap-3">
        <span class="text-[11px] font-medium text-slate-400">{{
          statusLabel
        }}</span>

        <span
          v-if="task._count?.comments"
          class="flex items-center gap-1 rounded-full bg-slate-50 px-1.5 py-0.5 text-[11px] font-medium text-slate-500"
        >
          <svg
            class="h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </svg>
          {{ task._count.comments }}
        </span>
      </div>

      <button
        :disabled="!nextStatus"
        class="flex h-6 w-6 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-25 disabled:hover:bg-transparent"
        @click.stop="nextStatus && $emit('move', task, nextStatus)"
      >
        <svg
          class="h-3.5 w-3.5"
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
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { Task, TaskStatus } from "~/types/task";

const props = defineProps<{
  task: Task;
  canDelete?: boolean;
}>();

defineEmits<{
  open: [task: Task];
  delete: [task: Task];
  move: [task: Task, status: TaskStatus];
}>();

const order: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];

const prevStatus = computed<TaskStatus | null>(() => {
  const i = order.indexOf(props.task.status);
  return i > 0 ? order[i - 1] : null;
});

const nextStatus = computed<TaskStatus | null>(() => {
  const i = order.indexOf(props.task.status);
  return i < order.length - 1 ? order[i + 1] : null;
});

const statusLabel = computed(() => props.task.status.replace("_", " "));

function isOverdue(dueDate: string) {
  return (
    new Date(dueDate).getTime() < Date.now() && props.task.status !== "DONE"
  );
}

// Priority styles (unchanged)
const priorityStyles: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-700",
  URGENT: "bg-red-100 text-red-700",
};

const priorityDot: Record<string, string> = {
  LOW: "bg-slate-400",
  MEDIUM: "bg-blue-500",
  HIGH: "bg-amber-500",
  URGENT: "bg-red-500",
};

const priorityAccent: Record<string, string> = {
  LOW: "bg-slate-300",
  MEDIUM: "bg-blue-400",
  HIGH: "bg-amber-400",
  URGENT: "bg-red-500",
};

// Gradient definitions based on status
const statusGradient = computed(() => {
  const gradients: Record<TaskStatus, string> = {
    TODO: "linear-gradient(145deg, #f8fafc 0%, #e2e8f0 100%)",
    IN_PROGRESS: "linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)",
    REVIEW: "linear-gradient(145deg, #f5f3ff 0%, #ede9fe 100%)",
    DONE: "linear-gradient(145deg, #ecfdf5 0%, #d1fae5 100%)",
  };
  return gradients[props.task.status] || gradients.TODO;
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
</script>

<style scoped>
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.card-enter {
  animation: cardEnter 0.3s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Smooth background transition when status changes */
.group {
  transition:
    background 0.4s ease,
    transform 0.2s ease,
    box-shadow 0.2s ease;
}
</style>
