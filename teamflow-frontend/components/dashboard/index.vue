<template>
  <div class="space-y-8">
    <section>
      <h1 class="text-3xl font-bold text-slate-900">Welcome back 👋</h1>

      <p class="mt-2 text-slate-500">
        Here's what's happening across your team today.
      </p>
    </section>

    <DashboardStats />
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>
