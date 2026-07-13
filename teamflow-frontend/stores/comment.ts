import { defineStore } from "pinia";
import { ref } from "vue";
import { CommentService } from "~/services/comment.service";
import type {
  Comment,
  CreateCommentDto,
  UpdateCommentDto,
} from "~/types/comment";

export const useCommentStore = defineStore("comment", () => {
  const comments = ref<Comment[]>([]);
  const loading = ref(false);
  let requestId = 0;

  async function fetchComments(
    workspaceId: string,
    projectId: string,
    taskId: string,
  ) {
    const currentRequest = ++requestId;
    loading.value = true;

    try {
      const response = await CommentService.findAll(
        workspaceId,
        projectId,
        taskId,
      );

      // Ignore this result if a newer fetch has started since this one began.
      if (currentRequest !== requestId) return;

      comments.value = response.data.data;
    } finally {
      if (currentRequest === requestId) {
        loading.value = false;
      }
    }
  }

  async function addComment(
    workspaceId: string,
    projectId: string,
    taskId: string,
    data: CreateCommentDto,
  ) {
    const response = await CommentService.create(
      workspaceId,
      projectId,
      taskId,
      data,
    );
    comments.value.push(response.data.data);
    return response.data.data;
  }

  async function editComment(
    workspaceId: string,
    projectId: string,
    taskId: string,
    commentId: string,
    data: UpdateCommentDto,
  ) {
    const response = await CommentService.update(
      workspaceId,
      projectId,
      taskId,
      commentId,
      data,
    );
    const idx = comments.value.findIndex((c) => c.id === commentId);
    if (idx !== -1) comments.value[idx] = response.data.data;
  }

  async function removeComment(
    workspaceId: string,
    projectId: string,
    taskId: string,
    commentId: string,
  ) {
    await CommentService.remove(workspaceId, projectId, taskId, commentId);
    comments.value = comments.value.filter((c) => c.id !== commentId);
  }

  function reset() {
    comments.value = [];
    requestId++; // invalidates any in-flight fetch immediately
  }

  return {
    comments,
    loading,
    fetchComments,
    addComment,
    editComment,
    removeComment,
    reset,
  };
});
