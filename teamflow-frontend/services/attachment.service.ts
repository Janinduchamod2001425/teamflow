import { api } from "./api";

const BACKEND_ORIGIN = "http://localhost:3000";

export const AttachmentService = {
  findAll(workspaceId: string, taskId: string) {
    return api.get(`/workspaces/${workspaceId}/tasks/${taskId}/attachments`);
  },

  upload(
    workspaceId: string,
    taskId: string,
    file: File,
    onProgress?: (percent: number) => void,
  ) {
    const formData = new FormData();
    formData.append("file", file);

    return api.post(
      `/workspaces/${workspaceId}/tasks/${taskId}/attachments`,
      formData,
      {
        headers: {
          "Content-Type": undefined, // let the browser set the correct multipart boundary
        },
        onUploadProgress: (evt) => {
          if (onProgress && evt.total) {
            onProgress(Math.round((evt.loaded / evt.total) * 100));
          }
        },
      },
    );
  },

  remove(workspaceId: string, taskId: string, attachmentId: string) {
    return api.delete(
      `/workspaces/${workspaceId}/tasks/${taskId}/attachments/${attachmentId}`,
    );
  },

  fileUrl(fileName: string) {
    return `${BACKEND_ORIGIN}/uploads/${fileName}`;
  },
};
