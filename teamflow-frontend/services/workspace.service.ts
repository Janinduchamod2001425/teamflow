import { api } from "./api";

export const WorkspaceService = {
  findAll() {
    return api.get("/workspaces");
  },

  create(data: any) {
    return api.post("/workspaces", data);
  },

  update(id: string, data: any) {
    return api.patch(`/workspaces/${id}`, data);
  },

  remove(id: string) {
    return api.delete(`/workspaces/${id}`);
  },
};
