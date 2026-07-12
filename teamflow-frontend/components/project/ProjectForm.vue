<template>
  <form class="space-y-5" @submit.prevent="submit">
    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        Project Name
      </label>
      <input
        v-model="form.name"
        class="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        placeholder="Backend API"
        type="text"
      />
    </div>

    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        Description
      </label>
      <textarea
        v-model="form.description"
        class="w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 backdrop-blur-sm transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
        rows="4"
      />
    </div>

    <div>
      <label class="mb-2 block text-sm font-medium text-slate-700">
        Color
      </label>
      <div class="flex items-center gap-3">
        <input
          v-model="form.color"
          class="h-11 w-14 cursor-pointer rounded-4xl border border-slate-200 bg-white/50"
          type="color"
        />
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in colorPresets"
            :key="preset"
            :class="
              form.color === preset ? 'border-slate-900' : 'border-transparent'
            "
            :style="{ backgroundColor: preset }"
            class="h-7 w-7 rounded-full border-2 transition"
            type="button"
            @click="form.color = preset"
          />
        </div>
      </div>
    </div>

    <button
      class="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all hover:shadow-xl hover:shadow-indigo-300"
    >
      {{ project ? "Update Project" : "Create Project" }}
    </button>
  </form>
</template>

<script lang="ts" setup>
import { reactive, watch } from "vue";
import type { Project, CreateProjectDto } from "~/types/project";

const props = defineProps<{
  project?: Project | null;
}>();

const emit = defineEmits<{
  (e: "submit", data: CreateProjectDto): void;
}>();

const colorPresets = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
];

const form = reactive<CreateProjectDto>({
  name: "",
  description: "",
  color: colorPresets[0],
});

watch(
  () => props.project,
  (project) => {
    if (project) {
      form.name = project.name;
      form.description = project.description ?? "";
      form.color = project.color ?? colorPresets[0];
    } else {
      form.name = "";
      form.description = "";
      form.color = colorPresets[0];
    }
  },
  { immediate: true },
);

function submit() {
  emit("submit", {
    name: form.name,
    description: form.description,
    color: form.color,
  });
}
</script>
