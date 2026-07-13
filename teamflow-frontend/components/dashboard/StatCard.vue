<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-slate-500">{{ title }}</p>
        <h2 class="mt-2 text-3xl font-bold text-slate-900">{{ value }}</h2>
        <p v-if="subtext" class="mt-1 text-xs text-slate-400">{{ subtext }}</p>
      </div>

      <div
        :class="accentClass"
        class="flex h-12 w-12 items-center justify-center rounded-xl"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    title: string;
    value: number | string;
    subtext?: string;
    accent?: "indigo" | "emerald" | "amber" | "red";
  }>(),
  { accent: "indigo" },
);

const accentMap: Record<string, string> = {
  indigo: "bg-indigo-50 text-indigo-600",
  emerald: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
};

const accentClass = computed(() => accentMap[props.accent]);
</script>
