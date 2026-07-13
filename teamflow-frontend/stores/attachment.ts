import { defineStore } from "pinia";
import { ref } from "vue";
import { AttachmentService } from "~/services/attachment.service";
import type { Attachment } from "~/types/attachment";

export const useAttachmentStore = defineStore("attachment", () => {
  const attachments = ref<Attachment[]>([]);
  const loading = ref(false);

  async function fetchAttachments(workspaceId: string, taskId: string) {
    loading.value = true;
    try {
      const response = await AttachmentService.findAll(workspaceId, taskId);
      attachments.value = response.data.data;
    } finally {
      loading.value = false;
    }
  }

  async function uploadAttachment(
    workspaceId: string,
    taskId: string,
    file: File,
    onProgress?: (percent: number) => void,
  ) {
    const response = await AttachmentService.upload(
      workspaceId,
      taskId,
      file,
      onProgress,
    );
    attachments.value.push(response.data.data);
  }

  async function removeAttachment(
    workspaceId: string,
    taskId: string,
    attachmentId: string,
  ) {
    await AttachmentService.remove(workspaceId, taskId, attachmentId);
    attachments.value = attachments.value.filter((a) => a.id !== attachmentId);
  }

  function reset() {
    attachments.value = [];
  }

  return {
    attachments,
    loading,
    fetchAttachments,
    uploadAttachment,
    removeAttachment,
    reset,
  };
});
