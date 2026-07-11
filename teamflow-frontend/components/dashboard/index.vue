<template>
  <section class="space-y-8">
    <div>
      <h1 class="text-3xl font-bold">
        {{ workspace?.name }}
      </h1>

      <p class="text-slate-500">
        {{ workspace?.description }}
      </p>
    </div>

    <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard :value="0" title="Projects" />

      <StatCard :value="0" title="Tasks" />

      <StatCard :value="0" title="Members" />

      <StatCard :value="0" title="Completed" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import StatCard from "~/components/dashboard/StatCard.vue";

definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const workspaceStore = useWorkspaceStore();

const workspace = computed(() => workspaceStore.selectedWorkspace);

onMounted(() => {
  workspaceStore.initializeWorkspace();
});
</script>
