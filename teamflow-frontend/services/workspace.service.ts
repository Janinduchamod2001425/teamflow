import { api } from "./api";

export const WorkspaceService = {
  findAll() {
    return api.get("/workspaces");
  },
};
