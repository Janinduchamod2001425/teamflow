<template>
  <div
    class="card-enter group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
  >
    <div class="flex items-start justify-between gap-2">
      <span
        :class="priorityStyles[task.priority]"
        class="rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      >
        {{ task.priority }}
      </span>

      <div class="flex opacity-0 transition group-hover:opacity-100">
        <button
          class="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          @click="$emit('edit', task)"
        >
          <svg
            class="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </svg>
        </button>
        <button
          v-if="canDelete"
          class="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
          @click="$emit('delete', task)"
        >
          <svg
            class="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M6 18L18 6M6 6l12 12"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </svg>
        </button>
      </div>
    </div>

    <h3 class="mt-2 text-sm font-semibold text-slate-900 line-clamp-2">
      {{ task.title }}
    </h3>
    <p v-if="task.description" class="mt-1 text-xs text-slate-500 line-clamp-2">
      {{ task.description }}
    </p>

    <div class="mt-3 flex items-center justify-between">
      <div class="flex items-center gap-1.5">
        <div
          v-if="task.assignee"
          :title="task.assignee.name"
          class="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-semibold text-indigo-700"
        >
          {{ task.assignee.name.charAt(0).toUpperCase() }}
        </div>
        <span v-else class="text-xs text-slate-400">Unassigned</span>
      </div>

      <span v-if="task.dueDate" class="text-xs text-slate-400">
        {{ formatDate(task.dueDate) }}
      </span>
    </div>

    <div
      class="mt-3 flex items-center justify-between border-t border-slate-100 pt-2"
    >
      <button
        :disabled="!prevStatus"
        class="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
        @click="prevStatus && $emit('move', task, prevStatus)"
      >
        <svg
          class="h-4 w-4"
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

      <span class="text-[11px] font-medium text-slate-400">{{
        statusLabel
      }}</span>

      <button
        :disabled="!nextStatus"
        class="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
        @click="nextStatus && $emit('move', task, nextStatus)"
      >
        <svg
          class="h-4 w-4"
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
  edit: [task: Task];
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

const priorityStyles: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-700",
  URGENT: "bg-red-100 text-red-700",
};

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
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.card-enter {
  animation: cardEnter 0.25s ease-out both;
}
</style>
