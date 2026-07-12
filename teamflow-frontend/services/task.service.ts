import { api } from "./api";
import type {
  CreateTaskDto,
  UpdateTaskDto,
  TaskStatus,
  TaskSearchParams,
} from "~/types/task";

export const TaskService = {
  findAllByProject(workspaceId: string, projectId: string) {
    return api.get(`/workspaces/${workspaceId}/tasks`, {
      params: { projectId },
    });
  },

  getBoard(workspaceId: string, projectId: string) {
    return api.get(`/workspaces/${workspaceId}/tasks/board`, {
      params: { projectId },
    });
  },

  search(workspaceId: string, params: TaskSearchParams) {
    return api.get(`/workspaces/${workspaceId}/tasks/search`, { params });
  },

  findOne(workspaceId: string, taskId: string) {
    return api.get(`/workspaces/${workspaceId}/tasks/${taskId}`);
  },

  create(workspaceId: string, data: CreateTaskDto) {
    return api.post(`/workspaces/${workspaceId}/tasks`, data);
  },

  update(workspaceId: string, taskId: string, data: UpdateTaskDto) {
    return api.patch(`/workspaces/${workspaceId}/tasks/${taskId}`, data);
  },

  updateStatus(workspaceId: string, taskId: string, status: TaskStatus) {
    return api.patch(`/workspaces/${workspaceId}/tasks/${taskId}/status`, {
      status,
    });
  },

  remove(workspaceId: string, taskId: string) {
    return api.delete(`/workspaces/${workspaceId}/tasks/${taskId}`);
  },
};
