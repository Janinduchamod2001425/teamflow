<template>
  <div
    :class="hoverBorderClass"
    :style="{
      animationDelay: `${(index ?? 0) * 0.08}s`,
      background: cardGradient,
    }"
    class="card-enter group relative overflow-hidden rounded-3xl border border-white/40 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-100/50"
  >
    <div class="space-y-3 p-6">
      <div class="flex items-center gap-3">
        <div
          :style="{ backgroundColor: project.color || '#6366f1' }"
          class="flex h-10 w-10 shrink-0 items-center justify-center rounded-3xl text-xl pt-0.5 font-bold text-white shadow-sm"
        >
          {{ project.name.charAt(0).toUpperCase() }}
        </div>
        <h2 class="text-lg font-semibold text-slate-900 line-clamp-1">
          {{ project.name }}
        </h2>
      </div>

      <p class="text-sm leading-relaxed text-slate-600 line-clamp-2">
        {{ project.description || "No description provided." }}
      </p>

      <div class="flex justify-end gap-2 pt-3">
        <button
          class="rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          @click="$emit('open', project)"
        >
          Open
        </button>
        <button
          v-if="canManage"
          class="rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          @click="$emit('edit', project)"
        >
          Edit
        </button>
        <button
          v-if="canManage"
          class="rounded-lg bg-red-50/80 px-3 py-2 text-xs font-medium text-red-600 backdrop-blur-sm transition hover:bg-red-100 hover:text-red-700"
          @click="$emit('delete', project)"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { Project } from "~/types/project";

const props = defineProps<{
  project: Project;
  index?: number;
  canManage?: boolean;
}>();

defineEmits<{
  open: [project: Project];
  edit: [project: Project];
  delete: [project: Project];
}>();

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean,
    16,
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const cardGradient = computed(() => {
  const color = props.project.color || "#6366f1";
  const tint = hexToRgba(color, 0.16);
  const tintSoft = hexToRgba(color, 0.04);
  return `linear-gradient(135deg, ${tint} 0%, ${tintSoft} 45%, rgba(255,255,255,0.75) 100%)`;
});

const hoverBorderClass = computed(() => "hover:border-white/70");
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
