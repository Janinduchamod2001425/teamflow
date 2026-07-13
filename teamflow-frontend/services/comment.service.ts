import { api } from "./api";
import type { CreateCommentDto, UpdateCommentDto } from "~/types/comment";

export const CommentService = {
  findAll(workspaceId: string, projectId: string, taskId: string) {
    return api.get(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`,
    );
  },

  create(
    workspaceId: string,
    projectId: string,
    taskId: string,
    data: CreateCommentDto,
  ) {
    return api.post(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments`,
      data,
    );
  },

  update(
    workspaceId: string,
    projectId: string,
    taskId: string,
    commentId: string,
    data: UpdateCommentDto,
  ) {
    return api.patch(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
      data,
    );
  },

  remove(
    workspaceId: string,
    projectId: string,
    taskId: string,
    commentId: string,
  ) {
    return api.delete(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}/comments/${commentId}`,
    );
  },
};
