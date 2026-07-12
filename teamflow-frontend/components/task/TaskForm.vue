<template>
  <form class="space-y-5" @submit.prevent="submit">
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">Title</label>
      <input
        v-model="form.title"
        class="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        placeholder="Implement login API"
        type="text"
      />
    </div>

    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700"
        >Description</label
      >
      <textarea
        v-model="form.description"
        class="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        rows="3"
      />
    </div>

    <div class="grid grid-cols-2 gap-4">
      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700"
          >Priority</label
        >
        <select
          v-model="form.priority"
          class="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
          <option value="URGENT">Urgent</option>
        </select>
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium text-slate-700"
          >Due Date</label
        >
        <input
          v-model="form.dueDate"
          class="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          type="date"
        />
      </div>
    </div>

    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700"
        >Assignee</label
      >
      <select
        v-model="form.assigneeId"
        class="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
      >
        <option value="">Unassigned</option>
        <option
          v-for="member in members"
          :key="member.user.id"
          :value="member.user.id"
        >
          {{ member.user.name }}
        </option>
      </select>
    </div>

    <button
      class="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300"
    >
      {{ task ? "Update Task" : "Create Task" }}
    </button>
  </form>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";
import type { Task, CreateTaskDto } from "~/types/task";

const props = defineProps<{
  task?: Task | null;
  members: Array<{ user: { id: string; name: string } }>;
}>();

const emit = defineEmits<{
  (e: "submit", data: Omit<CreateTaskDto, "projectId">): void;
}>();

const form = reactive({
  title: "",
  description: "",
  priority: "MEDIUM" as CreateTaskDto["priority"],
  dueDate: "",
  assigneeId: "",
});

watch(
  () => props.task,
  (task) => {
    if (task) {
      form.title = task.title;
      form.description = task.description ?? "";
      form.priority = task.priority;
      form.dueDate = task.dueDate ? task.dueDate.slice(0, 10) : "";
      form.assigneeId = task.assigneeId ?? "";
    } else {
      form.title = "";
      form.description = "";
      form.priority = "MEDIUM";
      form.dueDate = "";
      form.assigneeId = "";
    }
  },
  { immediate: true },
);

function submit() {
  emit("submit", {
    title: form.title,
    description: form.description || undefined,
    priority: form.priority,
    dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
    assigneeId: form.assigneeId || undefined,
  });
}
</script>
