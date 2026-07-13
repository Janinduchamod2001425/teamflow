<template>
  <div
    class="card-enter group cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-200 hover:shadow-md"
    @click="$emit('open', task)"
  >
    <div class="flex items-start justify-between gap-2">
      <span
        :class="priorityStyles[task.priority]"
        class="rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide"
      >
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
        @click.stop="prevStatus && $emit('move', task, prevStatus)"
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

      <div class="flex items-center gap-3">
        <span class="text-[11px] font-medium text-slate-400">{{
          statusLabel
        }}</span>

        <span
          v-if="task._count?.comments"
          class="flex items-center gap-1 text-[11px] font-medium text-slate-400"
        >
          <svg
            class="h-3.5 w-3.5"
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
        class="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-30"
        @click.stop="nextStatus && $emit('move', task, nextStatus)"
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
