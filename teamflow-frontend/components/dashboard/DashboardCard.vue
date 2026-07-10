<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
  >
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-slate-500">
          {{ title }}
        </p>

        <h2 class="mt-2 text-3xl font-bold text-slate-900">
          {{ value }}
        </h2>
      </div>

      <div
        class="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600"
      >
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  value: number | string;
}>();
</script>
