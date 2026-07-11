import { api } from "~/services/api";

export const DashboardService = {
  getWorkspaceDashboard(workspaceId: string) {
    return api.get(`/workspaces/${workspaceId}/dashboard`);
  },
};
