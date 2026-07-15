<template>
  <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
    <div
      v-for="col in columns"
      :key="col.status"
      :class="col.wrapperClass"
      class="flex flex-col rounded-2xl border p-4 transition-colors"
    >
      <div class="mb-4 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span :class="col.dotClass" class="h-2.5 w-2.5 rounded-full" />
          <h3 class="text-sm font-semibold text-slate-700">{{ col.label }}</h3>
        </div>
        <span
          :class="col.badgeClass"
          class="flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-xs font-semibold"
        >
          {{ board[col.status].length }}
        </span>
      </div>

      <div class="flex flex-1 flex-col gap-3">
        <TaskCard
          v-for="task in board[col.status]"
          :key="task.id"
          :can-delete="canDelete"
          :task="task"
          @delete="$emit('delete', $event)"
          @move="(t, s) => $emit('move', t, s)"
          @open="$emit('open', $event)"
        />

        <div
          v-if="board[col.status].length === 0"
          class="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200/80 py-8"
        >
          <p class="text-xs text-slate-400">No tasks</p>
        </div>
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
  open: [task: Task];
  delete: [task: Task];
  move: [task: Task, status: TaskStatus];
}>();

const columns: {
  status: TaskStatus;
  label: string;
  wrapperClass: string;
  dotClass: string;
  badgeClass: string;
}[] = [
  {
    status: "TODO",
    label: "To Do",
    wrapperClass: "border-slate-200 bg-slate-50/60",
    dotClass: "bg-slate-400",
    badgeClass: "border border-slate-200 bg-white text-slate-500",
  },
  {
    status: "IN_PROGRESS",
    label: "In Progress",
    wrapperClass: "border-blue-100 bg-blue-50/40",
    dotClass: "bg-blue-500",
    badgeClass: "border border-blue-200 bg-white text-blue-600",
  },
  {
    status: "REVIEW",
    label: "Review",
    wrapperClass: "border-purple-100 bg-purple-50/40",
    dotClass: "bg-purple-500",
    badgeClass: "border border-purple-200 bg-white text-purple-600",
  },
  {
    status: "DONE",
    label: "Done",
    wrapperClass: "border-emerald-100 bg-emerald-50/40",
    dotClass: "bg-emerald-500",
    badgeClass: "border border-emerald-200 bg-white text-emerald-600",
  },
];
</script>
