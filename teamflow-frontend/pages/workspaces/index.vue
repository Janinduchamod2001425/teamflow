<template>
  <div class="space-y-6">
    <div
      class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-3xl font-bold text-slate-900">Workspaces</h1>
        <p class="mt-2 text-slate-500">Manage your team workspaces.</p>
      </div>

      <button
        class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Create Workspace
      </button>
    </div>

    <div v-if="workspaceStore.loading" class="text-slate-500">
      Loading workspaces...
    </div>

    <div v-else class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="workspace in workspaceStore.workspaces"
        :key="workspace.id"
        class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md"
      >
        <h2 class="text-lg font-semibold text-slate-900">
          {{ workspace.name }}
        </h2>

        <p class="mt-2 text-sm text-slate-500">
          {{ workspace.description || "No description available." }}
        </p>

        <button
          class="mt-4 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          @click="selectWorkspace(workspace)"
        >
          Open Workspace
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});

const workspaceStore = useWorkspaceStore();

onMounted(async () => {
  await workspaceStore.fetchWorkspaces();
});

function selectWorkspace(workspace: any) {
  workspaceStore.selectWorkspace(workspace);
  navigateTo("/dashboard");
}
</script>
