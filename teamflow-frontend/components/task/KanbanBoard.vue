<template>
  <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
    <div
      v-for="col in columns"
      :key="col.status"
      class="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/60 p-4"
    >
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-sm font-semibold text-slate-700">{{ col.label }}</h3>
        <span
          class="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-500"
        >
          {{ board[col.status].length }}
        </span>
      </div>

      <div class="flex flex-col gap-3">
        <TaskCard
          v-for="task in board[col.status]"
          :key="task.id"
          :can-delete="canDelete"
          :task="task"
          @delete="$emit('delete', $event)"
          @edit="$emit('edit', $event)"
          @move="(t, s) => $emit('move', t, s)"
        />

        <p
          v-if="board[col.status].length === 0"
          class="py-6 text-center text-xs text-slate-400"
        >
          No tasks
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import TaskCard from "./TaskCard.vue";
import type { Task, TaskBoard, TaskStatus } from "~/types/task";

defineProps<{
  board: TaskBoard;
  canDelete?: boolean;
}>();

defineEmits<{
  edit: [task: Task];
  delete: [task: Task];
  move: [task: Task, status: TaskStatus];
}>();

const columns: { status: TaskStatus; label: string }[] = [
  { status: "TODO", label: "To Do" },
  { status: "IN_PROGRESS", label: "In Progress" },
  { status: "REVIEW", label: "Review" },
  { status: "DONE", label: "Done" },
];
</script>
