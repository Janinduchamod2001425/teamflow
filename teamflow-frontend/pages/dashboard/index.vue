<template>
  <section class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold">
        {{ workspace?.name }}
      </h1>

      <p class="text-slate-500">
        {{ workspace?.description }}
      </p>
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
