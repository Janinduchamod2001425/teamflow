<template>
  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 class="text-sm font-semibold text-slate-700">Tasks by Status</h3>

    <div class="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
      <div
        v-for="seg in segments"
        :key="seg.key"
        :style="{ width: seg.percent + '%', backgroundColor: seg.color }"
        class="h-full transition-all"
      />
    </div>

    <div class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div
        v-for="seg in segments"
        :key="seg.key"
        class="flex items-center gap-2"
      >
        <span
          :style="{ backgroundColor: seg.color }"
          class="h-2.5 w-2.5 rounded-full"
        />
        <span class="text-xs text-slate-500">{{ seg.label }}</span>
        <span class="ml-auto text-xs font-semibold text-slate-700">{{
          seg.count
        }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import type { TasksByStatus } from "~/types/dashboard";

const props = defineProps<{
  data: TasksByStatus;
}>();

const config = [
  { key: "TODO", label: "To Do", color: "#94a3b8" },
  { key: "IN_PROGRESS", label: "In Progress", color: "#3b82f6" },
  { key: "REVIEW", label: "Review", color: "#a855f7" },
  { key: "DONE", label: "Done", color: "#10b981" },
] as const;

const total = computed(() => {
  const t =
    props.data.TODO +
    props.data.IN_PROGRESS +
    props.data.REVIEW +
    props.data.DONE;
  return t || 1;
});

const segments = computed(() =>
  config.map((c) => {
    const count = props.data[c.key as keyof TasksByStatus];
    return { ...c, count, percent: (count / total.value) * 100 };
  }),
);
</script>
