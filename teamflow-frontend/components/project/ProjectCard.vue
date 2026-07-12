<template>
  <div
    :style="{ animationDelay: `${index * 0.08}s` }"
    class="card-enter group relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white/80 hover:shadow-2xl hover:shadow-indigo-100/50"
  >
    <div
      :style="{ backgroundColor: project.color || '#6366f1' }"
      class="absolute left-0 top-0 h-1.5 w-full"
    />

    <div class="space-y-3 p-6">
      <div class="flex items-center gap-3">
        <div
          :style="{ backgroundColor: project.color || '#6366f1' }"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
        >
          {{ project.name.charAt(0).toUpperCase() }}
        </div>
        <h2 class="text-lg font-semibold text-slate-900 line-clamp-1">
          {{ project.name }}
        </h2>
      </div>

      <p class="text-sm leading-relaxed text-slate-500 line-clamp-2">
        {{ project.description || "No description provided." }}
      </p>

      <div class="flex justify-end gap-2 pt-3">
        <button
          class="rounded-lg border border-slate-200 bg-white/50 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          @click="$emit('open', project)"
        >
          Open
        </button>
        <button
          v-if="canManage"
          class="rounded-lg border border-slate-200 bg-white/50 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          @click="$emit('edit', project)"
        >
          Edit
        </button>
        <button
          v-if="canManage"
          class="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 backdrop-blur-sm transition hover:bg-red-100 hover:text-red-700"
          @click="$emit('delete', project)"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Project } from "~/types/project";

defineProps<{
  project: Project;
  index?: number;
  canManage?: boolean;
}>();

defineEmits<{
  open: [project: Project];
  edit: [project: Project];
  delete: [project: Project];
}>();
</script>

<style scoped>
@keyframes cardEnter {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
.card-enter {
  animation: cardEnter 0.4s ease-out both;
}
</style>
