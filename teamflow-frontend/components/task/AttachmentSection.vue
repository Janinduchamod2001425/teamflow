<template>
  <div class="space-y-4">
    <h3 class="text-sm font-semibold text-slate-700">Attachments</h3>

    <div v-if="attachmentStore.loading" class="text-sm text-slate-400">
      Loading attachments...
    </div>

    <ul v-else-if="attachmentStore.attachments.length > 0" class="space-y-2">
      <li
        v-for="att in attachmentStore.attachments"
        :key="att.id"
        class="flex items-center gap-3 rounded-xl border border-slate-200 p-3"
      >
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500"
        >
          <svg
            class="h-4.5 w-4.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 17.25v-6.75a3 3 0 013-3v0a3 3 0 013 3v8.25a4.5 4.5 0 01-9 0V9a6 6 0 0112 0v9"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
            />
          </svg>
        </div>

        <div class="min-w-0 flex-1">
          <a
            :href="AttachmentService.fileUrl(att.fileName)"
            class="block truncate text-sm font-medium text-indigo-600 hover:underline"
            rel="noopener"
            target="_blank"
          >
            {{ att.originalName }}
          </a>
          <p class="text-xs text-slate-400">
            {{ formatSize(att.size) }} · {{ formatDate(att.createdAt) }}
          </p>
        </div>

        <button
          class="shrink-0 text-xs text-slate-400 hover:text-red-600"
          @click="confirmDelete(att)"
        >
          Delete
        </button>
      </li>
    </ul>

    <p v-else class="text-sm text-slate-400">No attachments yet.</p>

    <div>
      <input
        ref="fileInput"
        class="hidden"
        type="file"
        @change="handleFileSelect"
      />
      <button
        :disabled="uploading"
        class="w-full rounded-xl border border-dashed border-slate-300 px-4 py-2.5 text-sm text-slate-500 transition hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-60"
        @click="fileInput?.click()"
      >
        {{ uploading ? `Uploading... ${uploadProgress}%` : "+ Attach File" }}
      </button>
    </div>

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="deletingAttachment"
          class="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4"
          @click.self="deletingAttachment = null"
        >
          <div
            class="w-full max-w-sm rounded-2xl border border-white/20 bg-white p-6 shadow-2xl"
          >
            <h2 class="text-lg font-bold text-slate-900">Delete attachment?</h2>
            <p class="mt-2 text-sm text-slate-500">
              <span class="font-medium text-slate-700">{{
                deletingAttachment?.originalName
              }}</span>
              will be permanently removed. This can't be undone.
            </p>
            <div class="mt-6 flex justify-end gap-3">
              <button
                class="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                @click="deletingAttachment = null"
              >
                Cancel
              </button>
              <button
                :disabled="deleteLoading"
                class="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                @click="performDelete"
              >
                {{ deleteLoading ? "Deleting..." : "Delete" }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { AttachmentService } from "~/services/attachment.service";
import type { Attachment } from "~/types/attachment";

const props = defineProps<{
  workspaceId: string;
  taskId: string;
}>();

const attachmentStore = useAttachmentStore();
const toast = useToast();

const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const uploadProgress = ref(0);

const deletingAttachment = ref<Attachment | null>(null);
const deleteLoading = ref(false);

onMounted(async () => {
  await attachmentStore.fetchAttachments(props.workspaceId, props.taskId);
});

async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (file.size > 10 * 1024 * 1024) {
    toast.error("File is too large (max 10MB)");
    input.value = "";
    return;
  }

  uploading.value = true;
  uploadProgress.value = 0;

  try {
    await attachmentStore.uploadAttachment(
      props.workspaceId,
      props.taskId,
      file,
      (p) => {
        uploadProgress.value = p;
      },
    );
    toast.success("File uploaded");
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to upload file");
  } finally {
    uploading.value = false;
    input.value = "";
  }
}

function confirmDelete(attachment: Attachment) {
  deletingAttachment.value = attachment;
}

async function performDelete() {
  if (!deletingAttachment.value) return;

  deleteLoading.value = true;
  try {
    await attachmentStore.removeAttachment(
      props.workspaceId,
      props.taskId,
      deletingAttachment.value.id,
    );
    toast.success("Attachment removed");
    deletingAttachment.value = null;
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to remove attachment");
  } finally {
    deleteLoading.value = false;
  }
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}
</script>
