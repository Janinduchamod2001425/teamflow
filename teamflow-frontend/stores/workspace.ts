import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { WorkspaceService } from "~/services/workspace.service";

import type {
  Workspace,
  CreateWorkspaceDto,
  UpdateWorkspaceDto,
} from "~/types/workspace";

export const useWorkspaceStore = defineStore("workspace", () => {
  const workspaces = ref<Workspace[]>([]);
  const selectedWorkspace = ref<Workspace | null>(null);
  const loading = ref(false);

  function initializeWorkspace() {
    if (!import.meta.client) return;

    const stored = localStorage.getItem("selectedWorkspace");

    if (stored) {
      selectedWorkspace.value = JSON.parse(stored);
    }
  }

  async function fetchWorkspaces() {
    loading.value = true;

    try {
      const response = await WorkspaceService.findAll();

      workspaces.value = response.data.data;

      if (!selectedWorkspace.value && workspaces.value.length > 0) {
        selectWorkspace(workspaces.value[0]);
      }
    } finally {
      loading.value = false;
    }
  }

  function selectWorkspace(workspace: Workspace) {
    selectedWorkspace.value = workspace;

    if (import.meta.client) {
      localStorage.setItem("selectedWorkspace", JSON.stringify(workspace));
    }
  }

  async function createWorkspace(data: CreateWorkspaceDto) {
    await WorkspaceService.create(data);
    await fetchWorkspaces();
  }

  async function updateWorkspace(id: string, data: UpdateWorkspaceDto) {
    await WorkspaceService.update(id, data);
    await fetchWorkspaces();
  }

  async function deleteWorkspace(id: string) {
    await WorkspaceService.remove(id);

    if (selectedWorkspace.value?.id === id) {
      selectedWorkspace.value = null;
      localStorage.removeItem("selectedWorkspace");
    }

    await fetchWorkspaces();
  }

  const myRole = computed(() => {
    const authStore = useAuthStore();
    const uid = authStore.user?.id;
    if (!uid || !selectedWorkspace.value?.members) return null;

    const me = selectedWorkspace.value.members.find((m) => m.user.id === uid);
    return me?.role ?? null;
  });

  const isAdmin = computed(() => myRole.value === "ADMIN");
  const isManagerOrAbove = computed(
    () => myRole.value === "ADMIN" || myRole.value === "MANAGER",
  );

  return {
    workspaces,
    selectedWorkspace,
    loading,

    initializeWorkspace,
    fetchWorkspaces,
    selectWorkspace,

    createWorkspace,
    updateWorkspace,
    deleteWorkspace,

    myRole,
    isAdmin,
    isManagerOrAbove,
  };
});
