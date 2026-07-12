import { api } from "./api";
import type { CreateProjectDto, UpdateProjectDto } from "~/types/project";

export const ProjectService = {
  findAll(workspaceId: string) {
    return api.get(`/workspaces/${workspaceId}/projects`);
  },

  findOne(workspaceId: string, projectId: string) {
    return api.get(`/workspaces/${workspaceId}/projects/${projectId}`);
  },

  create(workspaceId: string, data: CreateProjectDto) {
    return api.post(`/workspaces/${workspaceId}/projects`, data);
  },

  update(workspaceId: string, projectId: string, data: UpdateProjectDto) {
    return api.patch(`/workspaces/${workspaceId}/projects/${projectId}`, data);
  },

  remove(workspaceId: string, projectId: string) {
    return api.delete(`/workspaces/${workspaceId}/projects/${projectId}`);
  },
};
