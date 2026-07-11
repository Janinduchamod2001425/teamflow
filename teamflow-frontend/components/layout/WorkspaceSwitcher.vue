<template>
  <div class="relative">
    <button
      class="flex w-full items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      @click="open = !open"
    >
      <span class="truncate">{{
        workspaceStore.selectedWorkspace?.name || "Select workspace"
      }}</span>
      <svg
        class="h-4 w-4 shrink-0 text-slate-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          d="M19 9l-7 7-7-7"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </svg>
    </button>

    <div
      v-if="open"
      class="absolute left-0 top-full z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
    >
      <button
        v-for="ws in workspaceStore.workspaces"
        :key="ws.id"
        :class="
          ws.id === workspaceStore.selectedWorkspace?.id
            ? 'text-indigo-600 font-medium'
            : 'text-slate-700'
        "
        class="flex w-full items-center px-3 py-2 text-left text-sm hover:bg-slate-50"
        @click="select(ws)"
      >
        {{ ws.name }}
      </button>

      <NuxtLink
        class="block border-t border-slate-100 px-3 py-2 text-sm text-slate-500 hover:bg-slate-50"
        to="/workspaces"
        @click="open = false"
      >
        Manage workspaces
      </NuxtLink>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Workspace } from "~/types/workspace";

const workspaceStore = useWorkspaceStore();
const open = ref(false);

onMounted(async () => {
  workspaceStore.initializeWorkspace();
  if (workspaceStore.workspaces.length === 0) {
    await workspaceStore.fetchWorkspaces();
  }
});

function select(ws: Workspace) {
  workspaceStore.selectWorkspace(ws);
  open.value = false;
}
</script>
