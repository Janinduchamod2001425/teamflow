<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-slate-700">My Tasks</h3>
      <NuxtLink
        class="text-xs font-medium text-indigo-600 hover:text-indigo-700"
        to="/tasks"
      >
        View all →
      </NuxtLink>
    </div>

    <div v-if="loading" class="mt-4 text-sm text-slate-400">Loading...</div>

    <ul v-else-if="tasks.length > 0" class="mt-4 space-y-3">
      <li
        v-for="task in tasks"
        :key="task.id"
        class="flex cursor-pointer items-center gap-3 rounded-xl p-2 transition hover:bg-slate-50"
        @click="openTask(task)"
      >
        <span
          :style="{ backgroundColor: task.project?.color || '#6366f1' }"
          class="h-2 w-2 shrink-0 rounded-full"
        />

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-slate-800">
            {{ task.title }}
          </p>
          <p class="truncate text-xs text-slate-400">
            {{ task.project?.name || "—" }}
          </p>
        </div>

        <span
          :class="priorityStyles[task.priority]"
          class="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium"
        >
          {{ task.priority }}
        </span>

        <span
          v-if="task.dueDate"
          :class="dueClass(task.dueDate)"
          class="w-16 shrink-0 text-right text-xs"
        >
          {{ formatDate(task.dueDate) }}
        </span>
      </li>
    </ul>

    <p v-else class="mt-4 text-sm text-slate-400">
      Nothing assigned to you right now. 🎉
    </p>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { TaskService } from "~/services/task.service";
import type { Task } from "~/types/task";

const props = defineProps<{
  workspaceId: string;
  userId?: string;
}>();

const router = useRouter();
const tasks = ref<Task[]>([]);
const loading = ref(false);

async function fetchMyTasks() {
  if (!props.userId) return;

  loading.value = true;
  try {
    const response = await TaskService.search(props.workspaceId, {
      assigneeId: props.userId,
      sortBy: "dueDate",
      order: "asc",
      limit: 20,
    });

    const items: Task[] = response.data.data.items;
    tasks.value = items.filter((t) => t.status !== "DONE").slice(0, 5);
  } finally {
    loading.value = false;
  }
}

onMounted(fetchMyTasks);
watch(() => props.workspaceId, fetchMyTasks);

function openTask(task: Task) {
  router.push({
    path: "/tasks",
    query: { projectId: task.projectId, taskId: task.id },
  });
}

function dueClass(dueDate: string) {
  const isOverdue = new Date(dueDate).getTime() < Date.now();
  return isOverdue ? "text-red-500 font-medium" : "text-slate-400";
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

const priorityStyles: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-100 text-blue-700",
  HIGH: "bg-amber-100 text-amber-700",
  URGENT: "bg-red-100 text-red-700",
};
</script>
