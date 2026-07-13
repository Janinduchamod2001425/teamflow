import { api } from "./api";

export const DashboardService = {
  getWorkspaceDashboard(workspaceId: string) {
    return api.get(`/workspaces/${workspaceId}/dashboard`);
  },
};
