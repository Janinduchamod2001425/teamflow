import { defineStore } from "pinia";
import { WorkspaceService } from "~/services/workspace.service";

interface Workspace {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export const useWorkspaceStore = defineStore("workspace", () => {
  const workspaces = ref<Workspace[]>([]);
  const selectedWorkspace = ref<Workspace | null>(null);
  const loading = ref(false);

  async function fetchWorkspaces() {
    loading.value = true;

    try {
      const response = await WorkspaceService.findAll();
      workspaces.value = response.data.data;

      if (!selectedWorkspace.value && workspaces.value.length > 0) {
        selectedWorkspace.value = workspaces.value[0];
      }

      return workspaces.value;
    } finally {
      loading.value = false;
    }
  }

  function selectWorkspace(workspace: Workspace) {
    selectedWorkspace.value = workspace;
  }

  return {
    workspaces,
    selectedWorkspace,
    loading,
    fetchWorkspaces,
    selectWorkspace,
  };
});
