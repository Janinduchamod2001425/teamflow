<template>
  <aside
    class="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white px-4 py-6"
  >
    <Logo />

    <nav class="mt-8 space-y-2">
      <NuxtLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600"
      >
        {{ item.label }}
      </NuxtLink>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Workspaces", to: "/workspaces" },
  { label: "Projects", to: "/projects" },
  { label: "Tasks", to: "/tasks" },
  { label: "Notifications", to: "/notifications" },
];
</script>
