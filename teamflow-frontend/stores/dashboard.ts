import { defineStore } from "pinia";
import { ref } from "vue";
import { DashboardService } from "~/services/dashboard.service";
import type { WorkspaceDashboard } from "~/types/dashboard";

export const useDashboardStore = defineStore("dashboard", () => {
  const data = ref<WorkspaceDashboard | null>(null);
  const loading = ref(false);

  async function fetchDashboard(workspaceId: string) {
    loading.value = true;
    try {
      const response =
        await DashboardService.getWorkspaceDashboard(workspaceId);
      data.value = response.data.data;
    } finally {
      loading.value = false;
    }
  }

  function reset() {
    data.value = null;
  }

  return { data, loading, fetchDashboard, reset };
});
