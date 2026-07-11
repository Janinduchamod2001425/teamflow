<template>
  <nav class="flex items-center gap-2 text-sm">
    <template v-for="(item, i) in items" :key="i">
      <NuxtLink
        v-if="item.to && i < items.length - 1"
        :to="item.to"
        class="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600"
      >
        <span
          v-if="item.color"
          :style="{ backgroundColor: item.color }"
          class="h-2 w-2 rounded-full"
        />
        {{ item.label }}
      </NuxtLink>

      <span
        v-else
        class="flex items-center gap-1.5 font-semibold text-slate-900"
      >
        <span
          v-if="item.color"
          :style="{ backgroundColor: item.color }"
          class="h-2 w-2 rounded-full"
        />
        {{ item.label }}
      </span>

      <svg
        v-if="i < items.length - 1"
        class="h-3.5 w-3.5 text-slate-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M9 5l7 7-7 7"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
    </template>
  </nav>
</template>

<script lang="ts" setup>
export interface BreadcrumbItem {
  label: string;
  to?: string;
  color?: string | null;
}

defineProps<{
  items: BreadcrumbItem[];
}>();
</script>
