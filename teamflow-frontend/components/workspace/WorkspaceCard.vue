<template>
  <div
    :style="{
      animationDelay: `${(index ?? 0) * 0.08}s`,
      background: cardGradient,
    }"
    class="card-enter group relative flex flex-col overflow-hidden rounded-2xl border border-white/40 p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-100/50"
  >
    <div class="flex items-start gap-4">
      <div
        :style="{ backgroundColor: accentColor }"
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white shadow-sm"
      >
        {{ workspace.name.charAt(0).toUpperCase() }}
      </div>

      <div class="min-w-0 flex-1">
        <h2
          class="text-lg font-semibold leading-tight text-slate-900 line-clamp-1"
        >
          {{ workspace.name }}
        </h2>
        <p class="mt-1 text-sm leading-relaxed text-slate-600 line-clamp-2">
          {{ workspace.description || "No description provided." }}
        </p>
      </div>
    </div>

    <div class="mt-auto flex justify-end gap-2 pt-5">
      <button
        class="rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
        @click="$emit('open', workspace)"
      >
        Open
      </button>
      <button
        class="rounded-lg border border-white/60 bg-white/60 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
        @click="$emit('edit', workspace)"
      >
        Edit
      </button>
      <button
        class="rounded-lg bg-red-50/80 px-3 py-2 text-xs font-medium text-red-600 backdrop-blur-sm transition hover:bg-red-100 hover:text-red-700"
        @click="$emit('delete', workspace)"
      >
        Delete
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { Workspace } from "~/types/workspace";

const props = defineProps<{
  workspace: Workspace;
  index?: number;
}>();

defineEmits<{
  open: [workspace: Workspace];
  edit: [workspace: Workspace];
  delete: [workspace: Workspace];
}>();

// Deterministic color per workspace, since Workspace has no color field of its own.
// Hashing the id means the same workspace always renders the same color.
const palette = [
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
  "#ef4444",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
  "#3b82f6",
];

function hashToIndex(str: string, length: number) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % length;
}

const accentColor = computed(
  () => palette[hashToIndex(props.workspace.id, palette.length)],
);

function hexToRgba(hex: string, alpha: number) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const cardGradient = computed(() => {
  const tint = hexToRgba(accentColor.value, 0.16);
  const tintSoft = hexToRgba(accentColor.value, 0.04);
  return `linear-gradient(135deg, ${tint} 0%, ${tintSoft} 45%, rgba(255,255,255,0.75) 100%)`;
});
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
