<template>
  <div
    :style="{ animationDelay: `${index * 0.08}s` }"
    class="card-enter group relative overflow-hidden rounded-2xl border border-white/20 bg-white/60 shadow-sm backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:bg-white/80 hover:shadow-2xl hover:shadow-indigo-100/50"
  >
    <!-- Decorative top gradient bar -->
    <div
      class="absolute left-0 top-0 h-1.5 w-full bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 transition-opacity group-hover:opacity-100"
    />

    <div class="space-y-3 p-6">
      <!-- Workspace initial + name -->
      <div class="flex items-center gap-3">
        <div
          class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-sm font-bold text-indigo-600"
        >
          {{ workspace.name.charAt(0).toUpperCase() }}
        </div>
        <h2 class="text-lg font-semibold text-slate-900 line-clamp-1">
          {{ workspace.name }}
        </h2>
      </div>

      <p class="text-sm leading-relaxed text-slate-500 line-clamp-2">
        {{ workspace.description || "No description provided." }}
      </p>

      <!-- Action buttons -->
      <div class="flex justify-end gap-2 pt-3">
        <button
          class="rounded-lg border border-slate-200 bg-white/50 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          @click="$emit('open', workspace)"
        >
          Open
        </button>
        <button
          class="rounded-lg border border-slate-200 bg-white/50 px-3 py-2 text-xs font-medium text-slate-700 backdrop-blur-sm transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
          @click="$emit('edit', workspace)"
        >
          Edit
        </button>
        <button
          class="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 backdrop-blur-sm transition hover:bg-red-100 hover:text-red-700"
          @click="$emit('delete', workspace)"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  workspace: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
});

defineEmits(["open", "edit", "delete"]);
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
