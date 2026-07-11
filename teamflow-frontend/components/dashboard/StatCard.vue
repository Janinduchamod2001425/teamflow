<template>
  <div
    class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
  >
    <div class="text-sm text-slate-500">
      {{ title }}
    </div>

    <div class="mt-3 text-4xl font-bold">
      {{ value }}
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  title: string;
  value: number;
}>();
</script>
