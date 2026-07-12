<template>
  <div
    :style="{ animationDelay: `${index * 0.08}s` }"
    class="card-enter group relative flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-slate-200/50"
  >
    <!-- Subtle left accent line on hover -->
    <div
      class="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-indigo-400 to-purple-400 opacity-0 transition-opacity group-hover:opacity-100"
    />

    <div class="flex items-start gap-4">
      <!-- Workspace initial avatar -->
      <div
        class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-2xl font-bold text-indigo-600 ring-2 ring-indigo-100"
      >
        {{ workspace.name.charAt(0).toUpperCase() }}
      </div>

      <div class="min-w-0 flex-1">
        <h2
          class="text-lg font-semibold leading-tight text-slate-900 line-clamp-1"
        >
          {{ workspace.name }}
        </h2>
        <p class="mt-1 text-sm leading-relaxed text-slate-500 line-clamp-2">
          {{ workspace.description || "No description provided." }}
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="mt-auto flex justify-end gap-2 pt-5">
      <button
        class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        @click="$emit('open', workspace)"
      >
        Open
      </button>
      <button
        class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
        @click="$emit('edit', workspace)"
      >
        Edit
      </button>
      <button
        class="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-100 hover:text-red-700"
        @click="$emit('delete', workspace)"
      >
        Delete
      </button>
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
