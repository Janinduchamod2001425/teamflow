<template>
  <div class="space-y-4">
    <h3 class="text-sm font-semibold text-slate-700">Comments</h3>

    <div v-if="commentStore.loading" class="text-sm text-slate-400">
      Loading comments...
    </div>

    <div v-else class="max-h-64 space-y-3 overflow-y-auto pr-1">
      <div
        v-for="comment in commentStore.comments"
        :key="comment.id"
        class="flex gap-2.5"
      >
        <div
          class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-semibold text-indigo-700"
        >
          {{ comment.user.name.charAt(0).toUpperCase() }}
        </div>

        <div class="flex-1 rounded-xl bg-slate-50 px-3 py-2">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-semibold text-slate-800">{{
              comment.user.name
            }}</span>
            <span class="text-[11px] text-slate-400">{{
              formatDate(comment.createdAt)
            }}</span>
          </div>

          <p
            v-if="editingId !== comment.id"
            class="mt-1 whitespace-pre-wrap text-sm text-slate-700"
          >
            {{ comment.content }}
          </p>

          <div v-else class="mt-1.5 space-y-2">
            <textarea
              v-model="editText"
              class="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm"
              rows="2"
            />
            <div class="flex gap-2">
              <button
                class="text-xs font-medium text-indigo-600"
                @click="saveEdit(comment.id)"
              >
                Save
              </button>
              <button class="text-xs text-slate-400" @click="cancelEdit">
                Cancel
              </button>
            </div>
          </div>

          <div
            v-if="
              editingId !== comment.id &&
              (comment.user.id === currentUserId || canManage)
            "
            class="mt-1 flex gap-3"
          >
            <button
              v-if="comment.user.id === currentUserId"
              class="text-[11px] text-slate-400 hover:text-indigo-600"
              @click="startEdit(comment)"
            >
              Edit
            </button>
            <button
              class="text-[11px] text-slate-400 hover:text-red-600"
              @click="removeComment(comment.id)"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <p
        v-if="!commentStore.loading && commentStore.comments.length === 0"
        class="text-sm text-slate-400"
      >
        No comments yet.
      </p>
    </div>

    <form class="flex gap-2" @submit.prevent="submitComment">
      <input
        v-model="newComment"
        class="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
        placeholder="Write a comment..."
      />
      <button
        :disabled="!newComment.trim() || submitting"
        class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        Send
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import type { Comment } from "~/types/comment";

const props = defineProps<{
  workspaceId: string;
  projectId: string;
  taskId: string;
  currentUserId?: string;
  canManage?: boolean;
}>();

const commentStore = useCommentStore();
const toast = useToast();

const newComment = ref("");
const submitting = ref(false);
const editingId = ref<string | null>(null);
const editText = ref("");

onMounted(async () => {
  await commentStore.fetchComments(
    props.workspaceId,
    props.projectId,
    props.taskId,
  );
});

function startEdit(comment: Comment) {
  editingId.value = comment.id;
  editText.value = comment.content;
}

function cancelEdit() {
  editingId.value = null;
  editText.value = "";
}

async function saveEdit(commentId: string) {
  if (!editText.value.trim()) return;
  try {
    await commentStore.editComment(
      props.workspaceId,
      props.projectId,
      props.taskId,
      commentId,
      {
        content: editText.value.trim(),
      },
    );
    cancelEdit();
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to update comment");
  }
}

const emit = defineEmits<{
  commentCountChange: [taskId: string, delta: number];
}>();

async function submitComment() {
  if (!newComment.value.trim()) return;
  submitting.value = true;
  try {
    await commentStore.addComment(
      props.workspaceId,
      props.projectId,
      props.taskId,
      {
        content: newComment.value.trim(),
      },
    );
    newComment.value = "";
    emit("commentCountChange", props.taskId, 1);
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to add comment");
  } finally {
    submitting.value = false;
  }
}

async function removeComment(commentId: string) {
  try {
    await commentStore.removeComment(
      props.workspaceId,
      props.projectId,
      props.taskId,
      commentId,
    );
    toast.success("Comment deleted");
    emit("commentCountChange", props.taskId, -1);
  } catch (err: any) {
    toast.error(err?.response?.data?.message || "Failed to delete comment");
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
</script>
