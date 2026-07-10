import { api } from "~/services/api";

export const DashboardServices = {
  getWorkspaceDashboard(workspaceId: string) {
    return api.get(`/workspaces/${workspaceId}/dashboard`);
  },
};
